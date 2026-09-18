// Creates (or updates) the clinic's first admin dashboard login.
// Run with: node prisma/seed.js
//
// Change ADMIN_EMAIL / ADMIN_PASSWORD below before running in production,
// or better, set them via environment variables so the password never sits
// in a committed file.
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/client/index.js';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@livoradentalclinic.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL.toLowerCase() },
    update: { passwordHash },
    create: { email: ADMIN_EMAIL.toLowerCase(), passwordHash, name: 'Clinic Admin' },
  });

  console.log(`Admin ready: ${admin.email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`⚠️  Using the default password. Set SEED_ADMIN_PASSWORD before re-seeding in production.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
