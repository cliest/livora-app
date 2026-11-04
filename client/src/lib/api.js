// Empty string in dev means requests go to relative /api/* paths, which
// Vite's dev proxy (vite.config.js) forwards to the Express server on 4000.
// Set VITE_API_URL to the real API origin for a production build.
const API_BASE = import.meta.env.VITE_API_URL || '';

const REQUEST_TIMEOUT_MS = 20000;

// kind: 'network' — the request never got an answer (offline, DNS, timeout)
//       'server'  — the API (or Nginx in front of it) failed with a 5xx
//       'request' — a 4xx the user can act on (validation, rate limit, auth)
// Only 'request' errors carry the server's own wording. Network and server
// errors always use the fixed copy below, so nothing the server says about
// its own failure ever reaches the page; ServiceErrorModal handles those.
const SERVICE_MESSAGES = {
  network: 'We could not reach Livora. Please check your connection and try again.',
  server: 'Something went wrong on our side. Please try again in a moment.',
};

class ApiError extends Error {
  constructor(message, status, fieldErrors, kind = 'request', restart = false) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.kind = kind;
    // Set by the staff sign-in when its two-step session has expired.
    this.restart = restart;
  }
}

export function isServiceError(err) {
  return err instanceof ApiError && err.kind !== 'request';
}

// For inline form errors. Network/server failures return '' because the
// modal already explains them; anything that isn't an ApiError is a bug on
// our side, so it gets the caller's generic fallback rather than its message.
export function inlineErrorMessage(err, fallback = 'Something went wrong.') {
  if (isServiceError(err)) return '';
  return err instanceof ApiError ? err.message : fallback;
}

async function send(path, init) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      signal: AbortSignal.timeout?.(REQUEST_TIMEOUT_MS),
      ...init,
    });
  } catch {
    throw new ApiError(SERVICE_MESSAGES.network, 0, undefined, 'network');
  }

  const data = await res.json().catch(() => ({}));

  if (res.status >= 500) {
    throw new ApiError(SERVICE_MESSAGES.server, res.status, undefined, 'server');
  }
  if (!res.ok) {
    throw new ApiError(data.error || 'Something went wrong.', res.status, data.errors, 'request', data.restart === true);
  }
  return data;
}

function request(path, options = {}) {
  return send(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
}

// Public-site endpoints only. The staff dashboard has its own module
// (src/admin/api.js) so that none of its routes end up in the JavaScript every
// visitor downloads.
export const api = {
  submitBooking: (payload) => request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  getAvailability: (date) => request(`/api/bookings/availability?${new URLSearchParams({ date })}`),
  submitContact: (payload) => request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),

  getSettings: () => request('/api/settings'),
  getTeam: () => request('/api/team'),
  getTestimonials: () => request('/api/testimonials'),
  getPrices: () => request('/api/prices'),
  getAccreditations: () => request('/api/accreditations'),
};

export { ApiError, request, send };
