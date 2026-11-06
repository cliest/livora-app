import crypto from 'node:crypto';
import { createRouter } from '../lib/router.js';
import { prisma, isNotFoundError } from '../lib/prisma.js';
import { ACTIVE_STATUSES, slotLabel } from '../lib/slots.js';

// The clinic's Livora system collects website bookings from here, every minute, from the clinic's main computer.
// It reaches out to the website (so nothing at the clinic is open to the internet), with a private key that both
// sides share: LIVORA_SYNC_KEY here, and the same key in Livora's Settings > Website bookings.
//
//   GET  /api/integrations/livora/bookings                 bookings Livora has not collected yet (oldest first),
//                                                          past dates included: the clinic decides what to do with them
//   POST /api/integrations/livora/bookings/:id/received    { livoraRef }: Livora has it; it is not sent again
//
// Without LIVORA_SYNC_KEY set, these answer 404 as if they did not exist.
export const livoraRouter = createRouter();

const KEY = process.env.LIVORA_SYNC_KEY || '';

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

livoraRouter.use((req, res, next) => {
  if (!KEY) return res.status(404).json({ ok: false, error: 'Not found' });
  const given = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given);
  const b = Buffer.from(KEY);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ ok: false, error: 'Wrong key' });
  next();
});

livoraRouter.get('/bookings', async (req, res) => {
  const rows = await prisma.bookingRequest.findMany({
    where: { sentToLivoraAt: null, status: { in: ACTIVE_STATUSES } },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  res.json({
    ok: true,
    bookings: rows.map((b) => ({
      id: b.id,
      createdAt: b.createdAt,
      fullName: b.fullName,
      phone: b.phone,
      email: b.email,
      patientType: b.patientType, // NEW, RETURNING or null
      service: b.service,
      serviceLabel: SERVICE_LABEL[b.service] ?? b.service,
      emergency: b.service === 'EMERGENCY',
      preferredDate: b.preferredDate.toISOString().slice(0, 10),
      slotHour: b.slotHour, // start hour in clinic time, or null (old bookings with a time band instead)
      slotLabel: b.slotHour == null ? null : slotLabel(b.slotHour),
      preferredTime: b.preferredTime, // old bookings only
      message: b.message,
      status: b.status,
    })),
  });
});

livoraRouter.post('/bookings/:id/received', async (req, res) => {
  const livoraRef = typeof req.body?.livoraRef === 'string' ? req.body.livoraRef.slice(0, 100) : null;
  try {
    await prisma.bookingRequest.update({ where: { id: req.params.id }, data: { sentToLivoraAt: new Date(), livoraRef } });
    res.json({ ok: true });
  } catch (err) {
    if (isNotFoundError(err)) return res.status(404).json({ ok: false, error: 'No such booking' });
    throw err;
  }
});
