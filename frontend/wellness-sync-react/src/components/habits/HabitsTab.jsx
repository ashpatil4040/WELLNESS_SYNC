import React from 'react';
import { Plus } from 'lucide-react';
import HabitCard from './HabitCard';

const HabitsTab = ({ habits, updateHabit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Daily Habits</h2>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            updateHabit={updateHabit}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitsTab;