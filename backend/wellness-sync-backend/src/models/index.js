import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Habit } from './Habit.js';
import { MoodEntry } from './MoodEntry.js';
import { JournalEntry } from './JournalEntry.js';

// Define associations
User.hasMany(Habit, { foreignKey: 'userId', as: 'habits' });
Habit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MoodEntry, { foreignKey: 'userId', as: 'moodEntries' });
MoodEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(JournalEntry, { foreignKey: 'userId', as: 'journalEntries' });
JournalEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Habit, MoodEntry, JournalEntry };