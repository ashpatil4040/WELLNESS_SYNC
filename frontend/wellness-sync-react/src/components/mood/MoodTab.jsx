import React from 'react';
import MoodSelector from './MoodSelector';
import MoodChart from './MoodChart';

const MoodTab = ({ mood, setMood, getMoodEmoji, getMoodLabel, habitData }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Mood Tracking</h2>
        
        <MoodSelector 
          mood={mood}
          setMood={setMood}
          getMoodEmoji={getMoodEmoji}
          getMoodLabel={getMoodLabel}
        />
        
        <MoodChart habitData={habitData} />
      </div>
    </div>
  );
};

export default MoodTab;