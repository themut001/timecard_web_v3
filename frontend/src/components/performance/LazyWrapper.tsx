import React, { Suspense } from 'react';
import { LoadingSpinner } from '../ui';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  className = ''
}) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingSpinner text="読み込み中..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;