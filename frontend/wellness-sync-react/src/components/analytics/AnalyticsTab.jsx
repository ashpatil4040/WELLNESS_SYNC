import React from 'react';
import WeeklyAnalytics from './WeeklyAnalytics';
import HabitSuccessRate from './HabitSuccessRate';
import InsightsPanel from './InsightsPanel';

const AnalyticsTab = ({ moodData, habits }) => {
  return (
    <div className="space-y-8">
      <WeeklyAnalytics moodData={moodData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HabitSuccessRate habits={habits} />
        <InsightsPanel habits={habits} />
      </div>
    </div>
  );
};

export default AnalyticsTab;