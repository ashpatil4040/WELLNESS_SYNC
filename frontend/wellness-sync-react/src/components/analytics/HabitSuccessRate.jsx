import React from 'react';

const HabitSuccessRate = ({ habits }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Habit Success Rate</h3>
      <div className="space-y-6">
        {habits && habits.length > 0 ? (
          habits.map((habit) => (
            <div key={habit.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{habit.icon}</span>
                  <span className="font-medium text-gray-700">{habit.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {Math.round((habit.completed / habit.target) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(habit.completed / habit.target) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{habit.completed} / {habit.target} {habit.unit}</span>
                <span>Streak: {habit.streak} days</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-gray-500">No habits to analyze yet</p>
            <p className="text-sm text-gray-400">Add some habits first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitSuccessRate;