import React from 'react';
import { Brain, BookOpen, Target } from 'lucide-react';

const QuickActions = ({ setActiveTab }) => {
  const actions = [
    {
      tab: 'mood',
      label: 'Log Mood',
      icon: Brain,
      gradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      tab: 'journal',
      label: 'Write Journal',
      icon: BookOpen,
      gradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      tab: 'habits',
      label: 'Track Habits',
      icon: Target,
      gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Quick Actions</h2>
      <div className="space-y-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.tab}
              onClick={() => setActiveTab(action.tab)}
              className={`w-full bg-gradient-to-r ${action.gradient} text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;