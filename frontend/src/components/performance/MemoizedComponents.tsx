import React, { memo, useMemo } from 'react';
import { StatCard } from '../ui';

// Memoized StatCard for better performance in lists
export const MemoizedStatCard = memo(StatCard, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.change === nextProps.change &&
    prevProps.changeType === nextProps.changeType &&
    prevProps.icon === nextProps.icon &&
    prevProps.color === nextProps.color
  );
});

// Memoized list component for performance
interface MemoizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
}

export const MemoizedList = memo(<T,>({
  items,
  renderItem,
  keyExtractor,
  className = ''
}: MemoizedListProps<T>) => {
  const memoizedItems = useMemo(() => {
    return items.map((item, index) => ({
      key: keyExtractor(item, index),
      element: renderItem(item, index)
    }));
  }, [items, renderItem, keyExtractor]);

  return (
    <div className={className}>
      {memoizedItems.map(({ key, element }) => (
        <React.Fragment key={key}>
          {element}
        </React.Fragment>
      ))}
    </div>
  );
}) as <T>(props: MemoizedListProps<T>) => JSX.Element;

// Memoized chart wrapper for expensive calculations
interface MemoizedChartProps {
  data: any[];
  type: string;
  options?: any;
  children: React.ReactNode;
}

export const MemoizedChart = memo<MemoizedChartProps>(({ 
  data, 
  type, 
  options, 
  children 
}) => {
  const chartKey = useMemo(() => {
    return `${type}-${JSON.stringify(data)}-${JSON.stringify(options)}`;
  }, [data, type, options]);

  return (
    <div key={chartKey}>
      {children}
    </div>
  );
});

// Memoized form field for better performance in large forms
interface MemoizedFormFieldProps {
  value: any;
  onChange: (value: any) => void;
  children: React.ReactNode;
}

export const MemoizedFormField = memo<MemoizedFormFieldProps>(({
  value,
  onChange,
  children
}) => {
  return <>{children}</>;
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});