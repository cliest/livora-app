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
  constructor(message, status, fieldErrors, kind = 'request') {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.kind = kind;
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
    throw new ApiError(data.error || 'Something went wrong.', res.status, data.errors);
  }
  return data;
}

function request(path, options = {}) {
  return send(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
}

export const api = {
  submitBooking: (payload) => request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  submitContact: (payload) => request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),

  adminLogin: (payload) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminSummary: () => request('/api/admin/summary'),

  adminListUsers: () => request('/api/admin/users'),
  createAdminUser: (payload) => request('/api/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminUser: (id, payload) => request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteAdminUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),

  listBookings: (params = {}) => request(`/api/bookings?${new URLSearchParams(params)}`),
  updateBooking: (id, payload) => request(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  listMessages: (params = {}) => request(`/api/contact?${new URLSearchParams(params)}`),
  updateMessage: (id, payload) => request(`/api/contact/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  getSettings: () => request('/api/settings'),
  updateSettings: (payload) => request('/api/settings', { method: 'PATCH', body: JSON.stringify(payload) }),

  getTeam: () => request('/api/team'),
  adminListTeam: () => request('/api/admin/team'),
  createTeamMember: (payload) => request('/api/admin/team', { method: 'POST', body: JSON.stringify(payload) }),
  updateTeamMember: (id, payload) => request(`/api/admin/team/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTeamMember: (id) => request(`/api/admin/team/${id}`, { method: 'DELETE' }),

  getTestimonials: () => request('/api/testimonials'),
  adminListTestimonials: () => request('/api/admin/testimonials'),
  createTestimonial: (payload) => request('/api/admin/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
  updateTestimonial: (id, payload) =>
    request(`/api/admin/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTestimonial: (id) => request(`/api/admin/testimonials/${id}`, { method: 'DELETE' }),

  getPrices: () => request('/api/prices'),
  createPriceCategory: (payload) =>
    request('/api/admin/prices/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updatePriceCategory: (id, payload) =>
    request(`/api/admin/prices/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePriceCategory: (id) => request(`/api/admin/prices/categories/${id}`, { method: 'DELETE' }),
  createPriceItem: (payload) => request('/api/admin/prices/items', { method: 'POST', body: JSON.stringify(payload) }),
  updatePriceItem: (id, payload) =>
    request(`/api/admin/prices/items/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePriceItem: (id) => request(`/api/admin/prices/items/${id}`, { method: 'DELETE' }),

  getAccreditations: () => request('/api/accreditations'),
  adminListAccreditations: () => request('/api/admin/accreditations'),
  createAccreditation: (payload) => request('/api/admin/accreditations', { method: 'POST', body: JSON.stringify(payload) }),
  updateAccreditation: (id, payload) =>
    request(`/api/admin/accreditations/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteAccreditation: (id) => request(`/api/admin/accreditations/${id}`, { method: 'DELETE' }),

  // Multipart upload — bypasses request() since that always sets a JSON
  // Content-Type; the browser needs to set its own multipart boundary here.
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return send('/api/admin/uploads', { method: 'POST', body: formData });
  },
};

export { ApiError };
