import express from 'express';
import { 
  getJournalEntries, 
  getJournalEntry, 
  createJournalEntry, 
  updateJournalEntry, 
  deleteJournalEntry, 
  getJournalStats 
} from '../controllers/journalController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, journalSchema } from '../middleware/validation.js';
import { createLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/', getJournalEntries);
router.get('/stats', getJournalStats);
router.get('/:id', getJournalEntry);
router.post('/', createLimiter, validate(journalSchema), createJournalEntry);
router.put('/:id', validate(journalSchema), updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;