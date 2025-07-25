import React from 'react';
import { Calendar } from 'lucide-react';

const JournalHistory = ({ journals, getMoodEmoji, getMoodLabel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Previous Entries</h2>
      <div className="space-y-6">
        {journals && journals.length > 0 ? (
          journals.map((journal) => (
            <div key={journal.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">{journal.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMoodEmoji(journal.mood)}</span>
                  <span className="text-sm text-gray-600">{getMoodLabel(journal.mood)}</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{journal.content || journal.entry}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No journal entries yet</h3>
            <p className="text-gray-500">Write your first journal entry above to start tracking your thoughts and feelings!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalHistory;