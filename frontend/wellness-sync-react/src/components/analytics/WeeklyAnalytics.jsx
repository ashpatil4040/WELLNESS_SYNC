import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyAnalytics = ({ moodData }) => {
  // Handle empty data case
  if (!moodData || moodData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Weekly Analytics</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-lg font-medium mb-2">No analytics data yet</p>
          <p className="text-sm text-center">Track your mood and habits for a few days to see detailed analytics here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Weekly Analytics</h2>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} 
            name="Mood" 
          />
          <Line 
            type="monotone" 
            dataKey="habits" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} 
            name="Habits Completed" 
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="#f59e0b" 
            strokeWidth={3} 
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }} 
            name="Energy Level" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyAnalytics;