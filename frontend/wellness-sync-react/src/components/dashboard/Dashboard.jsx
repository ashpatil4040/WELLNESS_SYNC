import React from 'react';
import { Target, Brain, Award } from 'lucide-react';
import StatCard from '../common/StatCard';
import WeeklyProgress from './WeeklyProgress';
import QuickActions from './QuickActions';
import WeeklyCompletion from './WeeklyCompletion';
import NotificationCard from '../common/NotificationCard';
import AIInsights from '../common/AIInsights';

const Dashboard = ({ 
  habits, 
  mood, 
  getMoodEmoji, 
  getMoodLabel, 
  moodData, 
  weeklyStats, 
  notifications, 
  getNotificationIcon, 
  setActiveTab,
  user,
  journals
}) => {
  // Calculate stats with fallbacks for empty/null data
  const completedHabits = habits?.filter(h => h.completed >= h.target).length || 0;
  const totalHabits = habits?.length || 0;
  const maxStreak = habits?.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Today's Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Habits Completed"
              value={totalHabits > 0 ? `${completedHabits}/${totalHabits}` : '0/0'}
              icon={Target}
              gradient="from-blue-500 to-blue-600"
              textColor="text-blue-100"
            />
            <StatCard
              title="Current Mood"
              value={`${getMoodEmoji(mood)} ${getMoodLabel(mood)}`}
              icon={Brain}
              gradient="from-green-500 to-green-600"
              textColor="text-green-100"
            />
            <StatCard
              title="Streak Days"
              value={maxStreak}
              icon={Award}
              gradient="from-purple-500 to-purple-600"
              textColor="text-purple-100"
            />
          </div>
        </div>

        <WeeklyProgress moodData={moodData} />
        
        {/* Tasks to Complete - Moved here */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Tasks to Complete</h2>
          <div className="space-y-3">
            {habits && habits.length > 0 ? (
              habits
                .filter(habit => habit.completed < habit.target)
                .slice(0, 5)
                .map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                        {habit.completed >= habit.target && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{habit.name}</p>
                        <p className="text-xs text-gray-500">
                          {habit.target - habit.completed} remaining
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-blue-600">
                        {habit.completed}/{habit.target}
                      </span>
                      <div className="w-12 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((habit.completed / habit.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 mb-2">No habits yet</p>
                <p className="text-sm text-gray-400">Add some habits to see your daily tasks!</p>
              </div>
            )}
            
            {habits && habits.filter(habit => habit.completed < habit.target).length === 0 && habits.length > 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">All tasks completed!</p>
                <p className="text-xs text-gray-500 mt-1">Great job on finishing your daily goals</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <QuickActions setActiveTab={setActiveTab} />
        <WeeklyCompletion weeklyStats={weeklyStats} />
        
        {/* AI Wellness Insights */}
        <AIInsights 
          habits={habits}
          moodData={moodData}
          journals={journals}
          mood={mood}
        />
      </div>
    </div>
  );
};
export default Dashboard;