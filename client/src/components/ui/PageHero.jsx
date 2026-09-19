import { Link } from 'react-router-dom';

// Compact interior-page hero — matches .page-hero in the source CSS exactly:
// dark background image, two-stop gradient overlay, breadcrumb, h1, lead.
export default function PageHero({ image, crumb, title, lead, children }) {
  return (
    <section className="relative bg-ink text-white overflow-hidden isolate">
      <div className="absolute inset-0 bg-cover bg-center opacity-[.38]" style={{ backgroundImage: `url('${image}')` }} />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(90deg, rgba(10,42,51,.92) 12%, rgba(10,42,51,.62) 100%)' }}
      />
      <div className="container relative z-[2]">
        <div className="max-w-[760px] pt-[92px] pb-[96px] max-[1024px]:pt-[68px] max-[1024px]:pb-[72px] max-[767px]:pt-[52px] max-[767px]:pb-[56px]">
          <ul className="flex flex-wrap items-center gap-2 text-[0.82rem] text-haze-700 mb-s2 list-none p-0">
            <li>
              <Link to="/" className="text-haze-400 hover:text-cyan">
                Home
              </Link>
            </li>
            <li className="before:content-['/'] before:mr-2 before:text-muted">{crumb}</li>
          </ul>
          <h1 className="text-white mb-s3" dangerouslySetInnerHTML={{ __html: title }} />
          {lead && <p className="text-haze-400 text-[1.2rem]" dangerouslySetInnerHTML={{ __html: lead }} />}
          {children}
        </div>
      </div>
    </section>
  );
}
