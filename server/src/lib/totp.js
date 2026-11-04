import crypto from 'node:crypto';

// Time-based one-time passwords (RFC 6238) — the 6-digit codes shown by
// Google Authenticator, Microsoft Authenticator, Authy, etc. Implemented on
// node:crypto directly: it's ~40 lines, and doing it here gives us the
// matched time step, which is what stops a code being replayed.

const STEP_SECONDS = 30;
const DIGITS = 6;
const ISSUER = 'Livora Dental Clinic';
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  let bits = 0;
  let value = 0;
  const out = [];
  for (const char of str.replace(/=+$/, '').toUpperCase()) {
    const idx = BASE32.indexOf(char);
    if (idx === -1) throw new Error('Invalid base32 secret');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateSecret() {
  return base32Encode(crypto.randomBytes(20)); // 160 bits, as RFC 4226 recommends
}

export function hotp(secret, counter, digits = DIGITS) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;
  return String(code).padStart(digits, '0');
}

export const currentStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS);

/**
 * Returns the time step the code matched, or null. Accepts one step either
 * side of now for phone clock drift, and never a step at or before
 * `lastUsedStep`, so a code that has already signed someone in can't be
 * reused by anyone who saw it.
 */
export function verifyTotp(secret, code, lastUsedStep = null, now = Date.now()) {
  if (!/^\d{6}$/.test(code)) return null;
  const step = currentStep(now);
  for (const candidate of [step - 1, step, step + 1]) {
    if (lastUsedStep != null && candidate <= lastUsedStep) continue;
    const expected = hotp(secret, candidate);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(code))) return candidate;
  }
  return null;
}

export function otpauthUri(secret, accountName) {
  const label = encodeURIComponent(`${ISSUER}:${accountName}`);
  const issuer = encodeURIComponent(ISSUER);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=${DIGITS}&period=${STEP_SECONDS}`;
}

// --- Encryption at rest ----------------------------------------------------
// Secrets are stored AES-256-GCM encrypted, so a leaked database dump alone
// doesn't hand over everyone's second factor. The key comes from
// TOTP_ENCRYPTION_KEY, falling back to JWT_SECRET. Changing whichever is in
// use makes existing 2FA setups unreadable: every admin then has to be reset
// (scripts/reset-2fa.js) and set up again.
const KEY = crypto
  .createHash('sha256')
  .update(`livora-totp:${process.env.TOTP_ENCRYPTION_KEY || process.env.JWT_SECRET || 'dev-only-secret-change-in-.env'}`)
  .digest();

export function encryptSecret(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv, cipher.getAuthTag(), data].map((p) => (typeof p === 'string' ? p : p.toString('base64'))).join(':');
}

export function decryptSecret(stored) {
  const [version, iv, tag, data] = stored.split(':');
  if (version !== 'v1') throw new Error('Unknown secret format');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
}
