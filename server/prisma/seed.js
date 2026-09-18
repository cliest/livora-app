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

const TEAM = [
  {
    photoUrl: '/img/team-member-1.jpg',
    name: 'Dr. Chanda Mwila',
    role: 'Principal Dentist',
    bio: 'Founded Livora after a decade in hospital dentistry. Special interest in restorative work and in treating patients who have avoided dentists for years.',
    credentials: 'BDS · MSc Restorative Dentistry · English, Bemba, Nyanja',
  },
  {
    photoUrl: '/img/team-member-2.jpg',
    name: 'Dr. Natasha Banda',
    role: 'Orthodontist',
    bio: 'Handles all braces and clear aligner cases at Livora, for teenagers and adults alike. Known for mapping out the full treatment timeline on day one.',
    credentials: 'BDS · MSc Orthodontics · English, Nyanja',
  },
  {
    photoUrl: '/img/team-member-3.jpg',
    name: 'Dr. Mulenga Phiri',
    role: 'Oral Surgeon & Implantologist',
    bio: 'Leads implant placement, wisdom tooth removal and surgical extractions. The dentist most of our complex emergency cases are handed to.',
    credentials: 'BDS · Dip. Oral Surgery · English, Bemba',
  },
  {
    photoUrl: '/img/team-member-4.jpg',
    name: 'Sister Grace Tembo',
    role: 'Dental Hygienist',
    bio: 'Runs our hygiene and gum health programme, and looks after most of our younger patients. The reason children leave here without crying.',
    credentials: 'Dip. Dental Therapy · English, Nyanja, Tonga',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I woke up at 2am with a molar that felt like it was on fire. I called expecting an answering machine and a human picked up. I was in the chair by 3:15 and home again before sunrise.',
    name: 'Mwape C.',
    role: 'Emergency root canal',
  },
  {
    quote:
      'I had avoided dentists for eleven years out of pure fear. They let me sit in the chair for ten minutes without touching anything, just talking. That mattered more than I can explain.',
    name: 'Grace N.',
    role: 'Check-up & deep clean',
  },
  {
    quote:
      'They quoted me for the crown before starting and the final bill was exactly that number. After my last experience elsewhere, being told the price up front was the whole reason I came back.',
    name: 'Joseph M.',
    role: 'Crown & filling',
  },
];

// Unified price list — merges what used to be three separate hardcoded
// lists (Pricing page, homepage "Popular treatments" teaser, Emergency
// page's price block). isPopular items show on the homepage; isEmergency
// items show on the Emergency page. The last category also picks up four
// line items (abscess drainage, emergency extraction, first-stage root
// canal, re-cementing a crown) that only used to exist on the Emergency
// page — unifying the source made the Pricing page's list more complete.
const PRICE_CATEGORIES = [
  {
    title: 'General & preventive',
    icon: 'SHIELD',
    items: [
      { name: 'Consultation & full examination', price: 'from K350', isPopular: true },
      { name: 'Digital X-ray (per image)', price: 'from K180' },
      { name: 'Scaling & polishing', price: 'from K650', isPopular: true },
      { name: 'Deep cleaning (per quadrant)', price: 'from K850' },
      { name: 'Fluoride application', price: 'from K250' },
      { name: 'Fissure sealant (per tooth)', price: 'from K300' },
    ],
  },
  {
    title: 'Restorative',
    icon: 'TOOTH',
    items: [
      { name: 'Composite filling (small)', price: 'from K750', isPopular: true },
      { name: 'Composite filling (large)', price: 'from K1,100' },
      { name: 'Root canal — front tooth', price: 'from K2,200', isPopular: true },
      { name: 'Root canal — molar', price: 'from K3,400' },
      { name: 'Porcelain crown', price: 'from K3,500', isPopular: true },
      { name: 'Bridge (per unit)', price: 'from K3,200' },
      { name: 'Simple extraction', price: 'from K500' },
      { name: 'Surgical / wisdom tooth extraction', price: 'from K1,400' },
    ],
  },
  {
    title: 'Cosmetic',
    icon: 'SPARKLE',
    items: [
      { name: 'In-clinic teeth whitening', price: 'from K2,500', isPopular: true },
      { name: 'Take-home whitening kit', price: 'from K1,600' },
      { name: 'Porcelain veneer (per tooth)', price: 'from K3,200' },
      { name: 'Composite bonding (per tooth)', price: 'from K900' },
      { name: 'Smile makeover consultation', price: 'from K500' },
    ],
  },
  {
    title: 'Orthodontics',
    icon: 'BRACES',
    note: 'Orthodontic treatment is always quoted as a complete package after assessment, and can be paid monthly across the treatment period.',
    items: [
      { name: 'Orthodontic consultation & assessment', price: 'from K600' },
      { name: 'Metal braces (full treatment)', price: 'from K18,000' },
      { name: 'Ceramic braces (full treatment)', price: 'from K24,000' },
      { name: 'Clear aligners (full treatment)', price: 'from K25,000' },
      { name: 'Retainers (per arch)', price: 'from K1,800' },
    ],
  },
  {
    title: 'Implants & dentures',
    icon: 'CROWN',
    items: [
      { name: 'Implant consultation & planning', price: 'from K700' },
      { name: 'Single implant with crown', price: 'from K14,500' },
      { name: 'Bone graft', price: 'from K4,500' },
      { name: 'Partial denture', price: 'from K3,800' },
      { name: 'Full denture (per arch)', price: 'from K6,500' },
    ],
  },
  {
    title: 'Children & emergency',
    icon: 'BOLT',
    items: [
      { name: 'Child check-up (under 12)', price: 'from K250' },
      { name: 'Child filling', price: 'from K550' },
      { name: 'Child extraction', price: 'from K400' },
      { name: 'Emergency exam (daytime)', price: 'from K400', isEmergency: true },
      { name: 'Emergency exam (after hours)', price: 'from K600', isEmergency: true },
      { name: 'Pain relief & temporary dressing', price: 'from K450', isEmergency: true },
      { name: 'Abscess drainage', price: 'from K800', isEmergency: true },
      { name: 'Emergency extraction', price: 'from K700', isEmergency: true },
      { name: 'Root canal (first stage, pain relief)', price: 'from K1,200', isEmergency: true },
      { name: 'Re-cementing a lost crown', price: 'from K500', isEmergency: true },
    ],
  },
];

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

  await prisma.siteSettings.upsert({ where: { id: 'settings' }, update: {}, create: { id: 'settings' } });
  console.log('Site settings ready.');

  // Content tables only seed once (skipped if already populated), so
  // re-running this script never clobbers edits made from the dashboard.
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: TEAM.map((t, i) => ({ ...t, sortOrder: i })),
    });
    console.log(`Seeded ${TEAM.length} team members.`);
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: TESTIMONIALS.map((t, i) => ({ ...t, sortOrder: i })),
    });
    console.log(`Seeded ${TESTIMONIALS.length} testimonials.`);
  }

  if ((await prisma.priceCategory.count()) === 0) {
    for (const [catIndex, cat] of PRICE_CATEGORIES.entries()) {
      await prisma.priceCategory.create({
        data: {
          title: cat.title,
          icon: cat.icon,
          note: cat.note,
          sortOrder: catIndex,
          items: {
            create: cat.items.map((item, i) => ({ ...item, sortOrder: i })),
          },
        },
      });
    }
    const itemCount = PRICE_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
    console.log(`Seeded ${PRICE_CATEGORIES.length} price categories (${itemCount} items).`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
