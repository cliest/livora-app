import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route change, but respects an in-page #anchor (e.g. the
// footer's "/services#general" links) by letting the browser handle those.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
