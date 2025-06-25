// Re-export all types from common.ts for backward compatibility and centralized type management
export * from './common';

// Legacy support - will be removed in future versions
// @deprecated Use types from './common' instead
export interface LoginForm {
  email: string;
  password: string;
}

// @deprecated Use DailyReportFormData from './common' instead
export interface DailyReportForm {
  date: string;
  workContent: string;
  notes: string;
  tagEfforts: {
    tagId: string;
    hours: number;
  }[];
}

// UI specific types that don't belong in common
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}