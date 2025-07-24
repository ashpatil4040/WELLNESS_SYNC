import { MOOD_LABELS, MOOD_EMOJIS } from './constants.js';

export const formatDate = (date, format = 'short') => {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

export const getMoodLabel = (moodValue) => {
  return MOOD_LABELS[moodValue] || 'Unknown';
};

export const getMoodEmoji = (moodValue) => {
  return MOOD_EMOJIS[moodValue] || '😐';
};

export const calculateCompletionRate = (completed, target) => {
  if (target === 0) return 0;
  return Math.round((completed / target) * 100);
};

export const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  const sortedEntries = entries
    .map(entry => new Date(entry.date))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);

  for (const entryDate of sortedEntries) {
    const entry = new Date(entryDate);
    entry.setHours(0, 0, 0, 0);

    if (entry.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (entry.getTime() < checkDate.getTime()) {
      break;
    }
  }

  return streak;
};

export const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current).toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const getWeekDates = (offsetWeeks = 0) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (offsetWeeks * 7)));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    start: startOfWeek.toISOString().split('T')[0],
    end: endOfWeek.toISOString().split('T')[0]
  };
};

export const getMonthDates = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
    daysInMonth: endDate.getDate()
  };
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const generateRandomColor = () => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const paginate = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const formatApiResponse = (success, data = null, message = '', errors = null) => {
  const response = { success };
  
  if (message) response.message = message;
  if (data !== null) response.data = data;
  if (errors) response.errors = errors;
  
  return response;
};

export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};