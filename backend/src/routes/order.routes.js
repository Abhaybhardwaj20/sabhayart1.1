import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Private routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getDashboardStats);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;