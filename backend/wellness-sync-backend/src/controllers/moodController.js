import { MoodEntry } from '../models/index.js';
import { Op } from 'sequelize';

export const getMoodEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30 } = req.query;

    let whereClause = { userId };

    // Add date filtering if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    const moodEntries = await MoodEntry.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: { moodEntries }
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mood entries', 
      error: error.message 
    });
  }
};

export const getMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const moodEntry = await MoodEntry.findOne({
      where: { id, userId }
    });

    if (!moodEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mood entry not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { moodEntry }
    });
  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mood entry', 
      error: error.message 
    });
  }
};

export const createMoodEntry = async (req, res) => {
  try {
    const { mood, moodLabel, notes, energy, date } = req.body;
    const userId = req.user.id;

    // Check if mood entry already exists for this date
    const existingEntry = await MoodEntry.findOne({
      where: { 
        userId, 
        date: date || new Date().toISOString().split('T')[0] 
      }
    });

    if (existingEntry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mood entry already exists for this date' 
      });
    }

    const moodEntry = await MoodEntry.create({
      mood,
      moodLabel,
      notes,
      energy,
      date: date || new Date().toISOString().split('T')[0],
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Mood entry created successfully',
      data: { moodEntry }
    });
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating mood entry', 
      error: error.message 
    });
  }
};

export const updateMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const moodEntry = await MoodEntry.findOne({
      where: { id, userId }
    });

    if (!moodEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mood entry not found' 
      });
    }

    await moodEntry.update(updates);

    res.status(200).json({
      success: true,
      message: 'Mood entry updated successfully',
      data: { moodEntry }
    });
  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating mood entry', 
      error: error.message 
    });
  }
};

export const deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const moodEntry = await MoodEntry.findOne({
      where: { id, userId }
    });

    if (!moodEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mood entry not found' 
      });
    }

    await moodEntry.destroy();

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting mood entry', 
      error: error.message 
    });
  }
};

export const getMoodStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moodEntries = await MoodEntry.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate.toISOString().split('T')[0]
        }
      },
      order: [['date', 'ASC']]
    });

    // Calculate statistics
    const totalEntries = moodEntries.length;
    const averageMood = totalEntries > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries 
      : 0;

    const moodDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    moodEntries.forEach(entry => {
      moodDistribution[entry.mood]++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalEntries,
        averageMood: Math.round(averageMood * 100) / 100,
        moodDistribution,
        entries: moodEntries
      }
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mood statistics', 
      error: error.message 
    });
  }
};