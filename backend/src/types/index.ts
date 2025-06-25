import { Request } from 'express';

// User types
export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'employee' | 'admin';
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Department types
export interface Department {
  id: string;
  name: string;
  managerId: string;
  createdAt: Date;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  clockIn: Date | null;
  clockOut: Date | null;
  breakTime: number;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
}

// Request types
export interface UserRequest {
  id: string;
  userId: string;
  type: 'leave' | 'overtime' | 'late' | 'early_leave';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt: Date | null;
  approvedBy: string | null;
}

// Tag types (Notion integration)
export interface Tag {
  id: string;
  name: string;
  notionId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Daily report types
export interface DailyReport {
  id: string;
  userId: string;
  date: Date;
  workContent: string;
  notes: string;
  totalHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagEffort {
  id: string;
  dailyReportId: string;
  tagId: string;
  hours: number;
  createdAt: Date;
}

// Auth types
export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Notion integration types
export interface NotionPage {
  id: string;
  properties: {
    [key: string]: any;
  };
}

export interface NotionSyncResult {
  newTags: number;
  updatedTags: number;
  totalSynced: number;
  lastSyncAt: Date;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Database query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

// Form data types
export interface DailyReportForm {
  date: string;
  workContent: string;
  notes: string;
  tagEfforts: {
    tagId: string;
    hours: number;
  }[];
}

export interface EffortSummary {
  tagId: string;
  tagName: string;
  totalHours: number;
  percentage: number;
}