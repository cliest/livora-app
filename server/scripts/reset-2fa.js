// Emergency recovery for when nobody can get into the dashboard to reset a
// colleague's two-factor (e.g. the only admin lost their phone). Run on the
// VPS from server/:
//
//   node scripts/reset-2fa.js someone@livoradentalclinic.com
//
// Clears that account's authenticator and any lockout; it sets two-factor up
// again on its next sign-in.
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: node scripts/reset-2fa.js <admin email>');
  process.exit(1);
}

try {
  const user = await prisma.adminUser.update({
    where: { email },
    data: { totpSecret: null, totpEnabledAt: null, totpLastStep: null, failedLoginCount: 0, lockedUntil: null },
  });
  console.log(`Two-factor reset for ${user.email}. They will set it up again on their next sign-in.`);
} catch (err) {
  console.error(err.code === 'P2025' ? `No admin account with the email ${email}.` : err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
