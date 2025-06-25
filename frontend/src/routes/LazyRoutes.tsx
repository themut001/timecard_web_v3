import { lazy } from 'react';

// Lazy load page components for better initial load performance
export const LazyDashboard = lazy(() => import('../pages/DashboardPage'));
export const LazyAttendance = lazy(() => import('../pages/AttendancePage'));
export const LazyReports = lazy(() => import('../pages/ReportsPage'));
export const LazyAdmin = lazy(() => import('../pages/AdminPage'));
export const LazyLogin = lazy(() => import('../pages/LoginPage'));

// Lazy load admin components
export const LazyNotionSyncPanel = lazy(() => import('../components/admin/NotionSyncPanel'));
export const LazyEmployeeManagement = lazy(() => import('../components/admin/EmployeeManagement'));
export const LazyEffortAnalytics = lazy(() => import('../components/admin/EffortAnalytics'));

// Lazy load form components
export const LazyDailyReportForm = lazy(() => import('../components/forms/DailyReportForm'));
export const LazyTagSelector = lazy(() => import('../components/forms/TagSelector'));
export const LazyEffortInput = lazy(() => import('../components/forms/EffortInput'));