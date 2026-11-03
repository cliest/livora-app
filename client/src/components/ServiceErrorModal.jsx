import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PhoneIcon from './layout/PhoneIcon.jsx';
import { onServiceError } from '../lib/serviceErrors.js';
import { useSiteSettings } from '../hooks/useSiteSettings.js';

const COPY = {
  network: {
    title: 'We couldn’t connect',
    body: 'It looks like your internet connection dropped, or our website could not be reached. Check your connection, then try again.',
  },
  server: {
    title: 'Something went wrong on our side',
    body: 'This was not caused by anything you did. Please try again in a moment. If you were filling in a form, your details are still there.',
  },
};

// One modal for every network/server failure in the app. Uses the native
// <dialog> so focus trapping, Esc-to-close and the inert background come
// from the browser. While it's open, further failures are ignored, so a
// page whose three queries all fail shows one modal, not three.
export default function ServiceErrorModal() {
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const settings = useSiteSettings();

  useEffect(() => onServiceError((err) => setError((current) => current ?? err)), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (error && !dialog.open) dialog.showModal();
    if (!error && dialog.open) dialog.close();
  }, [error]);

  const tryAgain = () => {
    setError(null);
    queryClient.refetchQueries({ type: 'active', predicate: (query) => query.state.status === 'error' });
  };

  const copy = COPY[error?.kind] || COPY.server;
  const isAdmin = pathname.startsWith('/admin');

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="service-error-title"
      aria-describedby="service-error-body"
      onClose={() => setError(null)}
      onClick={(e) => e.target === e.currentTarget && setError(null)}
      className="w-[calc(100%-32px)] max-w-[460px] p-0 border-0 rounded-[18px] shadow-lg bg-white text-ink backdrop:bg-ink/60"
    >
      <div className="relative p-s4 max-[480px]:p-s3">
        <button
          type="button"
          onClick={() => setError(null)}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-muted hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <span className="flex items-center justify-center w-12 h-12 bg-coral-wash text-coral-600 mb-s3" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5M12 16.2v.3" />
          </svg>
        </span>

        <h2 id="service-error-title" className="text-[1.35rem] mb-s1 pr-8">
          {copy.title}
        </h2>
        <p id="service-error-body" className="text-muted text-[0.95rem] mb-s3">
          {copy.body}
        </p>
        {!isAdmin && (
          <p className="text-[0.9rem] mb-s3">
            Need us urgently? Call{' '}
            <a href={settings.telHref} className="font-bold underline">
              {settings.phoneDisplay}
            </a>
            , we are open 24 hours.
          </p>
        )}

        <div className="flex flex-wrap gap-s2">
          <button type="button" onClick={tryAgain} autoFocus className="btn btn--primary">
            Try again
          </button>
          {!isAdmin && (
            <a href={settings.telHref} className="btn btn--outline">
              <PhoneIcon />
              Call the clinic
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
