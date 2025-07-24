import { Habit } from '../models/index.js';

export const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.findAll({
      where: { userId, isActive: true },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: { habits }
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching habits', 
      error: error.message 
    });
  }
};

export const getHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findOne({
      where: { id, userId, isActive: true }
    });

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { habit }
    });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching habit', 
      error: error.message 
    });
  }
};

export const createHabit = async (req, res) => {
  try {
    const { name, icon, target, unit, color } = req.body;
    const userId = req.user.id;

    const habit = await Habit.create({
      name,
      icon: icon || '🎯',
      target,
      unit: unit || 'times',
      color: color || '#3b82f6',
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: { habit }
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating habit', 
      error: error.message 
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const habit = await Habit.findOne({
      where: { id, userId, isActive: true }
    });

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    // Update habit
    await habit.update(updates);

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: { habit }
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating habit', 
      error: error.message 
    });
  }
};

export const updateHabitProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    const habit = await Habit.findOne({
      where: { id, userId, isActive: true }
    });

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    // Update completed count
    const oldCompleted = habit.completed;
    habit.completed = Math.max(0, Math.min(completed, habit.target));

    // Update streak logic
    if (habit.completed >= habit.target && oldCompleted < habit.target) {
      // Goal achieved for the first time today
      habit.streak += 1;
    } else if (habit.completed < habit.target && oldCompleted >= habit.target) {
      // Goal was achieved but now not completed
      // Note: In a real app, you might want more sophisticated streak logic
    }

    await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit progress updated successfully',
      data: { habit }
    });
  } catch (error) {
    console.error('Update habit progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating habit progress', 
      error: error.message 
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findOne({
      where: { id, userId, isActive: true }
    });

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    // Soft delete
    habit.isActive = false;
    await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting habit', 
      error: error.message 
    });
  }
};

export const resetDailyProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    await Habit.update(
      { completed: 0 },
      { where: { userId, isActive: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Daily progress reset successfully'
    });
  } catch (error) {
    console.error('Reset daily progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting daily progress', 
      error: error.message 
    });
  }
};