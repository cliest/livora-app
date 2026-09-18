import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-.env';
const COOKIE_NAME = 'livora_admin';

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, SECRET, { expiresIn: '12h' });
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

/** Express middleware — protects admin-only routes (dashboard API). */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ ok: false, error: 'Not signed in' });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Session expired, please sign in again' });
  }
}

export { COOKIE_NAME };
