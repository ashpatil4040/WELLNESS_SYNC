import React from 'react';

const MoodSelector = ({ mood, setMood, getMoodEmoji, getMoodLabel }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">How are you feeling today?</h3>
      <div className="flex justify-center space-x-4 mb-6">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setMood(value)}
            className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center text-3xl transition-all duration-200 ${
              mood === value
                ? 'border-blue-500 bg-blue-50 transform scale-110 shadow-lg'
                : 'border-gray-300 hover:border-gray-400 hover:transform hover:scale-105'
            }`}
          >
            {getMoodEmoji(value)}
          </button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          Current mood: <span className="text-blue-600">{getMoodLabel(mood)}</span>
        </p>
      </div>
    </div>
  );
};

export default MoodSelector;