import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyProgress = ({ moodData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis domain={[1, 5]} stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} name="Mood" />
          <Line type="monotone" dataKey="habits" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} name="Habits" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProgress;