import { createRouter } from '../lib/router.js';
import { prisma, isNotFoundError } from '../lib/prisma.js';
import { notifyClinic } from '../lib/mailer.js';
import { requireAdmin } from '../lib/auth.js';
import {
  bookingSchema,
  zodIssuesToFieldErrors,
  isoDate,
  SERVICE_MAP,
  PATIENT_MAP,
} from '../lib/validation.js';
import { SLOT_HOURS, ACTIVE_STATUSES, slotLabel, clinicNow, isPastSlot, slotLockKey } from '../lib/slots.js';

export const bookingsRouter = createRouter();

const SLOT_TAKEN_MESSAGE = 'Sorry, someone has just booked that time. Please choose another.';

class SlotTakenError extends Error {}

// Bookings that hold a slot: active, and not an emergency (those never
// block anyone, see lib/slots.js).
const slotHoldersWhere = (date) => ({
  preferredDate: new Date(date),
  slotHour: { not: null },
  status: { in: ACTIVE_STATUSES },
  service: { not: 'EMERGENCY' },
});

const SERVICE_LABEL = {
  EMERGENCY: 'Emergency / in pain right now',
  CHECKUP: 'Check-up & cleaning',
  FILLING: 'Filling or tooth repair',
  ROOT_CANAL: 'Root canal treatment',
  CROWN_BRIDGE: 'Crown or bridge',
  EXTRACTION: 'Extraction / wisdom tooth',
  IMPLANT: 'Dental implant',
  BRACES: 'Braces or clear aligners',
  WHITENING: 'Teeth whitening or veneers',
  CHILDREN: "Children's dentistry",
  DENTURE: 'Dentures',
  OTHER: 'Something else / not sure',
};

// GET /api/bookings/availability?date=YYYY-MM-DD — public. Says only
// whether each slot is free; never who booked it.
bookingsRouter.get('/availability', async (req, res) => {
  const parsed = isoDate.safeParse(req.query.date);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please choose a valid date.' });
  const date = parsed.data;

  const holders = await prisma.bookingRequest.findMany({
    where: slotHoldersWhere(date),
    select: { slotHour: true },
  });
  const taken = new Set(holders.map((b) => b.slotHour));
  const now = clinicNow();

  res.json({
    ok: true,
    date,
    slots: SLOT_HOURS.map((hour) => {
      const status = isPastSlot(date, hour, now) ? 'past' : taken.has(hour) ? 'taken' : 'available';
      return { hour, label: slotLabel(hour), status };
    }),
  });
});

// POST /api/bookings — public, submitted from the Book page's form
bookingsRouter.post('/', async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, errors: zodIssuesToFieldErrors(parsed.error) });
  }
  const d = parsed.data;
  const urgent = d.service === 'emergency';

  if (isPastSlot(d.preferredDate, d.slotHour)) {
    return res.status(422).json({ ok: false, errors: { slotHour: 'That time has already passed. Please choose a later one.' } });
  }

  try {
    // The advisory lock serialises concurrent requests for the same date +
    // slot, so the check-then-insert below can't let two people both take
    // it. The lock is released when the transaction ends.
    const booking = await prisma.$transaction(async (tx) => {
      if (!urgent) {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${slotLockKey(d.preferredDate, d.slotHour)})`;
        const held = await tx.bookingRequest.count({
          where: { ...slotHoldersWhere(d.preferredDate), slotHour: d.slotHour },
        });
        if (held > 0) throw new SlotTakenError();
      }

      return tx.bookingRequest.create({
        data: {
          fullName: d.fullName,
          phone: d.phone,
          email: d.email || null,
          patientType: d.patientType ? PATIENT_MAP[d.patientType] : null,
          service: SERVICE_MAP[d.service],
          preferredDate: new Date(d.preferredDate),
          slotHour: d.slotHour,
          message: d.message || null,
          consentGiven: d.consentGiven,
          ipAddress: req.ip,
          userAgent: req.get('user-agent') || null,
        },
      });
    });

    notifyClinic({
      subject: `${urgent ? '🚨 EMERGENCY ' : ''}New booking request — ${d.fullName}`,
      replyTo: d.email || undefined,
      text: [
        `New appointment request from the website.`,
        ``,
        `Name: ${d.fullName}`,
        `Phone: ${d.phone}`,
        `Email: ${d.email || '(not given)'}`,
        `Service: ${SERVICE_LABEL[SERVICE_MAP[d.service]]}`,
        `Preferred date: ${d.preferredDate}`,
        `Preferred time: ${slotLabel(d.slotHour)}`,
        `Message: ${d.message || '(none)'}`,
      ].join('\n'),
    }).catch(() => {}); // never fail the request over email delivery

    return res.status(201).json({ ok: true, id: booking.id });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return res.status(409).json({ ok: false, errors: { slotHour: SLOT_TAKEN_MESSAGE } });
    }
    console.error('[bookings] create failed:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please call us instead.' });
  }
});

// GET /api/bookings — admin only, listing for the dashboard
bookingsRouter.get('/', requireAdmin, async (req, res) => {
  const { status, from, to, q, page = '1', pageSize = '25' } = req.query;
  const take = Math.min(Number(pageSize) || 25, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    ...(status ? { status: String(status).toUpperCase() } : {}),
    ...(from || to
      ? {
          preferredDate: {
            ...(from ? { gte: new Date(String(from)) } : {}),
            ...(to ? { lte: new Date(String(to)) } : {}),
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: String(q), mode: 'insensitive' } },
            { phone: { contains: String(q), mode: 'insensitive' } },
            { email: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.bookingRequest.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
    prisma.bookingRequest.count({ where }),
  ]);

  res.json({ ok: true, items, total, page: Number(page), pageSize: take });
});

// PATCH /api/bookings/:id — admin updates status / staff notes
bookingsRouter.patch('/:id', requireAdmin, async (req, res) => {
  const { status, staffNotes } = req.body;
  const VALID = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (status && !VALID.includes(status)) {
    return res.status(422).json({ ok: false, error: 'Invalid status' });
  }
  try {
    const updated = await prisma.bookingRequest.update({
      where: { id: req.params.id },
      data: {
        ...(status ? { status } : {}),
        ...(staffNotes !== undefined ? { staffNotes } : {}),
      },
    });
    res.json({ ok: true, item: updated });
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
    res.status(404).json({ ok: false, error: 'Booking not found' });
  }
});
