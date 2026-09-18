import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

// Public-facing router: mounted at /api/team — published members only.
export const teamRouter = Router();
// Admin CRUD router: mounted at /api/admin/team — sees everything.
export const teamAdminRouter = Router();

const memberSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a name'),
  role: z.string().trim().min(1, 'Please enter a role'),
  bio: z.string().trim().min(1, 'Please enter a short bio'),
  credentials: z.string().trim().min(1, 'Please enter credentials'),
  photoUrl: z.string().trim().url().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().optional(),
  published: z.coerce.boolean().optional(),
});

teamRouter.get('/', async (req, res) => {
  const items = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  res.json({ ok: true, items });
});

teamAdminRouter.get('/', requireAdmin, async (req, res) => {
  const items = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.json({ ok: true, items });
});

teamAdminRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = memberSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.photoUrl === '') data.photoUrl = null;
  const item = await prisma.teamMember.create({ data });
  res.status(201).json({ ok: true, item });
});

teamAdminRouter.patch('/:id', requireAdmin, async (req, res) => {
  const parsed = memberSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.photoUrl === '') data.photoUrl = null;
  try {
    const item = await prisma.teamMember.update({ where: { id: req.params.id }, data });
    res.json({ ok: true, item });
  } catch {
    res.status(404).json({ ok: false, error: 'Team member not found' });
  }
});

teamAdminRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Team member not found' });
  }
});
