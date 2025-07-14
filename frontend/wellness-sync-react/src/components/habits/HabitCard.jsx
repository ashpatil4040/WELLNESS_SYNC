import React from 'react';

const HabitCard = ({ habit, updateHabit }) => {
  const progressPercentage = Math.min((habit.completed / habit.target) * 100, 100);
  const isCompleted = habit.completed >= habit.target;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" role="img" aria-label={habit.name}>{habit.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{habit.name}</h3>
            <p className="text-sm text-gray-600">
              Target: {habit.target} {habit.unit} | Streak: {habit.streak} days
            </p>
          </div>
        </div>
        <div 
          className={`w-4 h-4 rounded-full transition-colors ${
            isCompleted ? 'bg-green-500' : 'bg-gray-300'
          }`}
          title={isCompleted ? 'Goal completed!' : 'Goal in progress'}
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{habit.completed}/{habit.target} ({Math.round(progressPercentage)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateHabit(habit.id, habit.completed - 1)}
            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={habit.completed <= 0}
            aria-label="Decrease count"
          >
            -
          </button>
          <input
            type="number"
            min="0"
            max={habit.target}
            value={habit.completed}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              updateHabit(habit.id, Math.max(0, Math.min(value, habit.target)));
            }}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={`${habit.name} count`}
          />
          <button
            onClick={() => updateHabit(habit.id, habit.completed + 1)}
            className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={habit.completed >= habit.target}
            aria-label="Increase count"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">/ {habit.target} {habit.unit}</span>
      </div>
    </div>
  );
};

export default HabitCard;