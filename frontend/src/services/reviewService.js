import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const reviewService = {
  getForProduct: (productId) => API.get(ENDPOINTS.REVIEWS(productId)),
  create: (productId, data) => API.post(ENDPOINTS.REVIEWS(productId), data),
  update: (productId, reviewId, data) => API.put(`${ENDPOINTS.REVIEWS(productId)}/${reviewId}`, data),
  remove: (productId, reviewId) => API.delete(`${ENDPOINTS.REVIEWS(productId)}/${reviewId}`),
};

export default reviewService;