import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import paintingRoutes from './painting.routes.js';
import orderRoutes from './order.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/paintings', paintingRoutes);
router.use('/orders', orderRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

export default router;