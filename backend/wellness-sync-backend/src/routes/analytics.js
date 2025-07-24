import express from 'express';
import { 
  getAnalytics, 
  getWeeklyAnalytics, 
  getMonthlyAnalytics, 
  getHabitAnalytics 
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/', getAnalytics);
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly', getMonthlyAnalytics);
router.get('/habits', getHabitAnalytics);
router.get('/habits/:habitId', getHabitAnalytics);

export default router;