import React, { useState, useEffect } from 'react';
import Navigation from './common/Navigation';
import Footer from './common/Footer';
import Dashboard from './dashboard/Dashboard';
import HabitsTab from './habits/HabitsTab';
import MoodTab from './mood/MoodTab';
import JournalTab from './journal/JournalTab';
import AnalyticsTab from './analytics/AnalyticsTab';
import LoadingSpinner from './common/LoadingSpinner';
import AuthComponent from './auth/AuthComponent';
import apiService from '../services/api';

const WellnessApp = () => {
  // State management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Data states - using backend data
  const [habits, setHabits] = useState(null);
  const [mood, setMood] = useState(3);
  const [journalEntry, setJournalEntry] = useState('');
  const [journals, setJournals] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to Wellness Sync! 🎉', type: 'success', time: 'Just now' },
    { id: 2, message: 'Start by adding your first habit or mood entry', type: 'info', time: 'Just now' }
  ]);
  const [moodData, setMoodData] = useState([]);

  // Check for existing authentication on app load
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wellness_token');
      
      if (token) {
        // Test if token is valid by trying to get user data
        const userData = await apiService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        await loadUserData();
      }
    } catch (error) {
      console.log('No valid session found, showing login');
      localStorage.removeItem('wellness_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password, name = null) => {
    try {
      setAuthLoading(true);
      setError(null);
      
      let result;
      if (name) {
        // Registration
        result = await apiService.register(name, email, password);
      } else {
        // Login
        result = await apiService.login(email, password);
      }
      
      setUser(result.user);
      setIsAuthenticated(true);
      
      // Load user data after successful authentication
      await loadUserData();
      
      setNotifications([
        { id: Date.now(), message: '✅ Successfully logged in!', type: 'success', time: 'Just now' },
        ...notifications.slice(0, 4)
      ]);
      
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('wellness_token');
    }
  };

  const loadUserData = async () => {
    try {
      console.log('🔄 Loading user data from backend...');
      
      // Load all data in parallel
      const [habitsData, journalsData, moodEntries] = await Promise.all([
        apiService.getHabits().catch(err => { console.error('Habits API error:', err); return []; }),
        apiService.getJournalEntries().catch(err => { console.error('Journal API error:', err); return []; }),
        apiService.getMoodEntries().catch(err => { console.error('Mood API error:', err); return []; })
      ]);

      console.log('📊 Backend data loaded:', { 
        habits: habitsData.length, 
        journals: journalsData.length, 
        moods: moodEntries.length 
      });

      // Always use backend data, even if empty
      setHabits(habitsData);
      setJournals(journalsData);
      
      if (moodEntries.length > 0) {
        setMoodData(moodEntries.map(entry => ({
          date: new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          mood: entry.mood,
          habits: entry.habitsCompleted || 0,
          energy: entry.energy || 3
        })));
        setMood(moodEntries[0].mood);
      } else {
        // Clear mood data if no entries
        setMoodData([]);
        setMood(3); // Default mood
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // API integration functions
  const updateHabit = async (id, completed) => {
    try {
      console.log('🎯 Updating habit progress:', { id, completed });
      const habit = habits.find(h => h.id === id);
      const wasCompleted = habit.completed >= habit.target;
      const nowCompleted = completed >= habit.target;
      
      const updatedHabit = await apiService.updateHabitProgress(id, completed);
      console.log('✅ Habit updated:', updatedHabit);
      
      // Update local state with the response from backend
      setHabits(habits.map(habit =>
        habit.id === id ? { ...habit, completed, streak: updatedHabit.streak || habit.streak } : habit
      ));

      // Add celebration notification if habit goal was just achieved
      if (!wasCompleted && nowCompleted) {
        setNotifications([
          { 
            id: Date.now(), 
            message: `🎉 Great job! You completed "${habit.name}" today!`, 
            type: 'success', 
            time: 'Just now' 
          },
          ...notifications.slice(0, 4)
        ]);
      }
      
    } catch (error) {
      console.error('Error updating habit:', error);
      // Fallback to local update
      setHabits(habits.map(habit =>
        habit.id === id ? { ...habit, completed: Math.max(0, Math.min(completed, habit.target)) } : habit
      ));
    }
  };

  const addHabit = async (habitData) => {
    try {
      console.log('🎯 Creating new habit:', habitData);
      const newHabit = await apiService.createHabit(habitData);
      console.log('✅ Habit created:', newHabit);
      
      // Add to local state - handle null habits
      setHabits(prevHabits => prevHabits ? [...prevHabits, newHabit] : [newHabit]);
      
      // Add success notification
      setNotifications([
        { id: Date.now(), message: `✅ Habit "${habitData.name}" created successfully!`, type: 'success', time: 'Just now' },
        ...notifications.slice(0, 4)
      ]);
      
    } catch (error) {
      console.error('Error creating habit:', error);
      setError(`Failed to create habit: ${error.message}`);
    }
  };

  const addJournalEntry = async () => {
    if (!journalEntry.trim()) return;
    
    try {
      const newEntry = await apiService.createJournalEntry({
        content: journalEntry,
        mood: mood,
        date: new Date().toISOString().split('T')[0]
      });
      
      setJournals([newEntry, ...journals]);
      setJournalEntry('');
      
      // Add success notification
      setNotifications([
        { id: Date.now(), message: 'Journal entry saved successfully!', type: 'success', time: 'Just now' },
        ...notifications.slice(0, 4)
      ]);
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Fallback to local storage
      const newEntry = {
        id: journals.length + 1,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        content: journalEntry,
        mood: mood
      };
      setJournals([newEntry, ...journals]);
      setJournalEntry('');
      setNotifications([
        { id: Date.now(), message: 'Journal entry saved locally!', type: 'success', time: 'Just now' },
        ...notifications.slice(0, 4)
      ]);
    }
  };

  const saveMoodEntry = async (newMood, notes = '') => {
    try {
      console.log('😊 Saving mood entry:', { mood: newMood, notes });
      await apiService.createMoodEntry({
        mood: newMood,
        notes,
        energy: newMood, // Use mood as energy for simplicity
        date: new Date().toISOString().split('T')[0]
      });
      setMood(newMood);
      
      // Add success notification
      setNotifications([
        { id: Date.now(), message: `✅ Mood logged: ${getMoodLabel(newMood)}`, type: 'success', time: 'Just now' },
        ...notifications.slice(0, 4)
      ]);
      
    } catch (error) {
      console.error('Error saving mood:', error);
      // Fallback to local update
      setMood(newMood);
    }
  };

  // Helper functions for display
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

  // Derived data for charts and stats
  const habitData = habits ? habits.map(habit => ({
    name: habit.name,
    completed: habit.completed,
    target: habit.target,
    percentage: Math.round((habit.completed / habit.target) * 100)
  })) : [];

  const weeklyStats = habits ? [
    { name: 'Completed', value: habits.filter(h => h.completed >= h.target).length * 7, color: '#10b981' },
    { name: 'Remaining', value: habits.filter(h => h.completed < h.target).length * 7, color: '#e5e7eb' }
  ] : [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your wellness data..." />
      </div>
    );
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <AuthComponent
        onLogin={handleLogin}
        loading={authLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Navigation
          user={user}
          notifications={notifications}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
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
              user={user}
              journals={journals}
            />
          )}
          {activeTab === 'habits' && (
            <HabitsTab habits={habits} updateHabit={updateHabit} addHabit={addHabit} />
          )}
          {activeTab === 'mood' && (
            <MoodTab
              mood={mood}
              setMood={saveMoodEntry}
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