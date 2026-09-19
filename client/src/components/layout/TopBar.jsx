import { useSiteSettings } from '../../hooks/useSiteSettings.js';

export default function TopBar() {
  const settings = useSiteSettings();

  return (
    <div className="hidden lg:block bg-ink text-[13px] py-[10px]">
      <div className="container flex items-center justify-between gap-s3 flex-wrap">
        <div className="flex items-center gap-s3 flex-wrap">
          <span className="inline-flex items-center gap-[7px] text-haze-500">
            <span className="pulse-dot" />
            Open 24 hours &mdash; every day
          </span>
          <span className="hidden md:inline-flex items-center gap-[7px] text-haze-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-cyan" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {settings.addressLine2}
          </span>
        </div>
        <div className="flex items-center gap-s3 flex-wrap">
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-[7px] text-white font-semibold hover:text-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-cyan" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
            {settings.email}
          </a>
          <a href={settings.telHref} className="inline-flex items-center gap-[7px] text-white font-semibold hover:text-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-cyan" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
            </svg>
            {settings.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
