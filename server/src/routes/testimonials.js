import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

export const testimonialsRouter = Router();
export const testimonialsAdminRouter = Router();

const testimonialSchema = z.object({
  quote: z.string().trim().min(1, 'Please enter the quote'),
  name: z.string().trim().min(1, 'Please enter a name'),
  role: z.string().trim().min(1, 'Please enter a role, e.g. "Emergency root canal"'),
  sortOrder: z.coerce.number().int().optional(),
  published: z.coerce.boolean().optional(),
});

testimonialsRouter.get('/', async (req, res) => {
  const items = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  res.json({ ok: true, items });
});

testimonialsAdminRouter.get('/', requireAdmin, async (req, res) => {
  const items = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.json({ ok: true, items });
});

testimonialsAdminRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = testimonialSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  const item = await prisma.testimonial.create({ data: parsed.data });
  res.status(201).json({ ok: true, item });
});

testimonialsAdminRouter.patch('/:id', requireAdmin, async (req, res) => {
  const parsed = testimonialSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });
  try {
    const item = await prisma.testimonial.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ ok: true, item });
  } catch {
    res.status(404).json({ ok: false, error: 'Testimonial not found' });
  }
});

testimonialsAdminRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Testimonial not found' });
  }
});
