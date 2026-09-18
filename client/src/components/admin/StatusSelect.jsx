const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="text-[0.82rem] font-semibold border border-line rounded-lg px-2 py-1 bg-white disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
