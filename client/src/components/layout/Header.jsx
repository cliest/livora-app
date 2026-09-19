import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import { useSiteSettings } from "../../hooks/useSiteSettings.js";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/emergency", label: "24/7 Emergency" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const navLinkClass = ({ isActive }) =>
  `block px-[15px] py-[10px] rounded-none text-[14.88px] font-semibold transition-colors duration-200 ${
    isActive
      ? "text-cyan-700 bg-sand-deep"
      : "text-ink hover:bg-sand hover:text-cyan-700"
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();

  // Close the mobile panel whenever the viewport grows past the breakpoint
  // where the desktop nav takes over, same as the original main.js behaviour.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-white/[.94] backdrop-blur-[12px] backdrop-saturate-[180%] border-b border-line">
      <TopBar />

      <div className="container flex items-center justify-between gap-s3 min-h-[84px]">
        <Link
          to="/"
          className="flex-none"
          aria-label="Livora Dental Clinic home"
        >
          <img
            src="/logo/livora-logo.svg"
            alt="Livora Dental Clinic logo"
            className="h-[46px] w-auto"
            width={128}
            height={46}
          />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-s2 flex-none">
          <a
            href={settings.telHref}
            className="hidden lg:flex flex-col items-end text-right w-[150px]"
          >
            <span className="text-[11.2px] font-semibold uppercase tracking-[1.12px] text-muted leading-[14px]">
              Call us anytime
            </span>
            <strong className="text-base font-extrabold text-ink leading-5">
              {settings.phoneDisplay}
            </strong>
          </a>

          <Link to="/book" className="hidden lg:inline-flex btn btn--primary btn--sm">
            Book Appointment
          </Link>

          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-sand border border-line hover:bg-sand-deep hover:border-cyan transition-colors"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block w-5 h-0.5 bg-ink rounded">
              <span
                className={`absolute left-0 w-5 h-0.5 bg-ink rounded transition-all duration-200 ${
                  open ? "top-0 rotate-45" : "-top-[6px]"
                }`}
              />
              <span
                className={`absolute left-0 w-5 h-0.5 bg-ink rounded transition-all duration-200 ${
                  open ? "top-0 -rotate-45" : "top-[6px]"
                }`}
              />
              {open && <span className="opacity-0" />}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="lg:hidden absolute left-0 right-0 top-full max-h-[calc(100vh-84px)] overflow-y-auto border-t border-line bg-white pt-s3 pb-s4 shadow-lg"
        >
          <div className="container">
            <nav
              className="flex flex-col gap-0.5"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-[14px] rounded-xl text-[1.02rem] font-semibold ${
                      isActive
                        ? "bg-sand text-cyan-700"
                        : "text-ink hover:bg-sand hover:text-cyan-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
