// Mirrors server/src/lib/slots.js: one-hour slots from 08:00 to 17:00, each
// identified by its start hour. Availability itself always comes from the
// server; this is only for labelling a slot the user already picked.
const SLOT_LENGTH_HOURS = 1;
const pad = (n) => String(n).padStart(2, '0');

export function slotLabel(hour) {
  const h = Number(hour);
  return `${pad(h)}:00–${pad((h + SLOT_LENGTH_HOURS) % 24)}:00`;
}
