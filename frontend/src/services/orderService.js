import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const orderService = {
  create: (orderData) => API.post(ENDPOINTS.ORDERS, orderData),
  getMyOrders: () => API.get(ENDPOINTS.MY_ORDERS),
  getOne: (id) => API.get(ENDPOINTS.ORDER(id)),
  getAll: (params = {}) => API.get(ENDPOINTS.ORDERS, { params }),        // admin
  updateStatus: (id, status) => API.put(ENDPOINTS.ORDER(id), { status }), // admin
};

export default orderService;