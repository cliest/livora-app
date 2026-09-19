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
  res.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
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

// --- Admin user management --------------------------------------------
// Any signed-in admin can manage other admin accounts — this is a small
// clinic staff dashboard, not a multi-tenant system with role tiers.

const ADMIN_SELECT = { id: true, email: true, name: true, createdAt: true, lastLoginAt: true };

const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().trim().min(1, 'Please enter a name'),
});

const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
});

// GET /api/admin/users
adminRouter.get('/users', requireAdmin, async (req, res) => {
  const users = await prisma.adminUser.findMany({ select: ADMIN_SELECT, orderBy: { createdAt: 'asc' } });
  res.json({ ok: true, users });
});

// POST /api/admin/users
adminRouter.post('/users', requireAdmin, async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, error: parsed.error.issues[0]?.message || 'Please check the form for errors.' });
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return res.status(422).json({ ok: false, error: 'An account with that email already exists.' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.create({
    data: { email: email.toLowerCase(), passwordHash, name },
    select: ADMIN_SELECT,
  });
  res.status(201).json({ ok: true, user });
});

// PATCH /api/admin/users/:id — update name and/or reset password
adminRouter.patch('/users/:id', requireAdmin, async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, error: parsed.error.issues[0]?.message || 'Please check the form for errors.' });
  }
  const { name, password } = parsed.data;
  const data = {
    ...(name !== undefined ? { name } : {}),
    ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
  };
  try {
    const user = await prisma.adminUser.update({ where: { id: req.params.id }, data, select: ADMIN_SELECT });
    res.json({ ok: true, user });
  } catch {
    res.status(404).json({ ok: false, error: 'Admin user not found' });
  }
});

// DELETE /api/admin/users/:id — can't delete your own account (avoids
// accidental lockout with no one left to sign in and undo it)
adminRouter.delete('/users/:id', requireAdmin, async (req, res) => {
  if (req.params.id === req.admin.sub) {
    return res.status(422).json({ ok: false, error: 'You cannot delete your own account while signed in as it.' });
  }
  try {
    await prisma.adminUser.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Admin user not found' });
  }
});
