import { Habit, MoodEntry, JournalEntry } from '../models/index.js';
import { Op } from 'sequelize';

export const getUserAnalytics = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch user habits and mood entries for analytics
    const habits = await Habit.findAll({ 
      where: { userId, isActive: true } 
    });
    
    const moodEntries = await MoodEntry.findAll({ 
      where: { 
        userId,
        date: { [Op.gte]: startDateStr }
      } 
    });

    const journalEntries = await JournalEntry.findAll({ 
      where: { 
        userId,
        date: { [Op.gte]: startDateStr }
      } 
    });

    // Calculate analytics data
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.completed >= habit.target).length;
    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((acc, entry) => acc + entry.mood, 0) / moodEntries.length 
      : 0;

    const habitCompletionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    // Weekly trend analysis
    const weeklyTrends = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMood = moodEntries.find(entry => entry.date === dateStr);
      const dayJournal = journalEntries.find(entry => entry.date === dateStr);

      weeklyTrends.unshift({
        date: dateStr,
        mood: dayMood ? dayMood.mood : null,
        energy: dayMood ? dayMood.energy : null,
        hasJournal: !!dayJournal
      });
    }

    return {
      totalHabits,
      completedHabits,
      averageMood: Math.round(averageMood * 100) / 100,
      habitCompletionRate: Math.round(habitCompletionRate * 100) / 100,
      longestStreak,
      totalMoodEntries: moodEntries.length,
      totalJournalEntries: journalEntries.length,
      weeklyTrends,
      habits: habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        completed: habit.completed,
        target: habit.target,
        streak: habit.streak,
        completionRate: Math.round((habit.completed / habit.target) * 100)
      }))
    };
  } catch (error) {
    throw new Error('Error fetching user analytics: ' + error.message);
  }
};

export const getMoodTrends = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const moodEntries = await MoodEntry.findAll({
      where: {
        userId,
        date: { [Op.gte]: startDateStr }
      },
      order: [['date', 'ASC']]
    });

    return moodEntries.map(entry => ({
      date: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      notes: entry.notes
    }));
  } catch (error) {
    throw new Error('Error fetching mood trends: ' + error.message);
  }
};

export const getHabitProgress = async (userId, habitId = null) => {
  try {
    let whereClause = { userId, isActive: true };
    if (habitId) {
      whereClause.id = habitId;
    }

    const habits = await Habit.findAll({ where: whereClause });

    return habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      completed: habit.completed,
      target: habit.target,
      streak: habit.streak,
      unit: habit.unit,
      completionRate: Math.round((habit.completed / habit.target) * 100),
      isCompleted: habit.completed >= habit.target
    }));
  } catch (error) {
    throw new Error('Error fetching habit progress: ' + error.message);
  }
};