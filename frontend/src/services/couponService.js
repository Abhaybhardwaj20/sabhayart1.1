import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const couponService = {
  apply: (code, cartTotal) => API.post(ENDPOINTS.APPLY_COUPON, { code, cartTotal }),

  // Admin
  getAll: () => API.get(ENDPOINTS.ADMIN_COUPONS),
  create: (data) => API.post(ENDPOINTS.ADMIN_COUPONS, data),
  update: (id, data) => API.put(`${ENDPOINTS.ADMIN_COUPONS}/${id}`, data),
  remove: (id) => API.delete(`${ENDPOINTS.ADMIN_COUPONS}/${id}`),
};

export default couponService;