import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, TrendingUp, Lightbulb } from 'lucide-react';
import aiService from '../../services/aiService';

const AIInsights = ({ habits, moodData, journals, mood }) => {
  const [insights, setInsights] = useState('');
  const [moodInsight, setMoodInsight] = useState('');
  const [habitSuggestions, setHabitSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    generateInsights();
  }, [habits, moodData, journals]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const [personalInsights, moodAnalysis] = await Promise.all([
        aiService.generatePersonalizedInsights({ habits, moodData, journals }),
        aiService.generateMoodInsight(moodData, mood)
      ]);

      setInsights(personalInsights);
      setMoodInsight(moodAnalysis);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    if (habitSuggestions.length > 0) return;
    
    setLoading(true);
    try {
      const suggestions = await aiService.generateHabitSuggestions(habits, 'general wellness');
      setHabitSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'mood', label: 'Mood Analysis', icon: TrendingUp },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI Wellness Coach</h2>
      </div>

      {/* AI Status Notice */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">🟢</span>
          <p className="text-sm text-green-800">
            <strong>AI is now powered by your local Ollama!</strong> Using DeepSeek-R1 model for completely free, 
            private, and unlimited wellness coaching insights.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'suggestions') getSuggestions();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Generating insights...</span>
          </div>
        ) : (
          <>
            {activeTab === 'insights' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-gray-700 leading-relaxed">{insights}</p>
                </div>
                <button
                  onClick={generateInsights}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Refresh Insights</span>
                </button>
              </div>
            )}

            {activeTab === 'mood' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed">{moodInsight}</p>
                </div>
                {moodData && moodData.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {(moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">Avg Mood</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.max(...moodData.map(m => m.mood))}
                      </div>
                      <div className="text-xs text-gray-600">Best Day</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">
                        {moodData.length}
                      </div>
                      <div className="text-xs text-gray-600">Days Tracked</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Here are some AI-generated habit suggestions based on your current progress:
                </p>
                <div className="space-y-3">
                  {habitSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <h4 className="font-semibold text-gray-800">{suggestion.name}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                      <div className="text-xs text-gray-500">
                        Target: {suggestion.target} {suggestion.unit} daily
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
