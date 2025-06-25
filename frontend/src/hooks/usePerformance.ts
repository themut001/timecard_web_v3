import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    // Only log if render time is significant (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }

    // Store metrics for analytics
    if (process.env.NODE_ENV === 'development') {
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now(),
      };
      
      // Could send to analytics service
      console.log('Performance Metrics:', metrics);
    }
  });

  const measureFunction = useCallback(<T extends any[], R>(
    fn: (...args: T) => R,
    functionName: string
  ) => {
    return (...args: T): R => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (end - start > 5) {
        console.warn(`Slow function: ${functionName} took ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    };
  }, []);

  return { measureFunction };
};

// Higher-order component for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const WithPerformanceMonitoring = (props: P) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name;
    usePerformance(name);
    
    return <WrappedComponent {...props} />;
  };

  WithPerformanceMonitoring.displayName = `withPerformanceMonitoring(${name})`;
  
  return WithPerformanceMonitoring;
};