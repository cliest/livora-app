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
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/admin/uploads`, { method: 'POST', credentials: 'include', body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error || 'Upload failed.', res.status);
    return data;
  },
};

export { ApiError };
