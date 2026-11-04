import { api as publicApi, request, send } from '../lib/api.js';

export { ApiError, inlineErrorMessage, isServiceError } from '../lib/api.js';

// Staff dashboard endpoints, on top of the public ones. Only the admin entry
// (admin.html) imports this, so these paths never reach the public bundle.
export const api = {
  ...publicApi,

  adminLogin: (payload) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminVerifyCode: (code) => request('/api/admin/login/verify', { method: 'POST', body: JSON.stringify({ code }) }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminSummary: () => request('/api/admin/summary'),

  adminListUsers: () => request('/api/admin/users'),
  createAdminUser: (payload) => request('/api/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminUser: (id, payload) => request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteAdminUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
  resetAdminTwoFactor: (id) => request(`/api/admin/users/${id}/reset-2fa`, { method: 'POST' }),

  listBookings: (params = {}) => request(`/api/bookings?${new URLSearchParams(params)}`),
  updateBooking: (id, payload) => request(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  listMessages: (params = {}) => request(`/api/contact?${new URLSearchParams(params)}`),
  updateMessage: (id, payload) => request(`/api/contact/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  updateSettings: (payload) => request('/api/settings', { method: 'PATCH', body: JSON.stringify(payload) }),

  adminListTeam: () => request('/api/admin/team'),
  createTeamMember: (payload) => request('/api/admin/team', { method: 'POST', body: JSON.stringify(payload) }),
  updateTeamMember: (id, payload) => request(`/api/admin/team/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTeamMember: (id) => request(`/api/admin/team/${id}`, { method: 'DELETE' }),

  adminListTestimonials: () => request('/api/admin/testimonials'),
  createTestimonial: (payload) => request('/api/admin/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
  updateTestimonial: (id, payload) =>
    request(`/api/admin/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTestimonial: (id) => request(`/api/admin/testimonials/${id}`, { method: 'DELETE' }),

  createPriceCategory: (payload) =>
    request('/api/admin/prices/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updatePriceCategory: (id, payload) =>
    request(`/api/admin/prices/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePriceCategory: (id) => request(`/api/admin/prices/categories/${id}`, { method: 'DELETE' }),
  createPriceItem: (payload) => request('/api/admin/prices/items', { method: 'POST', body: JSON.stringify(payload) }),
  updatePriceItem: (id, payload) =>
    request(`/api/admin/prices/items/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePriceItem: (id) => request(`/api/admin/prices/items/${id}`, { method: 'DELETE' }),

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
