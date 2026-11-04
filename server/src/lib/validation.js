import { z } from 'zod';
import { SLOT_HOURS } from './slots.js';

// Keys the frontend sends (lowercase, hyphenated) mapped to Prisma enum values.
export const SERVICE_MAP = {
  emergency: 'EMERGENCY',
  checkup: 'CHECKUP',
  filling: 'FILLING',
  'root-canal': 'ROOT_CANAL',
  'crown-bridge': 'CROWN_BRIDGE',
  extraction: 'EXTRACTION',
  implant: 'IMPLANT',
  braces: 'BRACES',
  whitening: 'WHITENING',
  children: 'CHILDREN',
  denture: 'DENTURE',
  other: 'OTHER',
};

export const PATIENT_MAP = { new: 'NEW', returning: 'RETURNING' };

export const SUBJECT_MAP = {
  appointment: 'APPOINTMENT',
  treatment: 'TREATMENT',
  prices: 'PRICES',
  records: 'RECORDS',
  feedback: 'FEEDBACK',
  other: 'OTHER',
};

const phoneRegex = /^[+\d][\d\s()-]{8,20}$/;

// Strict YYYY-MM-DD (what <input type="date"> sends), and a real calendar
// date, so it can be compared as a string and used as a lock key.
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, 'Please choose a valid date');

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  phone: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
  patientType: z.enum(Object.keys(PATIENT_MAP)).optional().or(z.literal('')),
  service: z.enum(Object.keys(SERVICE_MAP), { errorMap: () => ({ message: 'Please choose a treatment' }) }),
  preferredDate: isoDate,
  // Not z.coerce: that turns '' and null into 0, which is a real slot.
  slotHour: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
      .number({ required_error: 'Please choose a time', invalid_type_error: 'Please choose a time' })
      .refine((h) => SLOT_HOURS.includes(h), 'Please choose a time')
  ),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consentGiven: z.coerce.boolean().refine((v) => v === true, 'Please agree so we can contact you'),
});

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().regex(phoneRegex).optional().or(z.literal('')),
  subject: z.enum(Object.keys(SUBJECT_MAP), { errorMap: () => ({ message: 'Please choose a subject' }) }),
  message: z.string().trim().min(5, 'Please write a short message').max(4000),
  consentGiven: z.coerce.boolean().refine((v) => v === true, 'Please agree so we can reply to you'),
});

export function zodIssuesToFieldErrors(error) {
  const out = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
