import { apiClient } from './base';
import { DailyReport, DailyReportFormData, EffortSummary, ApiResponse, PaginatedResponse } from '../../types/common';

export interface ReportParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const reportsApi = {
  getDailyReports: (params?: ReportParams): Promise<PaginatedResponse<DailyReport>> => {
    return apiClient.get<DailyReport[]>('/reports/daily', params) as Promise<PaginatedResponse<DailyReport>>;
  },

  getDailyReport: (date: string): Promise<ApiResponse<DailyReport | null>> => {
    return apiClient.get<DailyReport | null>(`/reports/daily/${date}`);
  },

  createDailyReport: (data: DailyReportFormData): Promise<ApiResponse<DailyReport>> => {
    return apiClient.post<DailyReport>('/reports/daily', data);
  },

  updateDailyReport: (reportId: string, data: Partial<DailyReportFormData>): Promise<ApiResponse<DailyReport>> => {
    return apiClient.put<DailyReport>(`/reports/daily/${reportId}`, data);
  },

  deleteDailyReport: (reportId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/reports/daily/${reportId}`);
  },

  getEffortSummary: (params: { startDate: string; endDate: string }): Promise<ApiResponse<EffortSummary[]>> => {
    return apiClient.get<EffortSummary[]>('/reports/effort-summary', params);
  },

  exportReports: (params: ReportParams & { format: 'csv' | 'pdf' }): Promise<Blob> => {
    // Special handling for file downloads
    return fetch(`/api/reports/export?${new URLSearchParams(params).toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error('Export failed');
      }
      return response.blob();
    });
  },
};