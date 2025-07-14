import React from 'react';

const NotificationCard = ({ notification, getNotificationIcon }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
      <div className="flex items-start space-x-3">
        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;