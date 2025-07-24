import { Habit, MoodEntry, JournalEntry } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get basic counts
    const totalHabits = await Habit.count({ where: { userId, isActive: true } });
    const totalMoodEntries = await MoodEntry.count({ where: { userId } });
    const totalJournalEntries = await JournalEntry.count({ where: { userId } });

    // Get habits completion data
    const habits = await Habit.findAll({
      where: { userId, isActive: true }
    });

    const completedHabits = habits.filter(habit => habit.completed >= habit.target).length;
    const habitCompletionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

    // Get mood trends
    const moodEntries = await MoodEntry.findAll({
      where: {
        userId,
        date: { [Op.gte]: startDateStr }
      },
      order: [['date', 'ASC']]
    });

    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
      : 0;

    // Get streaks
    const longestHabitStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalHabits,
          totalMoodEntries,
          totalJournalEntries,
          completedHabits,
          habitCompletionRate: Math.round(habitCompletionRate * 100) / 100,
          averageMood: Math.round(averageMood * 100) / 100,
          longestHabitStreak
        },
        trends: {
          moodTrend: moodEntries.map(entry => ({
            date: entry.date,
            mood: entry.mood,
            energy: entry.energy
          })),
          habitTrend: habits.map(habit => ({
            name: habit.name,
            completed: habit.completed,
            target: habit.target,
            completionRate: Math.round((habit.completed / habit.target) * 100),
            streak: habit.streak
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics data', 
      error: error.message 
    });
  }
};

export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get last 7 days data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days including today

    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Get mood for this date
      const moodEntry = await MoodEntry.findOne({
        where: { userId, date: dateStr }
      });

      // Get habits completion for this date (simplified - in real app you'd track daily progress)
      const habits = await Habit.findAll({
        where: { userId, isActive: true }
      });

      const completedHabits = habits.filter(h => h.completed >= h.target).length;

      weeklyData.push({
        date: dateStr,
        mood: moodEntry ? moodEntry.mood : null,
        energy: moodEntry ? moodEntry.energy : null,
        habits: completedHabits,
        totalHabits: habits.length
      });
    }

    res.status(200).json({
      success: true,
      data: { weeklyData }
    });
  } catch (error) {
    console.error('Get weekly analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching weekly analytics', 
      error: error.message 
    });  
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Get mood entries for the month
    const moodEntries = await MoodEntry.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDateStr, endDateStr]
        }
      }
    });

    // Get journal entries for the month
    const journalEntries = await JournalEntry.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDateStr, endDateStr]
        }
      }
    });

    // Calculate monthly statistics
    const daysInMonth = endDate.getDate();
    const moodDays = moodEntries.length;
    const journalDays = journalEntries.length;
    
    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
      : 0;

    const moodDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moodEntries.forEach(entry => {
      moodDistribution[entry.mood]++;
    });

    res.status(200).json({
      success: true,
      data: {
        month: targetMonth,
        year: targetYear,
        daysInMonth,
        statistics: {
          moodDays,
          journalDays,
          averageMood: Math.round(averageMood * 100) / 100,
          moodDistribution,
          moodConsistency: Math.round((moodDays / daysInMonth) * 100),
          journalConsistency: Math.round((journalDays / daysInMonth) * 100)
        },
        dailyData: Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = new Date(targetYear, targetMonth - 1, day).toISOString().split('T')[0];
          
          const dayMood = moodEntries.find(entry => entry.date === dateStr);
          const dayJournal = journalEntries.find(entry => entry.date === dateStr);

          return {
            day,
            date: dateStr,
            mood: dayMood ? dayMood.mood : null,
            energy: dayMood ? dayMood.energy : null,
            hasJournal: !!dayJournal
          };
        })
      }
    });
  } catch (error) {
    console.error('Get monthly analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching monthly analytics', 
      error: error.message 
    });
  }
};

export const getHabitAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const { days = 30 } = req.query;

    let whereClause = { userId, isActive: true };
    if (habitId) {
      whereClause.id = habitId;
    }

    const habits = await Habit.findAll({ where: whereClause });

    if (habitId && habits.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    const habitAnalytics = habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      target: habit.target,
      completed: habit.completed,
      streak: habit.streak,
      completionRate: Math.round((habit.completed / habit.target) * 100),
      unit: habit.unit,
      color: habit.color,
      isCompleted: habit.completed >= habit.target
    }));

    // Calculate overall statistics
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completed >= h.target).length;
    const overallCompletionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
    const averageStreak = totalHabits > 0 
      ? habits.reduce((sum, h) => sum + h.streak, 0) / totalHabits 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        habits: habitAnalytics,
        summary: {
          totalHabits,
          completedHabits,
          overallCompletionRate: Math.round(overallCompletionRate * 100) / 100,
          averageStreak: Math.round(averageStreak * 100) / 100,
          longestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get habit analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching habit analytics', 
      error: error.message 
    });
  }
};