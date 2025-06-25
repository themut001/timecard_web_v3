import React from 'react';
import { motion } from 'framer-motion';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const LiquidCard: React.FC<LiquidCardProps> = ({
  children,
  className = '',
  hoverable = true,
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <motion.div
      className={`glass-card ${paddingClasses[padding]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default LiquidCard;