import { sendHabitReminderEmail, sendMoodCheckInEmail } from './emailService.js';
import { Habit, User, MoodEntry } from '../models/index.js';
import { Op } from 'sequelize';

export const sendNotification = async (userId, message, type = 'info') => {
  try {
    // In a real application, you might store notifications in a database
    // For now, we'll just log them and potentially send emails
    
    console.log(`Notification sent to user ${userId}: ${message} (Type: ${type})`);
    
    // Here you could integrate with push notification services like:
    // - Firebase Cloud Messaging (FCM)
    // - Apple Push Notification Service (APNs)
    // - Web Push Notifications
    // - SMS services like Twilio
    
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification: ' + error.message);
  }
};

export const sendHabitReminders = async () => {
  try {
    // Get all active users with incomplete habits for today
    const users = await User.findAll({
      where: { isActive: true },
      include: [
        {
          model: Habit,
          as: 'habits',
          where: { isActive: true },
          required: true
        }
      ]
    });

    let remindersSent = 0;

    for (const user of users) {
      const incompleteHabits = user.habits.filter(habit => habit.completed < habit.target);
      
      if (incompleteHabits.length > 0) {
        try {
          await sendHabitReminderEmail(user.email, user.name, incompleteHabits);
          await sendNotification(user.id, `You have ${incompleteHabits.length} habits to complete today!`, 'reminder');
          remindersSent++;
        } catch (emailError) {
          console.error(`Failed to send reminder to user ${user.id}:`, emailError);
        }
      }
    }

    console.log(`Sent habit reminders to ${remindersSent} users`);
    return { success: true, remindersSent };
  } catch (error) {
    console.error('Error sending habit reminders:', error);
    throw new Error('Failed to send habit reminders: ' + error.message);
  }
};

export const sendMoodCheckIns = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get users who haven't logged mood today
    const usersWithoutMoodToday = await User.findAll({
      where: { isActive: true },
      include: [
        {
          model: MoodEntry,
          as: 'moodEntries',
          where: { date: today },
          required: false
        }
      ]
    });

    const usersToRemind = usersWithoutMoodToday.filter(user => 
      !user.moodEntries || user.moodEntries.length === 0
    );

    let checkInsSent = 0;

    for (const user of usersToRemind) {
      try {
        await sendMoodCheckInEmail(user.email, user.name);
        await sendNotification(user.id, 'How are you feeling today? Take a moment to log your mood.', 'reminder');
        checkInsSent++;
      } catch (emailError) {
        console.error(`Failed to send mood check-in to user ${user.id}:`, emailError);
      }
    }

    console.log(`Sent mood check-ins to ${checkInsSent} users`);
    return { success: true, checkInsSent };
  } catch (error) {
    console.error('Error sending mood check-ins:', error);
    throw new Error('Failed to send mood check-ins: ' + error.message);
  }
};

export const sendStreakCelebration = async (userId, habitName, streakCount) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const milestones = [7, 14, 30, 60, 90, 180, 365];
    
    if (milestones.includes(streakCount)) {
      const message = `🎉 Congratulations! You've maintained your ${habitName} habit for ${streakCount} days straight!`;
      
      await sendNotification(userId, message, 'success');
      
      // You could also send a celebration email here
      console.log(`Streak celebration sent to ${user.name} for ${streakCount} days of ${habitName}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending streak celebration:', error);
    throw new Error('Failed to send streak celebration: ' + error.message);
  }
};

export const scheduleNotifications = () => {
  // In a production environment, you would use a job scheduler like:
  // - node-cron
  // - Bull Queue
  // - Agenda
  // - Or a cloud service like AWS Lambda with CloudWatch Events
  
  console.log('Notification scheduling would be set up here');
  
  // Example with node-cron (you'd need to install it):
  /*
  const cron = require('node-cron');
  
  // Send habit reminders every day at 6 PM
  cron.schedule('0 18 * * *', async () => {
    await sendHabitReminders();
  });
  
  // Send mood check-ins every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    await sendMoodCheckIns();
  });
  */
};