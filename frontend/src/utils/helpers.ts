/**
 * Utility helper functions for common operations
 */

import { TIME_CONFIG } from './constants';

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted string with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num);
};

/**
 * Format currency in Japanese Yen
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};

/**
 * Calculate percentage with specified decimal places
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Percentage as number
 */
export const calculatePercentage = (value: number, total: number, decimals: number = 1): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function execution
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate a random ID
 * @param length - Length of the ID (default: 8)
 * @returns Random alphanumeric string
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Convert minutes to hours and minutes format
 * @param minutes - Total minutes
 * @returns Formatted string like "2時間30分"
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}分`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  
  return `${hours}時間${remainingMinutes}分`;
};

/**
 * Calculate work hours between two times
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @param breakMinutes - Break time in minutes (default: 60)
 * @returns Work hours as decimal
 */
export const calculateWorkHours = (
  startTime: string,
  endTime: string,
  breakMinutes: number = TIME_CONFIG.BREAK_TIME_DEFAULT
): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  let workMinutes = endTotalMinutes - startTotalMinutes;
  
  // Handle overnight work (crossing midnight)
  if (workMinutes < 0) {
    workMinutes += 24 * 60; // Add 24 hours in minutes
  }
  
  // Subtract break time
  workMinutes -= breakMinutes;
  
  // Convert to hours with one decimal place
  return Math.round((workMinutes / 60) * 10) / 10;
};

/**
 * Check if a date is a weekend
 * @param date - Date string or Date object
 * @returns True if weekend (Saturday or Sunday)
 */
export const isWeekend = (date: string | Date): boolean => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
};

/**
 * Get the start and end dates of a month
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Object with start and end dates
 */
export const getMonthBoundaries = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
};

/**
 * Create a URL-safe slug from text
 * @param text - Text to convert to slug
 * @returns URL-safe slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Check if two arrays are equal (shallow comparison)
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns True if arrays are equal
 */
export const arraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

/**
 * Group array items by a key
 * @param array - Array to group
 * @param keyGetter - Function to get the grouping key
 * @returns Map with grouped items
 */
export const groupBy = <T, K>(
  array: T[],
  keyGetter: (item: T) => K
): Map<K, T[]> => {
  const map = new Map<K, T[]>();
  
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  
  return map;
};

/**
 * Download data as a file
 * @param data - Data to download (string or Blob)
 * @param filename - Name of the file
 * @param mimeType - MIME type (default: 'text/plain')
 */
export const downloadFile = (
  data: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};