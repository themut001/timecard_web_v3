import React from 'react';
import { motion } from 'framer-motion';

interface Activity {
  user: string;
  action: string;
  time: string;
  type: 'report' | 'attendance' | 'sync' | 'request';
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, maxItems = 10 }) => {
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'report':
        return 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'attendance':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'sync':
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
      default:
        return 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z';
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'report':
        return 'bg-blue-100 text-blue-600';
      case 'attendance':
        return 'bg-green-100 text-green-600';
      case 'sync':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-orange-100 text-orange-600';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {displayedActivities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center space-x-4 p-4 bg-glass-light rounded-xl"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActivityIcon(activity.type)} />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-text-primary">
              <span className="font-semibold">{activity.user}</span> {activity.action}
            </p>
            <p className="text-sm text-text-muted">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;