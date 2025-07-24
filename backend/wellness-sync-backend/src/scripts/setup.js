import { sequelize } from '../config/database.js';
import { User, Habit, MoodEntry, JournalEntry } from '../models/index.js';

const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

const runSeeds = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Create sample users
    const user1 = await User.findOrCreate({
      where: { email: 'demo@wellnesssync.com' },
      defaults: {
        name: 'Demo User',
        email: 'demo@wellnesssync.com',
        password: 'password123',
        role: 'user'
      }
    });

    const user2 = await User.findOrCreate({
      where: { email: 'admin@wellnesssync.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@wellnesssync.com',
        password: 'admin123',
        role: 'admin'
      }
    });

    const userId = user1[0].id;

    // Create sample habits
    const habits = [
      { name: 'Drink Water', icon: '💧', target: 8, unit: 'glasses', userId },
      { name: 'Exercise', icon: '💪', target: 1, unit: 'session', userId },
      { name: 'Sleep 8h', icon: '😴', target: 8, unit: 'hours', userId },
      { name: 'Meditation', icon: '🧘', target: 1, unit: 'session', userId },
      { name: 'Read', icon: '📚', target: 30, unit: 'minutes', userId }
    ];

    for (const habit of habits) {
      await Habit.findOrCreate({
        where: { name: habit.name, userId: habit.userId },
        defaults: habit
      });
    }

    // Create sample mood entries
    const today = new Date();
    const moodEntries = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      moodEntries.push({
        mood: Math.floor(Math.random() * 5) + 1,
        energy: Math.floor(Math.random() * 5) + 1,
        notes: `Sample mood entry for ${date.toISOString().split('T')[0]}`,
        date: date.toISOString().split('T')[0],
        userId
      });
    }

    for (const moodEntry of moodEntries) {
      await MoodEntry.findOrCreate({
        where: { date: moodEntry.date, userId: moodEntry.userId },
        defaults: moodEntry
      });
    }

    // Create sample journal entries
    const journalEntries = [
      {
        title: 'A Great Day',
        content: 'Today was wonderful! I completed all my habits and felt really productive. The meditation session in the morning helped me start the day with clarity.',
        mood: 5,
        date: new Date().toISOString().split('T')[0],
        userId
      },
      {
        title: 'Reflection on Growth',
        content: 'Thinking about how far I\'ve come in my wellness journey. The small daily habits are really making a difference in how I feel overall.',
        mood: 4,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        userId
      }
    ];

    for (const journalEntry of journalEntries) {
      await JournalEntry.findOrCreate({
        where: { date: journalEntry.date, userId: journalEntry.userId },
        defaults: journalEntry
      });
    }

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

const main = async () => {
  await runMigrations();
  await runSeeds();
  process.exit(0);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runMigrations, runSeeds };
