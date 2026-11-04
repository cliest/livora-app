import { createRouter } from '../lib/router.js';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { z } from 'zod';
import { prisma, isNotFoundError } from '../lib/prisma.js';
import { notifyClinic } from '../lib/mailer.js';
import {
  signAdminToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
  setChallengeCookie,
  readChallenge,
  clearChallengeCookie,
} from '../lib/auth.js';
import { generateSecret, verifyTotp, otpauthUri, encryptSecret, decryptSecret } from '../lib/totp.js';

export const adminRouter = createRouter();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// --- Sign-in: password, then a 6-digit authenticator code ----------------
//
// 1. POST /login         email + password. On success no session yet: a
//                        short-lived challenge cookie, and either
//                        { next: 'totp' } or, for an account without 2FA,
//                        { next: 'setup', setup: { qr, secret } }.
// 2. POST /login/verify  the code. Completes setup if that's the step, then
//                        issues the real session cookie.
//
// Wrong passwords and wrong codes both count towards the per-account lockout.

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

// Compared against when the email doesn't exist, so a login for an unknown
// account takes as long as one for a real account with a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const isLocked = (admin) => admin.lockedUntil && admin.lockedUntil > new Date();

function lockedResponse(res, admin) {
  const minutes = Math.max(1, Math.ceil((admin.lockedUntil - Date.now()) / 60000));
  return res.status(423).json({
    ok: false,
    error: `Too many failed attempts. This account is locked for ${minutes} more minute${minutes === 1 ? '' : 's'}.`,
  });
}

async function recordFailedAttempt(admin, req, what) {
  const { failedLoginCount } = await prisma.adminUser.update({
    where: { id: admin.id },
    data: { failedLoginCount: { increment: 1 } },
    select: { failedLoginCount: true },
  });
  if (failedLoginCount < MAX_FAILED_ATTEMPTS) return;

  const lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
  await prisma.adminUser.update({ where: { id: admin.id }, data: { failedLoginCount: 0, lockedUntil } });
  console.warn(`[admin] ${admin.email} locked after ${MAX_FAILED_ATTEMPTS} failed sign-ins from ${req.ip}`);
  notifyClinic({
    subject: `Livora admin: ${admin.email} locked after failed sign-ins`,
    text: [
      `The admin account ${admin.email} was locked for ${LOCK_MINUTES} minutes after ${MAX_FAILED_ATTEMPTS} failed sign-in attempts in a row.`,
      ``,
      `Last failure: wrong ${what}`,
      `Time: ${new Date().toISOString()}`,
      `IP address: ${req.ip}`,
      `Browser: ${req.get('user-agent') || '(unknown)'}`,
      ``,
      `If this was a member of staff mistyping, no action is needed — the account unlocks itself.`,
      what === 'code'
        ? `The password was entered correctly before the codes failed. If this wasn't staff, change this account's password now.`
        : `If this wasn't staff, someone may be trying to guess this account's password. Make sure it's a strong one.`,
    ].join('\n'),
  }).catch(() => {});
}

const restartResponse = (res) =>
  res.status(401).json({ ok: false, restart: true, error: 'Your sign-in timed out. Please enter your email and password again.' });

// POST /api/admin/login — step 1
adminRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, error: 'Enter an email and password' });

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

  if (admin && isLocked(admin)) return lockedResponse(res, admin);

  // Same response whether or not the account exists, so this can't be used
  // to discover which emails have admin access.
  const valid = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !valid) {
    if (admin) await recordFailedAttempt(admin, req, 'password');
    return res.status(401).json({ ok: false, error: 'Incorrect email or password' });
  }

  if (admin.totpEnabledAt) {
    setChallengeCookie(res, { sub: admin.id });
    return res.json({ ok: true, next: 'totp' });
  }

  // First sign-in since 2FA was required (or after a reset): set it up now.
  const secret = generateSecret();
  setChallengeCookie(res, { sub: admin.id, setupSecret: encryptSecret(secret) });
  res.json({
    ok: true,
    next: 'setup',
    setup: { secret, qr: await QRCode.toDataURL(otpauthUri(secret, admin.email), { margin: 1, width: 220 }) },
  });
});

// POST /api/admin/login/verify — step 2
adminRouter.post('/login/verify', async (req, res) => {
  const challenge = readChallenge(req);
  if (!challenge) return restartResponse(res);

  const admin = await prisma.adminUser.findUnique({ where: { id: challenge.sub } });
  if (!admin) return restartResponse(res);
  if (isLocked(admin)) return lockedResponse(res, admin);

  const isSetup = Boolean(challenge.setupSecret);
  // Someone finished setting up this account in another tab meanwhile.
  if (isSetup && admin.totpEnabledAt) return restartResponse(res);
  if (!isSetup && !admin.totpSecret) return restartResponse(res);

  const code = String(req.body?.code ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) {
    return res.status(422).json({ ok: false, error: 'Enter the 6-digit code from your authenticator app.' });
  }

  const secret = decryptSecret(isSetup ? challenge.setupSecret : admin.totpSecret);
  const step = verifyTotp(secret, code, admin.totpLastStep);
  if (step === null) {
    await recordFailedAttempt(admin, req, 'code');
    return res.status(401).json({ ok: false, error: 'That code isn’t right. Use the newest code in your authenticator app.' });
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      lastLoginAt: new Date(),
      failedLoginCount: 0,
      lockedUntil: null,
      totpLastStep: step,
      ...(isSetup ? { totpSecret: encryptSecret(secret), totpEnabledAt: new Date() } : {}),
    },
  });

  clearChallengeCookie(res);
  setAuthCookie(res, signAdminToken(admin));
  res.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
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

const ADMIN_SELECT = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  lastLoginAt: true,
  totpEnabledAt: true,
  lockedUntil: true,
};

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
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
    res.status(404).json({ ok: false, error: 'Admin user not found' });
  }
});

// POST /api/admin/users/:id/reset-2fa — for a lost or replaced phone. The
// account sets two-factor up again on its next sign-in. Also lifts a lockout.
adminRouter.post('/users/:id/reset-2fa', requireAdmin, async (req, res) => {
  try {
    const user = await prisma.adminUser.update({
      where: { id: req.params.id },
      data: { totpSecret: null, totpEnabledAt: null, totpLastStep: null, failedLoginCount: 0, lockedUntil: null },
      select: ADMIN_SELECT,
    });
    notifyClinic({
      subject: `Livora admin: two-factor reset for ${user.email}`,
      text: `${req.admin.email} reset two-factor sign-in for ${user.email} at ${new Date().toISOString()}. That account will set up a new authenticator on its next sign-in.`,
    }).catch(() => {});
    res.json({ ok: true, user });
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
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
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
    res.status(404).json({ ok: false, error: 'Admin user not found' });
  }
});
