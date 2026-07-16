import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const ticketsApi = {
  create: (data) => api.post('/tickets', data),

  list: ({ status, search, page = 1, limit = 10 } = {}) =>
    api.get('/tickets', { params: { status, search, page, limit } }),

  getById: (ticketId) => api.get(`/tickets/${ticketId}`),

  update: (ticketId, data) => api.put(`/tickets/${ticketId}`, data),

  addNote: (ticketId, noteText) =>
    api.post(`/tickets/${ticketId}/notes`, null, { params: { note_text: noteText } }),

  aiSuggest: (ticketId) => api.post(`/tickets/${ticketId}/ai-suggest`),

  getStats: () => api.get('/stats'),
};

export default api;