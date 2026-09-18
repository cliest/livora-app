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
