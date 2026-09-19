const VARIANTS = {
  default: 'bg-sand-deep text-cyan-700',
  cyan: 'bg-cyan text-white',
  coral: 'bg-coral/[.16] text-coral-600',
  'solid-coral': 'bg-coral text-white',
  dark: 'bg-white/10 text-cyan',
};

export default function IconBox({ icon, title, children, variant = 'default', dark = false }) {
  return (
    <div className={dark ? 'flex flex-col' : ''}>
      <span className={`inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl mb-s3 flex-none ${VARIANTS[variant]}`}>
        <span className="w-[27px] h-[27px] [&>svg]:w-full [&>svg]:h-full">{icon}</span>
      </span>
      {title && <h3 className={`mb-[10px] ${dark ? 'text-white' : ''}`}>{title}</h3>}
      {children && <p className={`text-[0.96rem] ${dark ? 'text-haze-600' : 'text-muted'}`}>{children}</p>}
    </div>
  );
}
