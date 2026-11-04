// Bookable appointment windows. The clinic is open 24/7, so the day is cut
// into eight 3-hour slots, each identified by its start hour (0, 3, … 21).
// One booking per slot; a slot counts as taken while a booking in it is
// PENDING or CONFIRMED (cancelling frees it again). Emergency requests never
// take a slot and are never turned away for one.
export const SLOT_LENGTH_HOURS = 3;
export const SLOT_HOURS = [0, 3, 6, 9, 12, 15, 18, 21];
export const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED'];

// Always judge "today" and "already passed" in clinic time, never the
// server's own time zone (the VPS runs on UTC).
const CLINIC_TIME_ZONE = 'Africa/Lusaka';

const pad = (n) => String(n).padStart(2, '0');

export function slotLabel(hour) {
  return `${pad(hour)}:00–${pad((hour + SLOT_LENGTH_HOURS) % 24)}:00`;
}

export function clinicNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: CLINIC_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

// A slot stays bookable until it ends, so at 14:30 the 12:00–15:00 slot can
// still be requested.
export function isPastSlot(date, hour, now = clinicNow()) {
  if (date !== now.date) return date < now.date;
  return hour + SLOT_LENGTH_HOURS <= now.hour;
}

// Key for pg_advisory_xact_lock, unique per date + slot: 2026-11-04 at 12:00
// becomes 2026110412.
export function slotLockKey(date, hour) {
  return BigInt(date.replace(/-/g, '')) * 100n + BigInt(hour);
}
