import express from 'express';
import { 
  getHabits, 
  getHabit, 
  createHabit, 
  updateHabit, 
  updateHabitProgress,
  deleteHabit,
  resetDailyProgress
} from '../controllers/habitsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, habitSchema, updateHabitSchema } from '../middleware/validation.js';
import { createLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/', getHabits);
router.get('/:id', getHabit);
router.post('/', createLimiter, validate(habitSchema), createHabit);
router.put('/:id', validate(updateHabitSchema), updateHabit);
router.patch('/:id/progress', updateHabitProgress);
router.delete('/:id', deleteHabit);
router.post('/reset-daily', resetDailyProgress);

export default router;