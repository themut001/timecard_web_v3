// Central export point for all API services
export { apiClient, ApiError } from './base';
export { authApi } from './auth';
export { attendanceApi } from './attendance';
export { tagsApi } from './tags';
export { reportsApi } from './reports';

// Re-export types
export type { LoginResponse } from './auth';
export type { AttendanceParams, ClockInResponse, ClockOutResponse } from './attendance';
export type { TagSearchParams } from './tags';
export type { ReportParams } from './reports';