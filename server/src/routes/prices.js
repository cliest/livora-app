import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

// Public router: mounted at /api/prices — GET only.
export const pricesRouter = Router();
// Admin CRUD router: mounted at /api/admin/prices — categories + items.
// There's no draft/published state for prices, so admin reads the same
// public GET; this router only needs the write endpoints.
export const pricesAdminRouter = Router();

const ICONS = ['SHIELD', 'TOOTH', 'SPARKLE', 'BRACES', 'CROWN', 'BOLT'];

const categorySchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title'),
  icon: z.enum(ICONS),
  note: z.string().trim().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().optional(),
});

const itemSchema = z.object({
  categoryId: z.string().trim().min(1),
  name: z.string().trim().min(1, 'Please enter a treatment name'),
  price: z.string().trim().min(1, 'Please enter a price, e.g. "from K350"'),
  isPopular: z.coerce.boolean().optional(),
  isEmergency: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

async function listCategories() {
  return prisma.priceCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }],
    include: { items: { orderBy: [{ sortOrder: 'asc' }] } },
  });
}

pricesRouter.get('/', async (req, res) => {
  res.json({ ok: true, categories: await listCategories() });
});

pricesAdminRouter.post('/categories', requireAdmin, async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.note === '') data.note = null;
  const category = await prisma.priceCategory.create({ data });
  res.status(201).json({ ok: true, category });
});

pricesAdminRouter.patch('/categories/:id', requireAdmin, async (req, res) => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const data = { ...parsed.data };
  if (data.note === '') data.note = null;
  try {
    const category = await prisma.priceCategory.update({ where: { id: req.params.id }, data });
    res.json({ ok: true, category });
  } catch {
    res.status(404).json({ ok: false, error: 'Price category not found' });
  }
});

pricesAdminRouter.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.priceCategory.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Price category not found' });
  }
});

pricesAdminRouter.post('/items', requireAdmin, async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  try {
    const item = await prisma.priceItem.create({ data: parsed.data });
    res.status(201).json({ ok: true, item });
  } catch {
    res.status(422).json({ ok: false, error: 'Invalid category' });
  }
});

pricesAdminRouter.patch('/items/:id', requireAdmin, async (req, res) => {
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  try {
    const item = await prisma.priceItem.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ ok: true, item });
  } catch {
    res.status(404).json({ ok: false, error: 'Price item not found' });
  }
});

pricesAdminRouter.delete('/items/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.priceItem.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Price item not found' });
  }
});
