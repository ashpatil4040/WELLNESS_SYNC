import React from 'react';
import { Target, Brain, Award } from 'lucide-react';
import StatCard from '../common/StatCard';
import WeeklyProgress from './WeeklyProgress';
import QuickActions from './QuickActions';
import WeeklyCompletion from './WeeklyCompletion';
import NotificationCard from '../common/NotificationCard';

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
  user 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Today's Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Habits Completed"
              value={`${habits.filter(h => h.completed >= h.target).length}/${habits.length}`}
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
              value={Math.max(...habits.map(h => h.streak))}
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
            {habits
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
              ))}
            
            {habits.filter(habit => habit.completed < habit.target).length === 0 && (
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
        
        {/* AI Wellness Assistant */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Wellness Assistant</h2>
              <p className="text-sm opacity-90">Ask me anything about your wellness journey</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">🤖</span>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-2">
                  Hi {user?.name || 'there'}! I see you've completed {habits.filter(h => h.completed >= h.target).length} out of {habits.length} habits today. 
                  {habits.filter(h => h.completed < h.target).length > 0 
                    ? ` You still have ${habits.filter(h => h.completed < h.target).length} tasks to complete. Would you like some motivation?`
                    : ' Amazing work completing all your goals! 🎉'
                  }
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors">
                    💪 Motivation tips
                  </button>
                  <button className="px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors">
                    📊 My progress
                  </button>
                  <button className="px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors">
                    🎯 Set new goals
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Ask me anything about your wellness..."
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <span className="text-xs opacity-75">Powered by AI</span>
            <button className="text-xs underline opacity-75 hover:opacity-100">
              View conversation history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;