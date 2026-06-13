import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const authService = {
  login: (credentials) => API.post(ENDPOINTS.LOGIN, credentials),
  signup: (data) => API.post(ENDPOINTS.SIGNUP, data),
  logout: () => API.post(ENDPOINTS.LOGOUT),
  forgotPassword: (email) => API.post(ENDPOINTS.FORGOT_PASSWORD, { email }),
  resetPassword: (data) => API.post(ENDPOINTS.RESET_PASSWORD, data),
  getMe: () => API.get(ENDPOINTS.ME),
  updateMe: (data) => API.put(ENDPOINTS.ME, data),
  sendOtp: (email) => API.post(ENDPOINTS.SEND_OTP, { email }),
  verifyOtp: (email, otp) => API.post(ENDPOINTS.VERIFY_OTP, { email, otp }),
  changePassword: (data) => API.put('/auth/change-password', data),

  saveSession: (token, user) => {
    localStorage.setItem('sabhaya_token', token);
    localStorage.setItem('sabhaya_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('sabhaya_token');
    localStorage.removeItem('sabhaya_user');
  },
  getStoredUser: () => {
    try { return JSON.parse(localStorage.getItem('sabhaya_user')); }
    catch { return null; }
  },
};

export default authService;