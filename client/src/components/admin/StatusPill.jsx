const STYLES = {
  PENDING: 'bg-coral/[.16] text-coral-600',
  CONFIRMED: 'bg-cyan/[.16] text-cyan-700',
  COMPLETED: 'bg-success-bg text-success',
  CANCELLED: 'bg-sand-deep text-muted',
};

export default function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] rounded-none text-[0.76rem] font-bold uppercase tracking-[0.04em] ${STYLES[status] || STYLES.PENDING}`}>
      {status.toLowerCase()}
    </span>
  );
}
