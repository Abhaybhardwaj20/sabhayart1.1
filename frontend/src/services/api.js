// frontend/src/services/api.js
// Place this file at: frontend/src/services/api.js

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  logout: () => api.post('/auth/logout'),
};

// ─── Paintings ────────────────────────────────────────────
export const paintingAPI = {
  getAll: (params) => api.get('/paintings', { params }),
  getById: (id) => api.get(`/paintings/${id}`),
  getFeatured: () => api.get('/paintings/featured'),
  getCategories: () => api.get('/paintings/categories'),
  create: (data) => api.post('/paintings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/paintings/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/paintings/${id}`),
  addReview: (id, data) => api.post(`/paintings/${id}/reviews`, data),
};

// ─── Orders ───────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  pay: (id, data) => api.put(`/orders/${id}/pay`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  // Admin
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: () => api.get('/orders/admin/stats'),
};

// ─── Users ────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getWishlist: () => api.get('/users/wishlist'),
  toggleWishlist: (paintingId) => api.post(`/users/wishlist/${paintingId}`),
  // Admin
  getAll: (params) => api.get('/users', { params }),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export default api;