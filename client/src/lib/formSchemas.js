import { z } from 'zod';

// Mirrors server/src/lib/validation.js exactly — client-side validation is a
// UX convenience only, the server re-validates everything independently.
const phoneRegex = /^[+\d][\d\s()-]{8,20}$/;

export const bookingFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  phone: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
  patientType: z.string().optional(),
  service: z.string().min(1, 'Please choose a treatment'),
  preferredDate: z.string().min(1, 'Please choose a date'),
  preferredTime: z.string().min(1),
  nhimaMember: z.string().min(1, 'Please tell us your NHIMA status'),
  message: z.string().optional(),
  consentGiven: z.boolean().refine((v) => v === true, 'Please tick this box so we can contact you'),
});

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().regex(phoneRegex).optional().or(z.literal('')),
  subject: z.string().min(1, 'Please choose a subject'),
  message: z.string().trim().min(5, 'Please write a short message'),
  consentGiven: z.boolean().refine((v) => v === true, 'Please tick this box so we can reply to you'),
});

export const SERVICE_OPTIONS = [
  ['emergency', 'Emergency / I am in pain right now'],
  ['checkup', 'Check-up & cleaning'],
  ['filling', 'Filling or tooth repair'],
  ['root-canal', 'Root canal treatment'],
  ['crown-bridge', 'Crown or bridge'],
  ['extraction', 'Extraction / wisdom tooth'],
  ['implant', 'Dental implant'],
  ['braces', 'Braces or clear aligners'],
  ['whitening', 'Teeth whitening or veneers'],
  ['children', "Children's dentistry"],
  ['denture', 'Dentures'],
  ['other', 'Something else / not sure'],
];

export const SUBJECT_OPTIONS = [
  ['appointment', 'Booking an appointment'],
  ['treatment', 'A question about treatment'],
  ['prices', 'Prices or payment'],
  ['nhima', 'NHIMA and insurance'],
  ['records', 'Records or a previous visit'],
  ['feedback', 'Feedback or a complaint'],
  ['other', 'Something else'],
];

// ---- Admin dashboard forms -------------------------------------------

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

const urlOrEmpty = z.string().trim().url('Please enter a valid URL').optional().or(z.literal(''));

export const siteSettingsSchema = z.object({
  phoneDisplay: z.string().trim().min(1, 'Please enter a phone number to display'),
  phoneDial: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email address'),
  addressLine1: z.string().trim().min(1, 'Please enter the first address line'),
  addressLine2: z.string().trim().min(1, 'Please enter the second address line'),
  facebookUrl: urlOrEmpty,
  instagramUrl: urlOrEmpty,
  tiktokUrl: urlOrEmpty,
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a name'),
  role: z.string().trim().min(1, 'Please enter a role'),
  bio: z.string().trim().min(1, 'Please enter a short bio'),
  credentials: z.string().trim().min(1, 'Please enter credentials'),
  photoUrl: z.string().trim().optional().or(z.literal('')),
  published: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1, 'Please enter the quote'),
  name: z.string().trim().min(1, 'Please enter a name'),
  role: z.string().trim().min(1, 'Please enter a role, e.g. "Emergency root canal"'),
  published: z.boolean().optional(),
});

export const PRICE_ICON_OPTIONS = [
  ['SHIELD', 'Shield (general & preventive)'],
  ['TOOTH', 'Tooth (restorative)'],
  ['SPARKLE', 'Sparkle (cosmetic)'],
  ['BRACES', 'Braces (orthodontics)'],
  ['CROWN', 'Crown (implants & dentures)'],
  ['BOLT', 'Bolt (children & emergency)'],
];

export const priceCategorySchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title'),
  icon: z.enum(['SHIELD', 'TOOTH', 'SPARKLE', 'BRACES', 'CROWN', 'BOLT']),
  note: z.string().trim().optional().or(z.literal('')),
});

export const priceItemSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a treatment name'),
  price: z.string().trim().min(1, 'Please enter a price, e.g. "from K350"'),
  isPopular: z.boolean().optional(),
  isEmergency: z.boolean().optional(),
});

export const accreditationSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title, e.g. "NHIMA Accredited Provider"'),
  badgeUrl: z.string().trim().optional().or(z.literal('')),
  published: z.boolean().optional(),
});
