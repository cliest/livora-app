export default function SearchInput({ value, onChange, placeholder = 'Search by name, phone or email…' }) {
  return (
    <div className="relative mb-s3 max-w-[360px]">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[0.9rem] text-ink px-4 py-[10px] bg-white border border-line rounded-full focus:outline-none focus:border-cyan"
      />
    </div>
  );
}
