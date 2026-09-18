import { Link } from 'react-router-dom';
import PhoneIcon from './PhoneIcon.jsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';

const TREATMENTS = [
  { label: 'Check-ups & Cleaning', to: '/services#general' },
  { label: 'Fillings & Root Canals', to: '/services#restorative' },
  { label: 'Crowns & Bridges', to: '/services#restorative' },
  { label: 'Dental Implants', to: '/services#implants' },
  { label: 'Braces & Aligners', to: '/services#orthodontics' },
  { label: 'Whitening & Veneers', to: '/services#cosmetic' },
  { label: "Children's Dentistry", to: '/services#children' },
];

const CLINIC_LINKS = [
  { label: 'About Livora', to: '/about' },
  { label: 'Our Team', to: '/about#team' },
  { label: 'Technology', to: '/about#technology' },
  { label: 'Prices & NHIMA', to: '/pricing' },
  { label: '24/7 Emergency', to: '/emergency' },
  { label: 'Book Appointment', to: '/book' },
  { label: 'Contact Us', to: '/contact' },
];

// Social links come from admin-managed site settings. Where a URL hasn't
// been set, the icon stays inert (no href) rather than a dead "#" link.
const SOCIAL_ICONS = {
  whatsapp: 'M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-3.2-1.5 11.6 11.6 0 0 1-3.4-4.2c-.3-.6-.6-1.4-.6-2.1 0-.8.4-1.4.7-1.7.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4 0 .5l-.4.5c-.1.2-.3.3-.1.6a8.7 8.7 0 0 0 3.8 3.3c.3.1.5.1.6-.1l.8-1c.2-.2.4-.1.6 0l2 .9c.2.1.4.2.4.3.1.2.1.6-.1 1.2Z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  instagram: null,
  tiktok: 'M16.5 2h-3v13.2a2.8 2.8 0 1 1-2.3-2.8V9.3a6 6 0 1 0 5.3 6V8.6a7 7 0 0 0 4 1.3V6.6a4 4 0 0 1-4-4Z',
};

export default function Footer() {
  const settings = useSiteSettings();
  const socials = [
    { label: 'WhatsApp', href: settings.waHref, icon: SOCIAL_ICONS.whatsapp },
    { label: 'Facebook', href: settings.facebookUrl, icon: SOCIAL_ICONS.facebook },
    { label: 'Instagram', href: settings.instagramUrl, icon: SOCIAL_ICONS.instagram },
    { label: 'TikTok', href: settings.tiktokUrl, icon: SOCIAL_ICONS.tiktok },
  ];

  return (
    <footer className="bg-ink text-[#9FBFC9] pt-s7 pb-s4">
      <div className="container">
        <div className="flex flex-wrap gap-s4">
          {/* Brand — 34% */}
          <div className="w-full lg:basis-[34%] lg:flex-1">
            <img
              src="/logo/livora-logo-stacked.svg"
              alt="Livora Dental Clinic"
              width={130}
              height={124}
              className="h-11 w-auto mb-s3"
            />
            <p className="text-[15px] leading-[1.7]">
              Professional dental care in Lusaka, Zambia, open every hour of every day. General, cosmetic,
              orthodontic and emergency dentistry under one roof.
            </p>
            <div className="flex gap-[10px] mt-s3">
              {socials.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Livora on ${s.label}`}
                    className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-white/[.08] text-white hover:bg-cyan hover:-translate-y-[3px] transition-all"
                  >
                    {s.icon && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                        <path d={s.icon} />
                      </svg>
                    )}
                  </a>
                ) : (
                  <span
                    key={s.label}
                    title={`${s.label} — link coming soon`}
                    className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-white/[.08] text-white opacity-45"
                  />
                )
              )}
            </div>
          </div>

          {/* Treatments — 20% */}
          <div className="w-1/2 sm:w-auto lg:basis-[20%] lg:flex-1">
            <h4 className="text-[13px] font-bold uppercase tracking-[1.8px] text-white mb-s3">Treatments</h4>
            <ul className="space-y-[11px]">
              {TREATMENTS.map((t) => (
                <li key={t.label}>
                  <Link to={t.to} className="text-[15px] text-[#9FBFC9] hover:text-cyan">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic — 20% */}
          <div className="w-1/2 sm:w-auto lg:basis-[20%] lg:flex-1">
            <h4 className="text-[13px] font-bold uppercase tracking-[1.8px] text-white mb-s3">Clinic</h4>
            <ul className="space-y-[11px]">
              {CLINIC_LINKS.map((t) => (
                <li key={t.label}>
                  <Link to={t.to} className="text-[15px] text-[#9FBFC9] hover:text-cyan">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch — 26% */}
          <div className="w-full lg:basis-[26%] lg:flex-1">
            <h4 className="text-[13px] font-bold uppercase tracking-[1.8px] text-white mb-s3">Get in touch</h4>
            <div className="flex gap-3 mb-[15px]">
              <PhoneIcon className="w-[17px] h-[17px] text-cyan mt-1 flex-none" />
              <a href={settings.telHref} className="text-[15px] text-[#9FBFC9] hover:text-cyan">
                {settings.phoneDisplay}
              </a>
            </div>
            <div className="flex gap-3 mb-[15px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-cyan mt-1 flex-none" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <a href={`mailto:${settings.email}`} className="text-[15px] text-[#9FBFC9] hover:text-cyan">
                {settings.email}
              </a>
            </div>
            <div className="flex gap-3 mb-[15px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-cyan mt-1 flex-none" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[15px]">
                {settings.addressLine1}
                <br />
                {settings.addressLine2}
              </span>
            </div>
            <div className="flex gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-cyan mt-1 flex-none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-[15px]">
                <strong className="text-white">Open 24 hours</strong>
                <br />
                Monday to Sunday, all year
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-s2 mt-s6 pt-s3 border-t border-white/10 text-[0.86rem]">
          <p>&copy; {new Date().getFullYear()} Livora Dental Clinic. All rights reserved.</p>
          <nav className="flex flex-wrap gap-s3" aria-label="Footer navigation">
            <Link to="/services" className="text-[#9FBFC9] hover:text-cyan">Services</Link>
            <Link to="/pricing" className="text-[#9FBFC9] hover:text-cyan">Pricing</Link>
            <Link to="/emergency" className="text-[#9FBFC9] hover:text-cyan">Emergency</Link>
            <Link to="/contact" className="text-[#9FBFC9] hover:text-cyan">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
