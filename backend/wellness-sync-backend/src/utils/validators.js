import { MOOD_LEVELS } from './constants.js';

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 6 characters long
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  // Optional: Add more password strength requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 100) {
    return { valid: false, message: 'Name must be less than 100 characters' };
  }
  
  return { valid: true };
};

export const validateHabit = (habit) => {
  const errors = [];
  
  if (!habit.name || habit.name.trim().length === 0) {
    errors.push('Habit name is required');
  }
  
  if (habit.name && habit.name.length > 100) {
    errors.push('Habit name must be less than 100 characters');
  }
  
  if (!habit.target || habit.target <= 0) {
    errors.push('Habit target must be greater than 0');
  }
  
  if (habit.target && habit.target > 1000) {
    errors.push('Habit target must be less than 1000');
  }
  
  if (habit.unit && habit.unit.length > 20) {
    errors.push('Habit unit must be less than 20 characters');
  }

  if (habit.color && !/^#[0-9A-Fa-f]{6}$/.test(habit.color)) {
    errors.push('Invalid color format. Must be hex color (e.g., #3b82f6)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateMoodEntry = (moodEntry) => {
  const errors = [];
  
  if (!moodEntry.mood) {
    errors.push('Mood value is required');
  }
  
  if (moodEntry.mood && (moodEntry.mood < MOOD_LEVELS.VERY_BAD || moodEntry.mood > MOOD_LEVELS.EXCELLENT)) {
    errors.push('Mood value must be between 1 and 5');
  }
  
  if (moodEntry.energy && (moodEntry.energy < 1 || moodEntry.energy > 5)) {
    errors.push('Energy value must be between 1 and 5');
  }
  
  if (moodEntry.notes && moodEntry.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }

  if (moodEntry.date && !isValidDate(moodEntry.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateJournalEntry = (journalEntry) => {
  const errors = [];
  
  if (!journalEntry.content || journalEntry.content.trim().length === 0) {
    errors.push('Journal content is required');
  }
  
  if (journalEntry.content && journalEntry.content.length > 10000) {
    errors.push('Journal content must be less than 10,000 characters');
  }
  
  if (journalEntry.title && journalEntry.title.length > 200) {
    errors.push('Journal title must be less than 200 characters');
  }
  
  if (journalEntry.mood && (journalEntry.mood < MOOD_LEVELS.VERY_BAD || journalEntry.mood > MOOD_LEVELS.EXCELLENT)) {
    errors.push('Mood value must be between 1 and 5');
  }

  if (journalEntry.date && !isValidDate(journalEntry.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }

  if (journalEntry.tags && Array.isArray(journalEntry.tags)) {
    journalEntry.tags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.length > 50) {
        errors.push(`Tag ${index + 1} must be a string less than 50 characters`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateDateRange = (startDate, endDate) => {
  const errors = [];
  
  if (!isValidDate(startDate)) {
    errors.push('Invalid start date format. Use YYYY-MM-DD');
  }
  
  if (!isValidDate(endDate)) {
    errors.push('Invalid end date format. Use YYYY-MM-DD');
  }
  
  if (isValidDate(startDate) && isValidDate(endDate)) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.push('Start date must be before end date');
    }
    
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      errors.push('Date range cannot exceed 365 days');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validatePagination = (page, limit) => {
  const errors = [];
  
  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push('Page must be a positive integer');
  }
  
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push('Limit must be an integer between 1 and 100');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }
  
  return date.toISOString().startsWith(dateString);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 10000); // Limit length
};