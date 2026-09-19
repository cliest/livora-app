import { SERVICE_OPTIONS } from './formSchemas.js';

const TIME_LABELS = {
  morning: 'Morning (07:00–12:00)',
  afternoon: 'Afternoon (12:00–17:00)',
  evening: 'Evening (17:00–22:00)',
  night: 'Overnight (22:00–07:00)',
};

const NHIMA_LABELS = {
  yes: 'Yes — I will bring my card',
  no: 'No — I will pay directly',
  unsure: 'I am not sure',
};

// Builds the pre-filled message for a booking's "message the clinic on
// WhatsApp too" flow, shared between the Book form (best-effort auto-open)
// and the Thank You page (guaranteed one-tap fallback button).
export function buildBookingWhatsAppMessage(data) {
  const serviceLabel = SERVICE_OPTIONS.find(([value]) => value === data.service)?.[1] || data.service;
  const timeLabel = TIME_LABELS[data.preferredTime] || data.preferredTime;
  const nhimaLabel = NHIMA_LABELS[data.nhimaMember] || data.nhimaMember;

  const lines = [
    'Hi Livora Dental Clinic, I just requested an appointment on your website.',
    '',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Treatment: ${serviceLabel}`,
    `Preferred date: ${data.preferredDate}`,
    `Preferred time: ${timeLabel}`,
    `NHIMA member: ${nhimaLabel}`,
  ];

  if (data.message?.trim()) lines.push(`Notes: ${data.message.trim()}`);
  lines.push('', 'Please confirm my appointment. Thank you!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(waHref, message) {
  return message ? `${waHref}?text=${encodeURIComponent(message)}` : waHref;
}
