import React from 'react';

const InsightsPanel = ({ habits }) => {
  const getInsights = () => {
    const insights = [];
    
    // Find best performing habit
    const bestHabit = habits.reduce((best, current) => 
      (current.completed / current.target) > (best.completed / best.target) ? current : best
    );
    
    // Find longest streak
    const longestStreak = Math.max(...habits.map(h => h.streak));
    const streakHabit = habits.find(h => h.streak === longestStreak);
    
    // Find habits that need attention
    const needsAttention = habits.filter(h => (h.completed / h.target) < 0.5);
    
    // Generate insights
    if (bestHabit.completed >= bestHabit.target) {
      insights.push({
        type: 'success',
        icon: '🏆',
        title: 'Achievement',
        message: `You completed your ${bestHabit.name.toLowerCase()} goal today! Great job!`
      });
    }
    
    if (streakHabit && streakHabit.streak >= 7) {
      insights.push({
        type: 'positive',
        icon: '🎉',
        title: 'Positive Trend',
        message: `Your ${streakHabit.name.toLowerCase()} streak is at ${streakHabit.streak} days! Keep it up!`
      });
    }
    
    if (needsAttention.length > 0) {
      insights.push({
        type: 'improvement',
        icon: '💡',
        title: 'Improvement Area',
        message: `Consider focusing on ${needsAttention[0].name.toLowerCase()} to reach your daily goal consistently.`
      });
    }
    
    // Weekly correlation insight
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Weekly Summary',
      message: 'Your mood correlates positively with habit completion. Consistency is key!'
    });
    
    return insights;
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-green-100 border-green-500 text-green-800';
      case 'positive':
        return 'from-blue-50 to-blue-100 border-blue-500 text-blue-800';
      case 'improvement':
        return 'from-yellow-50 to-yellow-100 border-yellow-500 text-yellow-800';
      case 'info':
        return 'from-purple-50 to-purple-100 border-purple-500 text-purple-800';
      default:
        return 'from-gray-50 to-gray-100 border-gray-500 text-gray-800';
    }
  };

  const insights = getInsights();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Insights & Achievements</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 bg-gradient-to-r ${getInsightColor(insight.type)} rounded-xl border-l-4`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{insight.icon}</span>
              <p className="font-medium">{insight.title}</p>
            </div>
            <p className="text-sm">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;