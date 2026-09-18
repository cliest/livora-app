import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { notifyClinic } from '../lib/mailer.js';
import { requireAdmin } from '../lib/auth.js';
import {
  bookingSchema,
  zodIssuesToFieldErrors,
  SERVICE_MAP,
  TIME_MAP,
  NHIMA_MAP,
  PATIENT_MAP,
} from '../lib/validation.js';

export const bookingsRouter = Router();

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

// POST /api/bookings — public, submitted from book.html's form
bookingsRouter.post('/', async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, errors: zodIssuesToFieldErrors(parsed.error) });
  }
  const d = parsed.data;

  try {
    const booking = await prisma.bookingRequest.create({
      data: {
        fullName: d.fullName,
        phone: d.phone,
        email: d.email || null,
        patientType: d.patientType ? PATIENT_MAP[d.patientType] : null,
        service: SERVICE_MAP[d.service],
        preferredDate: new Date(d.preferredDate),
        preferredTime: TIME_MAP[d.preferredTime],
        nhimaMember: NHIMA_MAP[d.nhimaMember],
        message: d.message || null,
        consentGiven: d.consentGiven,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
      },
    });

    const urgent = d.service === 'emergency';
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
        `Preferred time: ${d.preferredTime}`,
        `NHIMA member: ${d.nhimaMember}`,
        `Message: ${d.message || '(none)'}`,
      ].join('\n'),
    }).catch(() => {}); // never fail the request over email delivery

    return res.status(201).json({ ok: true, id: booking.id });
  } catch (err) {
    console.error('[bookings] create failed:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please call us instead.' });
  }
});

// GET /api/bookings — admin only, listing for the dashboard
bookingsRouter.get('/', requireAdmin, async (req, res) => {
  const { status, from, to, page = '1', pageSize = '25' } = req.query;
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
    res.status(404).json({ ok: false, error: 'Booking not found' });
  }
});
