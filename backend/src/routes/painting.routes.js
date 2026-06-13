import express from 'express';
import {
  getAllPaintings,
  getPaintingById,
  getFeaturedPaintings,
  createPainting,
  updatePainting,
  deletePainting,
  addReview,
  getCategories,
} from '../controllers/painting.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config for local uploads (fallback when Cloudinary not configured)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `painting-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

// Public routes
router.get('/featured', getFeaturedPaintings);
router.get('/categories', getCategories);
router.get('/', getAllPaintings);
router.get('/:id', getPaintingById);

// Private routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), createPainting);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updatePainting);
router.delete('/:id', protect, adminOnly, deletePainting);

export default router;