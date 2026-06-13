import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleWishlist,
  getWishlist,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:paintingId', protect, toggleWishlist);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/:id/role', protect, adminOnly, updateUserRole);

export default router;