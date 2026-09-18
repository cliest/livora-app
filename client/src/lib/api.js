// Empty string in dev means requests go to relative /api/* paths, which
// Vite's dev proxy (vite.config.js) forwards to the Express server on 4000.
// Set VITE_API_URL to the real API origin for a production build.
const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Something went wrong.', res.status, data.errors);
  }
  return data;
}

export const api = {
  submitBooking: (payload) => request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  submitContact: (payload) => request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),

  adminLogin: (payload) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminSummary: () => request('/api/admin/summary'),

  listBookings: (params = {}) => request(`/api/bookings?${new URLSearchParams(params)}`),
  updateBooking: (id, payload) => request(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  listMessages: (params = {}) => request(`/api/contact?${new URLSearchParams(params)}`),
  updateMessage: (id, payload) => request(`/api/contact/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};

export { ApiError };
