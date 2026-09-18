import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

// Public-facing router: mounted at /api/accreditations — published only.
export const accreditationsRouter = Router();
// Admin CRUD router: mounted at /api/admin/accreditations — sees everything.
export const accreditationsAdminRouter = Router();

const accreditationSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title'),
  badgeUrl: z.string().trim().min(1).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().optional(),
  published: z.coerce.boolean().optional(),
});

accreditationsRouter.get('/', async (req, res) => {
  const items = await prisma.accreditation.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  res.json({ ok: true, items });
});

accreditationsAdminRouter.get('/', requireAdmin, async (req, res) => {
  const items = await prisma.accreditation.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.json({ ok: true, items });
});

accreditationsAdminRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = accreditationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.badgeUrl === '') data.badgeUrl = null;
  const item = await prisma.accreditation.create({ data });
  res.status(201).json({ ok: true, item });
});

accreditationsAdminRouter.patch('/:id', requireAdmin, async (req, res) => {
  const parsed = accreditationSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.badgeUrl === '') data.badgeUrl = null;
  try {
    const item = await prisma.accreditation.update({ where: { id: req.params.id }, data });
    res.json({ ok: true, item });
  } catch {
    res.status(404).json({ ok: false, error: 'Accreditation not found' });
  }
});

accreditationsAdminRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.accreditation.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Accreditation not found' });
  }
});
