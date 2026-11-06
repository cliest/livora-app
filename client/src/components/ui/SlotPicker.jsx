import { Skeleton } from './Skeleton.jsx';

const STATUS_TEXT = { available: 'Available', taken: 'Booked', past: 'Passed' };

// Radio group of the day's 3-hour slots, greyed out when already booked or
// passed. `slots` comes from GET /api/bookings/availability. Emergency
// requests (`allowTaken`) may pick a booked slot, because the clinic sees
// emergencies whatever else is booked.
export default function SlotPicker({ name, register, error, date, slots, loading, allowTaken }) {
  const isSelectable = (slot) => slot.status === 'available' || (allowTaken && slot.status === 'taken');
  const noneLeft = slots && !slots.some(isSelectable);

  return (
    <fieldset className="col-span-2 max-[640px]:col-span-1 min-w-0">
      <legend className="block text-[0.85rem] font-bold text-ink mb-[7px]">
        Preferred time <span className="text-coral-600">*</span>
      </legend>

      {!date && <p className="text-[0.9rem] text-muted">Choose a date first to see which times are still free.</p>}

      {date && loading && (
        <div role="status" aria-busy="true" className="grid grid-cols-3 max-[640px]:grid-cols-2 gap-[10px]">
          <span className="sr-only">Checking which times are free…</span>
          {Array.from({ length: 9 }, (_, i) => (
            <Skeleton key={i} className="h-[62px]" />
          ))}
        </div>
      )}

      {date && slots && (
        <div className="grid grid-cols-3 max-[640px]:grid-cols-2 gap-[10px]">
          {slots.map((slot) => {
            const disabled = !isSelectable(slot);
            return (
              <label key={slot.hour} className={`relative ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input type="radio" value={String(slot.hour)} disabled={disabled} className="peer sr-only" {...register(name)} />
                <span
                  className={`block px-3 py-[10px] text-center border-[1.5px] transition-all peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cyan ${
                    disabled
                      ? 'bg-sand border-transparent text-muted opacity-60'
                      : 'bg-sand border-transparent text-ink hover:border-cyan peer-checked:bg-cyan peer-checked:text-white peer-checked:border-cyan'
                  }`}
                >
                  <span className={`block text-[0.92rem] font-semibold ${disabled ? 'line-through' : ''}`}>{slot.label}</span>
                  <span className="block text-[0.75rem] font-medium opacity-80">{STATUS_TEXT[slot.status]}</span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {date && noneLeft && (
        <p className="text-[0.88rem] font-semibold text-ink mt-[10px]">
          Every time on this day is booked. Please choose another date, or call us.
        </p>
      )}
      {error && <p className="text-[0.82rem] font-semibold text-coral-600 mt-[6px]">{error.message}</p>}
      {date && slots && (
        <p className="text-[0.8rem] text-muted mt-[10px]">
          {allowTaken
            ? 'Emergencies can choose any time, even one already booked. Outside 08:00–17:00, or if you are in pain now, call us and come straight in.'
            : 'Appointments are booked from 08:00 to 17:00, Zambian time. Each slot is a one-hour window; we will call to confirm your exact time. Outside those hours, call us for emergencies.'}
        </p>
      )}
    </fieldset>
  );
}
