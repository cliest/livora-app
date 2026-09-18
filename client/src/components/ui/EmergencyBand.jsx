import { Link } from 'react-router-dom';
import PhoneIcon from '../layout/PhoneIcon.jsx';

// Internal paths ("/emergency") route client-side; tel:/mailto:/external
// links stay as plain anchors.
function CtaLink({ href, className, children }) {
  return href.startsWith('/') ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export default function EmergencyBand({ eyebrow, title, body, primaryLabel = 'Call +260 76 073 7805', primaryHref = 'tel:+260760737805', secondaryLabel, secondaryHref, wrap = true }) {
  const inner = (
    <div
      className="rounded-[28px] p-s6 max-[767px]:p-s4"
      style={{ background: 'linear-gradient(115deg, #E9897E 0%, #D96A5D 100%)' }}
    >
      <div className="flex flex-wrap items-center gap-s4">
        <div className="flex-1 min-w-[280px]">
          <span className="eyebrow" style={{ color: '#fff' }}>
            {eyebrow}
          </span>
          <h2 className="text-white mb-s3" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="text-white/[.93] text-[1.16rem] leading-[1.75]">{body}</p>
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex flex-wrap gap-s2">
            <CtaLink href={primaryHref} className="btn btn--white btn--lg">
              <PhoneIcon />
              {primaryLabel}
            </CtaLink>
            {secondaryLabel && (
              <CtaLink href={secondaryHref} className="btn btn--ghost-light btn--lg">
                {secondaryLabel}
              </CtaLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return wrap ? (
    <section className="py-s6">
      <div className="container">{inner}</div>
    </section>
  ) : (
    inner
  );
}
