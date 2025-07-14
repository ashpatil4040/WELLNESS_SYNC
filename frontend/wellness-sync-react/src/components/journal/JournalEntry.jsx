import React from 'react';
import { Save } from 'lucide-react';

const JournalEntry = ({ 
  journalEntry, 
  setJournalEntry, 
  mood, 
  getMoodEmoji, 
  getMoodLabel, 
  addJournalEntry 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">New Journal Entry</h2>
      <div className="space-y-6">
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write about your day, thoughts, or feelings... What made you happy today? What challenges did you face?"
          className="w-full h-40 p-6 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 leading-relaxed"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Current mood:</span>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{getMoodEmoji(mood)}</span>
              <span className="text-gray-700 font-medium">{getMoodLabel(mood)}</span>
            </div>
          </div>
          <button
            onClick={addJournalEntry}
            disabled={!journalEntry.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">Save Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;