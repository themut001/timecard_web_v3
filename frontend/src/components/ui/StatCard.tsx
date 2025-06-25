import React from 'react';
import { motion } from 'framer-motion';
import LiquidCard from '../common/LiquidCard';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color,
  index = 0,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <LiquidCard>
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
          {change && (
            <div className={`text-sm ${getChangeColor()}`}>{change}</div>
          )}
        </div>
      </LiquidCard>
    </motion.div>
  );
};

export default StatCard;