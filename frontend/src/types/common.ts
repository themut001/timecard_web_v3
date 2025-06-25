export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  isActive?: boolean;
}

export interface Employee extends User {
  department?: Department;
  totalWorkHours?: number;
  reportDays?: number;
}

export interface Department extends BaseEntity {
  name: string;
  managerId?: string;
  manager?: User;
}

export interface Tag extends BaseEntity {
  name: string;
  notionId?: string;
  isActive: boolean;
}

export interface AttendanceRecord extends BaseEntity {
  userId: string;
  user?: User;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breakTime?: number;
  totalHours?: number;
  status: AttendanceStatus;
}

export interface DailyReport extends BaseEntity {
  userId: string;
  user?: User;
  date: string;
  workContent: string;
  notes?: string;
  totalHours: number;
  tagEfforts: TagEffort[];
}

export interface TagEffort extends BaseEntity {
  dailyReportId: string;
  dailyReport?: DailyReport;
  tagId: string;
  tag?: Tag;
  hours: number;
}

export interface NotionSyncResult {
  newTags: number;
  updatedTags: number;
  totalSynced: number;
  lastSyncAt: string;
  errors?: string[];
}

export interface EffortSummary {
  tagId: string;
  tagName: string;
  totalHours: number;
  percentage: number;
  userCount?: number;
  entryCount?: number;
}

// Enums
export type UserRole = 'employee' | 'admin';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave' | 'holiday';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestType = 'leave' | 'overtime' | 'late' | 'early_leave';

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface DailyReportFormData {
  date: string;
  workContent: string;
  notes?: string;
  tagEfforts: TagEffortInput[];
}

export interface TagEffortInput {
  tagId: string;
  hours: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState extends LoadingState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AttendanceState extends LoadingState {
  todayRecord: AttendanceRecord | null;
  records: AttendanceRecord[];
  summary: {
    thisMonth: {
      totalHours: number;
      workDays: number;
      avgHours: number;
    };
  };
}

export interface TagsState extends LoadingState {
  tags: Tag[];
  activeTagsOnly: Tag[];
  syncResult: NotionSyncResult | null;
  isSyncing: boolean;
}

export interface ReportsState extends LoadingState {
  dailyReports: DailyReport[];
  effortSummary: EffortSummary[];
  currentReport: DailyReport | null;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;