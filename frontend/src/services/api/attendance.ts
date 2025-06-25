import { apiClient } from './base';
import { AttendanceRecord, ApiResponse, PaginatedResponse } from '../../types/common';

export interface AttendanceParams {
  date?: string;
  month?: string;
  limit?: number;
  offset?: number;
}

export interface ClockInResponse {
  record: AttendanceRecord;
  message: string;
}

export interface ClockOutResponse {
  record: AttendanceRecord;
  totalHours: number;
  message: string;
}

export const attendanceApi = {
  getTodayRecord: (): Promise<ApiResponse<AttendanceRecord | null>> => {
    return apiClient.get<AttendanceRecord | null>('/attendance/today');
  },

  clockIn: (): Promise<ApiResponse<ClockInResponse>> => {
    return apiClient.post<ClockInResponse>('/attendance/clock-in');
  },

  clockOut: (): Promise<ApiResponse<ClockOutResponse>> => {
    return apiClient.post<ClockOutResponse>('/attendance/clock-out');
  },

  getRecords: (params?: AttendanceParams): Promise<PaginatedResponse<AttendanceRecord>> => {
    return apiClient.get<AttendanceRecord[]>('/attendance/records', params) as Promise<PaginatedResponse<AttendanceRecord>>;
  },

  getSummary: (month?: string): Promise<ApiResponse<{
    totalHours: number;
    workDays: number;
    avgHours: number;
    presentDays: number;
    lateDays: number;
  }>> => {
    return apiClient.get('/attendance/summary', month ? { month } : undefined);
  },

  updateRecord: (recordId: string, data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> => {
    return apiClient.put<AttendanceRecord>(`/attendance/records/${recordId}`, data);
  },

  deleteRecord: (recordId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/attendance/records/${recordId}`);
  },
};