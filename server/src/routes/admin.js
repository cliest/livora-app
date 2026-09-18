import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signAdminToken, setAuthCookie, clearAuthCookie, requireAdmin } from '../lib/auth.js';

export const adminRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// POST /api/admin/login
adminRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Enter an email and password' });

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

  // Constant-shape response whether the user exists or not, so we don't leak
  // which emails have accounts.
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!valid) return res.status(401).json({ ok: false, error: 'Incorrect email or password' });

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  const token = signAdminToken(admin);
  setAuthCookie(res, token);
  res.json({ ok: true, admin: { email: admin.email, name: admin.name } });
});

// POST /api/admin/logout
adminRouter.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// GET /api/admin/me — used by the dashboard to check the session on load
adminRouter.get('/me', requireAdmin, async (req, res) => {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin.sub } });
  if (!admin) return res.status(401).json({ ok: false });
  res.json({ ok: true, admin: { email: admin.email, name: admin.name } });
});

// GET /api/admin/summary — quick counts for the dashboard header
adminRouter.get('/summary', requireAdmin, async (req, res) => {
  const [pendingBookings, pendingMessages, todaysBookings] = await Promise.all([
    prisma.bookingRequest.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { status: 'PENDING' } }),
    prisma.bookingRequest.count({
      where: { preferredDate: { gte: new Date(new Date().toDateString()) } },
    }),
  ]);
  res.json({ ok: true, pendingBookings, pendingMessages, todaysBookings });
});
