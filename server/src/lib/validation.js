import { z } from 'zod';

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

export const TIME_MAP = {
  morning: 'MORNING',
  afternoon: 'AFTERNOON',
  evening: 'EVENING',
  night: 'OVERNIGHT',
};

export const NHIMA_MAP = { yes: 'YES', no: 'NO', unsure: 'UNSURE' };
export const PATIENT_MAP = { new: 'NEW', returning: 'RETURNING' };

export const SUBJECT_MAP = {
  appointment: 'APPOINTMENT',
  treatment: 'TREATMENT',
  prices: 'PRICES',
  nhima: 'NHIMA',
  records: 'RECORDS',
  feedback: 'FEEDBACK',
  other: 'OTHER',
};

const phoneRegex = /^[+\d][\d\s()-]{8,20}$/;

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  phone: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
  patientType: z.enum(Object.keys(PATIENT_MAP)).optional().or(z.literal('')),
  service: z.enum(Object.keys(SERVICE_MAP), { errorMap: () => ({ message: 'Please choose a treatment' }) }),
  preferredDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Please choose a valid date'),
  preferredTime: z.enum(Object.keys(TIME_MAP)).default('morning'),
  nhimaMember: z.enum(Object.keys(NHIMA_MAP), { errorMap: () => ({ message: 'Please tell us your NHIMA status' }) }),
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
