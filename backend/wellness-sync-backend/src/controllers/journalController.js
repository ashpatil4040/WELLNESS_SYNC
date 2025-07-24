import { JournalEntry } from '../models/index.js';
import { Op } from 'sequelize';

export const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 20, search } = req.query;

    let whereClause = { userId };

    // Add date filtering if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const journalEntries = await JournalEntry.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: { journalEntries }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching journal entries', 
      error: error.message 
    });
  }
};

export const getJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journalEntry = await JournalEntry.findOne({
      where: { id, userId }
    });

    if (!journalEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal entry not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { journalEntry }
    });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching journal entry', 
      error: error.message 
    });
  }
};

export const createJournalEntry = async (req, res) => {
  try {
    const { title, content, mood, tags, date, isPrivate } = req.body;
    const userId = req.user.id;

    const journalEntry = await JournalEntry.create({
      title,
      content,
      mood,
      tags,
      date: date || new Date().toISOString().split('T')[0],
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: { journalEntry }
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating journal entry', 
      error: error.message 
    });
  }
};

export const updateJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const journalEntry = await JournalEntry.findOne({
      where: { id, userId }
    });

    if (!journalEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal entry not found' 
      });
    }

    await journalEntry.update(updates);

    res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: { journalEntry }
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating journal entry', 
      error: error.message 
    });
  }
};

export const deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journalEntry = await JournalEntry.findOne({
      where: { id, userId }
    });

    if (!journalEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal entry not found' 
      });
    }

    await journalEntry.destroy();

    res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting journal entry', 
      error: error.message 
    });
  }
};

export const getJournalStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const journalEntries = await JournalEntry.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate.toISOString().split('T')[0]
        }
      },
      order: [['date', 'ASC']]
    });

    const totalEntries = journalEntries.length;
    const averageWordsPerEntry = totalEntries > 0 
      ? Math.round(journalEntries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0) / totalEntries)
      : 0;

    // Calculate mood distribution from journal entries
    const moodDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let entriesWithMood = 0;

    journalEntries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood]++;
        entriesWithMood++;
      }
    });

    const averageMoodFromJournal = entriesWithMood > 0 
      ? journalEntries
          .filter(entry => entry.mood)
          .reduce((sum, entry) => sum + entry.mood, 0) / entriesWithMood
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEntries,
        averageWordsPerEntry,
        averageMoodFromJournal: Math.round(averageMoodFromJournal * 100) / 100,
        moodDistribution,
        entriesWithMood,
        streakData: calculateWritingStreak(journalEntries)
      }
    });
  } catch (error) {
    console.error('Get journal stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching journal statistics', 
      error: error.message 
    });
  }
};

// Helper function to calculate writing streak
const calculateWritingStreak = (entries) => {
  if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  let checkDate = new Date(today);

  // Check for current streak
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    
    if (entryDate.toDateString() === checkDate.toDateString()) {
      currentStreak++;
      tempStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  tempStreak = 0;
  for (let i = 0; i < sortedEntries.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const currentDate = new Date(sortedEntries[i].date);
      const previousDate = new Date(sortedEntries[i - 1].date);
      const dayDifference = (previousDate - currentDate) / (1000 * 60 * 60 * 24);

      if (dayDifference === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
};