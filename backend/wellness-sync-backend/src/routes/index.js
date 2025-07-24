import express from 'express';
import authRoutes from './auth.js';
import habitRoutes from './habits.js';
import moodRoutes from './mood.js';
import journalRoutes from './journal.js';
import analyticsRoutes from './analytics.js';
import userRoutes from './users.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wellness Sync API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/habits', habitRoutes);
router.use('/api/mood', moodRoutes);
router.use('/api/journal', journalRoutes);
router.use('/api/analytics', analyticsRoutes);
router.use('/api/users', userRoutes);

// 404 handler for API routes
router.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

export default router;
