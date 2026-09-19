import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { notifyClinic } from '../lib/mailer.js';
import { requireAdmin } from '../lib/auth.js';
import { contactSchema, zodIssuesToFieldErrors, SUBJECT_MAP } from '../lib/validation.js';

export const contactRouter = Router();

// POST /api/contact — public, submitted from contact.html's form
contactRouter.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, errors: zodIssuesToFieldErrors(parsed.error) });
  }
  const d = parsed.data;

  try {
    const msg = await prisma.contactMessage.create({
      data: {
        fullName: d.fullName,
        email: d.email,
        phone: d.phone || null,
        subject: SUBJECT_MAP[d.subject],
        message: d.message,
        consentGiven: d.consentGiven,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
      },
    });

    notifyClinic({
      subject: `New website message — ${d.fullName}`,
      replyTo: d.email,
      text: [
        `New contact form message from the website.`,
        ``,
        `Name: ${d.fullName}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone || '(not given)'}`,
        `Subject: ${d.subject}`,
        ``,
        d.message,
      ].join('\n'),
    }).catch(() => {});

    return res.status(201).json({ ok: true, id: msg.id });
  } catch (err) {
    console.error('[contact] create failed:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please email or call us instead.' });
  }
});

// GET /api/contact — admin listing
contactRouter.get('/', requireAdmin, async (req, res) => {
  const { status, q, page = '1', pageSize = '25' } = req.query;
  const take = Math.min(Number(pageSize) || 25, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    ...(status ? { status: String(status).toUpperCase() } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: String(q), mode: 'insensitive' } },
            { email: { contains: String(q), mode: 'insensitive' } },
            { phone: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
    prisma.contactMessage.count({ where }),
  ]);
  res.json({ ok: true, items, total, page: Number(page), pageSize: take });
});

contactRouter.patch('/:id', requireAdmin, async (req, res) => {
  const { status, staffNotes } = req.body;
  const VALID = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (status && !VALID.includes(status)) {
    return res.status(422).json({ ok: false, error: 'Invalid status' });
  }
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: {
        ...(status ? { status } : {}),
        ...(staffNotes !== undefined ? { staffNotes } : {}),
      },
    });
    res.json({ ok: true, item: updated });
  } catch (err) {
    res.status(404).json({ ok: false, error: 'Message not found' });
  }
});
