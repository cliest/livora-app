import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-.env';
const COOKIE_NAME = 'livora_admin';

// Short-lived cookie that carries a sign-in between the password step and
// the two-factor step. Scoped to the login endpoints and useless on its own:
// requireAdmin only accepts full session tokens (mfa: true).
const CHALLENGE_COOKIE = 'livora_admin_2fa';
const CHALLENGE_PATH = '/api/admin/login';
const CHALLENGE_MINUTES = 10;

const cookieBase = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email, mfa: true }, SECRET, { expiresIn: '12h' });
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, { ...cookieBase(), maxAge: 12 * 60 * 60 * 1000 });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

export function setChallengeCookie(res, payload) {
  const token = jwt.sign({ ...payload, purpose: 'login-2fa' }, SECRET, { expiresIn: `${CHALLENGE_MINUTES}m` });
  res.cookie(CHALLENGE_COOKIE, token, { ...cookieBase(), sameSite: 'strict', path: CHALLENGE_PATH, maxAge: CHALLENGE_MINUTES * 60 * 1000 });
}

export function readChallenge(req) {
  const token = req.cookies?.[CHALLENGE_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.purpose === 'login-2fa' ? payload : null;
  } catch {
    return null;
  }
}

export function clearChallengeCookie(res) {
  res.clearCookie(CHALLENGE_COOKIE, { path: CHALLENGE_PATH });
}

/** Express middleware — protects admin-only routes (dashboard API). */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ ok: false, error: 'Not signed in' });
  try {
    const payload = jwt.verify(token, SECRET);
    // Sessions from before two-factor existed (no mfa claim) are refused, so
    // everyone has to sign in again — and set up 2FA — after this deploys.
    if (payload.mfa !== true) throw new Error('Session predates two-factor sign-in');
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Session expired, please sign in again' });
  }
}

export { COOKIE_NAME };
