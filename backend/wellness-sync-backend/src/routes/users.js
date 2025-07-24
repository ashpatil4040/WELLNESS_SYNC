import express from 'express';
import { getUserProfile, getUsers, getUser, updateUser, deleteUser, getUserStats } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/profile', getUserProfile); // Get current user's profile
router.get('/:id/stats', getUserStats); // Get user stats (specific ID)
router.get('/', authorize(['admin']), getUsers); // Only admin can get all users
router.get('/:id', getUser); // Get specific user (must be after more specific routes)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;