import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sabhaya_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sabhaya_token');
      localStorage.removeItem('sabhaya_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

export const ENDPOINTS = {
  // Auth — matched to backend routes
  LOGIN:           '/auth/login',
  SIGNUP:          '/auth/register',   // was /auth/signup
  LOGOUT:          '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  '/auth/reset-password',
  ME:              '/auth/me',
  GOOGLE_AUTH:     '/auth/google',
  SEND_OTP:        '/auth/send-otp',
  VERIFY_OTP:      '/auth/verify-otp',

  // Paintings — matched to backend routes
  PRODUCTS:        '/paintings',
  PRODUCT:         (id) => `/paintings/${id}`,
  FEATURED:        '/paintings/featured',
  CATEGORIES:      '/paintings/categories',

  // Orders
  ORDERS:          '/orders',
  ORDER:           (id) => `/orders/${id}`,
  MY_ORDERS:       '/orders/my',
  PAY_ORDER:       (id) => `/orders/${id}/pay`,
  CANCEL_ORDER:    (id) => `/orders/${id}/cancel`,

  // Reviews
  REVIEWS:         (productId) => `/paintings/${productId}/reviews`,

  // User
  PROFILE:         '/users/profile',
  WISHLIST:        '/users/wishlist',
  TOGGLE_WISHLIST: (id) => `/users/wishlist/${id}`,

  // Payment
  RAZORPAY_ORDER:  '/payment/create-order',
  RAZORPAY_VERIFY: '/payment/verify',

  // Admin
  ADMIN_PRODUCTS:  '/paintings',
  ADMIN_ORDERS:    '/orders',
  ADMIN_USERS:     '/users',
  ADMIN_STATS:     '/orders/admin/stats',
};