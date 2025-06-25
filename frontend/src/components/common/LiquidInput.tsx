import React from 'react';
import { motion } from 'framer-motion';

interface LiquidInputProps {
  type?: 'text' | 'email' | 'password' | 'time' | 'date' | 'search' | 'number';
  placeholder?: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const LiquidInput: React.FC<LiquidInputProps> = ({
  type = 'text',
  placeholder = '',
  label,
  error,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <motion.label
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {label}
          {required && <span className="text-secondary-500 ml-1">*</span>}
        </motion.label>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            glass-input
            ${error ? 'border-red-400 focus:ring-red-500/50 focus:border-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        {type === 'search' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-text-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default LiquidInput;