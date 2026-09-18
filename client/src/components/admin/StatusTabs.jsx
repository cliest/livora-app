const TABS = [
  ['', 'All'],
  ['PENDING', 'Pending'],
  ['CONFIRMED', 'Confirmed'],
  ['COMPLETED', 'Completed'],
  ['CANCELLED', 'Cancelled'],
];

export default function StatusTabs({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 mb-s3">
      {TABS.map(([status, label]) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`px-3 py-[7px] rounded-full text-[0.84rem] font-semibold ${
            value === status ? 'bg-cyan text-white' : 'bg-white border border-line text-ink hover:border-cyan'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
