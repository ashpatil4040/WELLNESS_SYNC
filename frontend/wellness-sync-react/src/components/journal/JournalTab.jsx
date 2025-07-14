import React from 'react';
import JournalEntry from './JournalEntry';
import JournalHistory from './JournalHistory';

const JournalTab = ({ 
  journalEntry, 
  setJournalEntry, 
  journals, 
  mood, 
  getMoodEmoji, 
  getMoodLabel, 
  addJournalEntry 
}) => {
  return (
    <div className="space-y-8">
      <JournalEntry
        journalEntry={journalEntry}
        setJournalEntry={setJournalEntry}
        mood={mood}
        getMoodEmoji={getMoodEmoji}
        getMoodLabel={getMoodLabel}
        addJournalEntry={addJournalEntry}
      />
      
      <JournalHistory
        journals={journals}
        getMoodEmoji={getMoodEmoji}
        getMoodLabel={getMoodLabel}
      />
    </div>
  );
};

export default JournalTab;