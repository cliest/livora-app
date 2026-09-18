import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

export const settingsRouter = Router();

const SETTINGS_ID = 'settings';

const settingsSchema = z.object({
  phoneDisplay: z.string().trim().min(1),
  phoneDial: z.string().trim().min(1),
  email: z.string().trim().email(),
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().min(1),
  facebookUrl: z.string().trim().url().optional().or(z.literal('')),
  instagramUrl: z.string().trim().url().optional().or(z.literal('')),
  tiktokUrl: z.string().trim().url().optional().or(z.literal('')),
});

async function getOrCreateSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

// GET /api/settings — public, read by every page that shows contact details
settingsRouter.get('/', async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ ok: true, settings });
});

// PATCH /api/settings — admin only
settingsRouter.patch('/', requireAdmin, async (req, res) => {
  const parsed = settingsSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Please check the form for errors.' });

  const data = { ...parsed.data };
  for (const key of ['facebookUrl', 'instagramUrl', 'tiktokUrl']) {
    if (data[key] === '') data[key] = null;
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
  res.json({ ok: true, settings });
});
