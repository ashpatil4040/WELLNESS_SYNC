import React from 'react';

const StatCard = ({ title, value, icon: Icon, gradient, textColor }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold ${textColor}`}>{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${textColor}`} />
      </div>
    </div>
  );
};

export default StatCard;