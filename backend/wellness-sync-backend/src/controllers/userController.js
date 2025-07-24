import { User, Habit, MoodEntry, JournalEntry } from '../models/index.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile', 
      error: error.message 
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Habit,
          as: 'habits',
          where: { isActive: true },
          required: false
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Habit,
          as: 'habits',
          where: { isActive: true },
          required: false
        },
        {
          model: MoodEntry,
          as: 'moodEntries',
          limit: 10,
          order: [['date', 'DESC']],
          required: false
        },
        {
          model: JournalEntry,
          as: 'journalEntries',
          limit: 5,
          order: [['date', 'DESC']],
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, therapistConnected, role } = req.body;

    // Check if user is trying to update their own profile or is admin
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this user' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (typeof therapistConnected !== 'undefined') user.therapistConnected = therapistConnected;
    
    // Only admin can change roles
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    await user.save();

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      therapistConnected: user.therapistConnected,
      isActive: user.isActive
    };

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user', 
      error: error.message 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin or trying to delete their own account
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this user' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Soft delete - deactivate user instead of hard delete
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is requesting their own stats or is admin
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view these stats' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user statistics
    const totalHabits = await Habit.count({ where: { userId: id, isActive: true } });
    const totalMoodEntries = await MoodEntry.count({ where: { userId: id } });
    const totalJournalEntries = await JournalEntry.count({ where: { userId: id } });

    // Get recent activity
    const recentMoods = await MoodEntry.findAll({
      where: { userId: id },
      order: [['date', 'DESC']],
      limit: 7
    });

    const recentJournals = await JournalEntry.findAll({
      where: { userId: id },
      order: [['date', 'DESC']],
      limit: 5
    });

    const habits = await Habit.findAll({
      where: { userId: id, isActive: true }
    });

    const completedHabits = habits.filter(h => h.completed >= h.target).length;
    const averageMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          therapistConnected: user.therapistConnected
        },
        stats: {
          totalHabits,
          completedHabits,
          totalMoodEntries,
          totalJournalEntries,
          averageMood: Math.round(averageMood * 100) / 100,
          habitCompletionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
        },
        recentActivity: {
          moods: recentMoods.slice(0, 5),
          journals: recentJournals.map(j => ({
            id: j.id,
            title: j.title,
            date: j.date,
            mood: j.mood
          })),
          habits: habits.map(h => ({
            id: h.id,
            name: h.name,
            completed: h.completed,
            target: h.target,
            streak: h.streak
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user statistics', 
      error: error.message 
    });
  }
};