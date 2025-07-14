import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodChart = ({ habitData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Mood vs Habits Correlation</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={habitData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;