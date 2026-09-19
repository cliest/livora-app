const BG = {
  white: 'bg-white',
  sand: 'bg-sand',
  ink: 'bg-ink text-haze-100',
};

/**
 * Full-width band + boxed inner container — the same two-layer pattern every
 * section in the original build used (outer background, inner max-width).
 */
export default function Section({
  id,
  bg = 'white',
  size = 'default', // 'default' (s8) | 'sm' (s7) | 'xs' (s6) | 'compact' (custom, for service rows)
  className = '',
  innerClassName = '',
  children,
}) {
  const padding = {
    default: 'py-s8 md:py-s7 max-[767px]:py-s6',
    sm: 'py-s7 max-[1024px]:py-s6',
    xs: 'py-s6',
    compact: 'py-16 md:py-14 max-[767px]:py-12',
  }[size];

  return (
    <section id={id} className={`${padding} ${BG[bg]} ${className}`}>
      <div className={`container ${innerClassName}`}>{children}</div>
    </section>
  );
}
