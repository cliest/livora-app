export default function PriceBlock({ icon: Icon, title, rows, note }) {
  return (
    <div className="bg-white border border-line rounded-[18px] p-s4 h-full">
      <h3 className="flex items-center gap-3 mb-s3">
        <Icon className="w-[22px] h-[22px] text-cyan flex-none" />
        {title}
      </h3>
      {rows.map(([name, price]) => (
        <div key={name} className="flex items-baseline gap-3 py-[13px] border-b border-dashed border-line last:border-0">
          <span className="text-[0.97rem] font-semibold text-ink" dangerouslySetInnerHTML={{ __html: name }} />
          <span className="flex-1 border-b border-dotted border-[#C9D8DD] -translate-y-1" />
          <span className="text-[0.97rem] font-extrabold text-cyan-700 whitespace-nowrap flex-none">{price}</span>
        </div>
      ))}
      {note && <p className="text-[0.85rem] text-muted mt-s3">{note}</p>}
    </div>
  );
}
