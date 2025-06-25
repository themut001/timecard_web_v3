/**
 * Application-wide constants and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || '/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Notion Integration
export const NOTION_CONFIG = {
  MAX_SYNC_ITEMS: 1000,
  SYNC_TIMEOUT: 30000, // 30 seconds
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  ANIMATION_DURATION: 300, // milliseconds
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Time and Date
export const TIME_CONFIG = {
  WORK_HOURS_PER_DAY: 8,
  STANDARD_WORK_WEEK: 5,
  BREAK_TIME_DEFAULT: 60, // minutes
  CLOCK_UPDATE_INTERVAL: 1000, // 1 second
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  CONTENT_MAX_LENGTH: 1000,
  TAG_NAME_MAX_LENGTH: 50,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません',
  NOT_FOUND: 'リソースが見つかりません',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  NOTION_SYNC_ERROR: 'Notion同期に失敗しました',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'ログインしました',
  LOGOUT_SUCCESS: 'ログアウトしました',
  SAVE_SUCCESS: '保存しました',
  UPDATE_SUCCESS: '更新しました',
  DELETE_SUCCESS: '削除しました',
  CLOCK_IN_SUCCESS: '出勤打刻しました',
  CLOCK_OUT_SUCCESS: '退勤打刻しました',
  NOTION_SYNC_SUCCESS: 'Notion同期が完了しました',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme_mode',
  LAST_SYNC: 'last_notion_sync',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  ADMIN: '/admin',
  PROFILE: '/profile',
} as const;

// User Roles
export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
} as const;

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EARLY_LEAVE: 'early_leave',
  HOLIDAY: 'holiday',
} as const;

// Request Types
export const REQUEST_TYPES = {
  LEAVE: 'leave',
  OVERTIME: 'overtime',
  LATE: 'late',
  EARLY_LEAVE: 'early_leave',
} as const;

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;