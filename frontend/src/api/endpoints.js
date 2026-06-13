export const ENDPOINTS = {
  // Auth
  LOGIN:           '/auth/login',
  SIGNUP:          '/auth/register',
  LOGOUT:          '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  '/auth/reset-password',
  ME:              '/auth/me',
  GOOGLE_AUTH:     '/auth/google',
  SEND_OTP:        '/auth/send-otp',
  VERIFY_OTP:      '/auth/verify-otp',

  // Paintings (public)
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

  // Admin (paintings)
  ADMIN_PRODUCTS:    '/paintings',
  ADMIN_PRODUCT:     (id) => `/paintings/${id}`,
  DELETE_PRODUCT:    (id) => `/paintings/${id}`,
  ADMIN_ORDERS:      '/orders',
  ADMIN_USERS:       '/users',
  ADMIN_STATS:       '/orders/admin/stats',
};