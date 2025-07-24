import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';

const HabitsTab = ({ habits, updateHabit, addHabit }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Daily Habits</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits && habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              updateHabit={updateHabit}
            />
          ))}
          {(!habits || habits.length === 0) && (
            <div className="col-span-2 text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Habits Yet</h3>
              <p className="text-gray-500 mb-6">Start building healthy habits by adding your first one!</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Habit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={addHabit}
      />
    </>
  );
};

export default HabitsTab;