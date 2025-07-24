import express from 'express';
import { 
  getMoodEntries, 
  getMoodEntry, 
  createMoodEntry, 
  updateMoodEntry, 
  deleteMoodEntry, 
  getMoodStats 
} from '../controllers/moodController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, moodSchema } from '../middleware/validation.js';
import { createLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/', getMoodEntries);
router.get('/stats', getMoodStats);
router.get('/:id', getMoodEntry);
router.post('/', createLimiter, validate(moodSchema), createMoodEntry);
router.put('/:id', validate(moodSchema), updateMoodEntry);
router.delete('/:id', deleteMoodEntry);

export default router;