import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from '../../types';
import LiquidInput from '../common/LiquidInput';

interface TagEffort {
  tagId: string;
  hours: number;
}

interface EffortInputProps {
  tags: Tag[];
  efforts: TagEffort[];
  onChange: (efforts: TagEffort[]) => void;
  maxTotal?: number;
  showTotal?: boolean;
  className?: string;
}

const EffortInput: React.FC<EffortInputProps> = ({
  tags,
  efforts,
  onChange,
  maxTotal = 8,
  showTotal = true,
  className = "",
}) => {
  const handleEffortChange = (tagId: string, hours: number) => {
    const newEfforts = efforts.map(effort =>
      effort.tagId === tagId ? { ...effort, hours } : effort
    );
    
    // 新しいタグの場合は追加
    if (!efforts.some(effort => effort.tagId === tagId)) {
      newEfforts.push({ tagId, hours });
    }
    
    // 0時間のものは除外
    const filteredEfforts = newEfforts.filter(effort => effort.hours > 0);
    
    onChange(filteredEfforts);
  };

  const getEffortHours = (tagId: string): number => {
    const effort = efforts.find(e => e.tagId === tagId);
    return effort ? effort.hours : 0;
  };

  const getTotalHours = (): number => {
    return efforts.reduce((total, effort) => total + effort.hours, 0);
  };

  const isOverLimit = (): boolean => {
    return getTotalHours() > maxTotal;
  };

  const getRemainingHours = (): number => {
    return Math.max(0, maxTotal - getTotalHours());
  };

  if (tags.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <p className="text-text-muted">まずタグを選択してください</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Total hours indicator */}
      {showTotal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-4 rounded-xl border-2 transition-colors ${
            isOverLimit() 
              ? 'bg-red-50 border-red-200' 
              : getTotalHours() === maxTotal
              ? 'bg-green-50 border-green-200'
              : 'bg-glass-light border-white/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${
                isOverLimit() ? 'text-red-700' : 'text-text-primary'
              }`}>
                合計工数: {getTotalHours().toFixed(1)}時間
              </h3>
              <p className={`text-sm ${
                isOverLimit() ? 'text-red-600' : 'text-text-muted'
              }`}>
                {isOverLimit() 
                  ? `${maxTotal}時間を超過しています` 
                  : `残り: ${getRemainingHours().toFixed(1)}時間`
                }
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-32 bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((getTotalHours() / maxTotal) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
                className={`h-3 rounded-full transition-colors ${
                  isOverLimit() 
                    ? 'bg-gradient-to-r from-red-400 to-red-600' 
                    : getTotalHours() === maxTotal
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-primary-400 to-secondary-400'
                }`}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Effort inputs */}
      <div className="space-y-4">
        {tags.map((tag, index) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              {/* Tag info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                  <h4 className="font-medium text-text-primary">{tag.name}</h4>
                </div>
                <p className="text-xs text-text-muted mt-1">プロジェクトタグ</p>
              </div>

              {/* Hours input */}
              <div className="w-32">
                <LiquidInput
                  type="number"
                  placeholder="0.0"
                  value={getEffortHours(tag.id).toString()}
                  onChange={(e) => {
                    const hours = parseFloat(e.target.value) || 0;
                    handleEffortChange(tag.id, Math.max(0, Math.min(hours, 24)));
                  }}
                  className="text-center"
                />
                <p className="text-xs text-text-muted text-center mt-1">時間</p>
              </div>

              {/* Quick add buttons */}
              <div className="flex space-x-1">
                {[0.5, 1, 2, 4].map((hours) => (
                  <motion.button
                    key={hours}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const currentHours = getEffortHours(tag.id);
                      handleEffortChange(tag.id, currentHours + hours);
                    }}
                    className="w-8 h-8 text-xs bg-glass-light hover:bg-primary-100 text-text-primary rounded-lg transition-colors"
                  >
                    +{hours}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hours visualization */}
            {getEffortHours(tag.id) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">このタグの工数:</span>
                  <span className="font-medium text-text-primary">
                    {getEffortHours(tag.id).toFixed(1)}時間 
                    ({((getEffortHours(tag.id) / Math.max(getTotalHours(), 1)) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(getEffortHours(tag.id) / Math.max(getTotalHours(), 1)) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Validation messages */}
      {isOverLimit() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">
              工数の合計が{maxTotal}時間を超過しています。調整してください。
            </span>
          </div>
        </motion.div>
      )}

      {getTotalHours() === maxTotal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-700 text-sm">
              工数の合計が{maxTotal}時間になりました。
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EffortInput;