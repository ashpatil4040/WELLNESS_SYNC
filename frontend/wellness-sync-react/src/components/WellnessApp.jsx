import React, { useState } from 'react';
import Navigation from './common/Navigation';
import Footer from './common/Footer';
import Dashboard from './dashboard/Dashboard';
import HabitsTab from './habits/HabitsTab';
import MoodTab from './mood/MoodTab';
import JournalTab from './journal/JournalTab';
import AnalyticsTab from './analytics/AnalyticsTab';

const WellnessApp = () => {
  const [user, setUser] = useState({ name: 'Alex Johnson', role: 'user', therapistConnected: true });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink Water', target: 8, completed: 6, streak: 5, unit: 'glasses', icon: '💧' },
    { id: 2, name: 'Exercise', target: 1, completed: 1, streak: 3, unit: 'session', icon: '💪' },
    { id: 3, name: 'Sleep 8h', target: 8, completed: 7, streak: 2, unit: 'hours', icon: '😴' },
    { id: 4, name: 'Meditation', target: 1, completed: 1, streak: 7, unit: 'session', icon: '🧘' }
  ]);
  const [mood, setMood] = useState(3);
  const [journalEntry, setJournalEntry] = useState('');
  const [journals, setJournals] = useState([
    { id: 1, date: '2025-01-06', entry: 'Had a great day! Completed most of my habits and felt productive. The meditation session really helped me focus.', mood: 4 },
    { id: 2, date: '2025-01-05', entry: 'Struggled with motivation today. Skipped workout but managed to meditate. Tomorrow will be better.', mood: 2 },
    { id: 3, date: '2025-01-04', entry: 'Excellent day! Hit all my targets and felt amazing. The new morning routine is working well.', mood: 5 }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Great job maintaining your meditation streak!', type: 'success', time: '2 hours ago' },
    { id: 2, message: 'Dr. Smith commented on your journal entry', type: 'info', time: '1 day ago' },
    { id: 3, message: 'Time for your evening water reminder', type: 'reminder', time: '3 hours ago' }
  ]);

  // Mock data for charts
  const moodData = [
    { date: '01/01', mood: 3, habits: 2, energy: 3 },
    { date: '01/02', mood: 4, habits: 3, energy: 4 },
    { date: '01/03', mood: 2, habits: 1, energy: 2 },
    { date: '01/04', mood: 5, habits: 4, energy: 5 },
    { date: '01/05', mood: 2, habits: 2, energy: 2 },
    { date: '01/06', mood: 4, habits: 3, energy: 4 },
    { date: '01/07', mood: 3, habits: 3, energy: 3 }
  ];

  const habitData = [
    { name: 'Water', completed: 6, target: 8, percentage: 75 },
    { name: 'Exercise', completed: 1, target: 1, percentage: 100 },
    { name: 'Sleep', completed: 7, target: 8, percentage: 87 },
    { name: 'Meditation', completed: 1, target: 1, percentage: 100 }
  ];

  const weeklyStats = [
    { name: 'Completed', value: 18, color: '#10b981' },
    { name: 'Remaining', value: 10, color: '#e5e7eb' }
  ];

  // Helper functions
  const updateHabit = (id, completed) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: Math.max(0, Math.min(completed, habit.target)) } : habit
    ));
  };

  const addJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        id: journals.length + 1,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        entry: journalEntry,
        mood: mood
      };
      setJournals([newEntry, ...journals]);
      setJournalEntry('');
      setNotifications([
        { id: Date.now(), message: 'Journal entry saved successfully!', type: 'success', time: 'Just now' },
        ...notifications.slice(0, 2)
      ]);
    }
  };

  const getMoodEmoji = (moodValue) => {
    const emojis = ['😢', '😕', '😐', '😊', '😄'];
    return emojis[moodValue - 1] || '😐';
  };

  const getMoodLabel = (moodValue) => {
    const labels = ['Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];
    return labels[moodValue - 1] || 'Unknown';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return '💬';
      case 'reminder': return '⏰';
      case 'warning': return '⚠️';
      default: return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Navigation
          user={user}
          notifications={notifications}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="transition-all duration-300 min-h-[calc(100vh-200px)]">
          {activeTab === 'dashboard' && (
            <Dashboard
              habits={habits}
              mood={mood}
              getMoodEmoji={getMoodEmoji}
              getMoodLabel={getMoodLabel}
              moodData={moodData}
              weeklyStats={weeklyStats}
              notifications={notifications}
              getNotificationIcon={getNotificationIcon}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'habits' && (
            <HabitsTab habits={habits} updateHabit={updateHabit} />
          )}
          {activeTab === 'mood' && (
            <MoodTab
              mood={mood}
              setMood={setMood}
              getMoodEmoji={getMoodEmoji}
              getMoodLabel={getMoodLabel}
              habitData={habitData}
            />
          )}
          {activeTab === 'journal' && (
            <JournalTab
              journalEntry={journalEntry}
              setJournalEntry={setJournalEntry}
              journals={journals}
              mood={mood}
              getMoodEmoji={getMoodEmoji}
              getMoodLabel={getMoodLabel}
              addJournalEntry={addJournalEntry}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab moodData={moodData} habits={habits} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default WellnessApp;