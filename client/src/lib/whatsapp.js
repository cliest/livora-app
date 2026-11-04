import { SERVICE_OPTIONS } from './formSchemas.js';
import { slotLabel } from './slots.js';

// Builds the pre-filled message for a booking's "message the clinic on
// WhatsApp too" flow, shared between the Book form (best-effort auto-open)
// and the Thank You page (guaranteed one-tap fallback button).
export function buildBookingWhatsAppMessage(data) {
  const serviceLabel = SERVICE_OPTIONS.find(([value]) => value === data.service)?.[1] || data.service;
  const timeLabel = slotLabel(data.slotHour);

  const lines = [
    'Hi Livora Dental Clinic, I just requested an appointment on your website.',
    '',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Treatment: ${serviceLabel}`,
    `Preferred date: ${data.preferredDate}`,
    `Preferred time: ${timeLabel}`,
  ];

  if (data.message?.trim()) lines.push(`Notes: ${data.message.trim()}`);
  lines.push('', 'Please confirm my appointment. Thank you!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(waHref, message) {
  return message ? `${waHref}?text=${encodeURIComponent(message)}` : waHref;
}
