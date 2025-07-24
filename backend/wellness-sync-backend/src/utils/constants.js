export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const MOOD_LEVELS = {
  VERY_BAD: 1,
  BAD: 2,
  OKAY: 3,
  GOOD: 4,
  EXCELLENT: 5
};

export const MOOD_LABELS = {
  1: 'Very Bad',
  2: 'Bad', 
  3: 'Okay',
  4: 'Good',
  5: 'Excellent'
};

export const MOOD_EMOJIS = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊', 
  5: '😄'
};

export const HABIT_ICONS = [
  '💧', '💪', '😴', '🧘', '📚', '🏃', '🥗', '☕', '🎯', '✍️',
  '🧘‍♀️', '🧘‍♂️', '🚶', '🚴', '🏊', '🧗', '🎸', '🎨', '📝', '🌱'
];

export const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  REMINDER: 'reminder'
};

export const API_MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    HABIT_CREATED: 'Habit created successfully',
    HABIT_UPDATED: 'Habit updated successfully',
    HABIT_DELETED: 'Habit deleted successfully',
    MOOD_CREATED: 'Mood entry created successfully',
    MOOD_UPDATED: 'Mood entry updated successfully',
    MOOD_DELETED: 'Mood entry deleted successfully',
    JOURNAL_CREATED: 'Journal entry created successfully',
    JOURNAL_UPDATED: 'Journal entry updated successfully',
    JOURNAL_DELETED: 'Journal entry deleted successfully'
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found',
    HABIT_NOT_FOUND: 'Habit not found',
    MOOD_NOT_FOUND: 'Mood entry not found',
    JOURNAL_NOT_FOUND: 'Journal entry not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Not authorized',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error'
  }
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const DATE_FORMATS = {
  ISO_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'MMM DD, YYYY',
  FULL_DATE: 'MMMM DD, YYYY'
};