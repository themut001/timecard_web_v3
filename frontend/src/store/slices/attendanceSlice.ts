import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AttendanceRecord, AttendanceSummary, ApiResponse } from '../../types';
import api from '../../services/api';

interface AttendanceState {
  todayRecord: AttendanceRecord | null;
  records: AttendanceRecord[];
  summary: AttendanceSummary | null;
  isLoading: boolean;
  isClockingIn: boolean;
  isClockingOut: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  todayRecord: null,
  records: [],
  summary: null,
  isLoading: false,
  isClockingIn: false,
  isClockingOut: false,
  error: null,
};

// Async thunks
export const getTodayAttendance = createAsyncThunk(
  'attendance/getTodayAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<AttendanceRecord>>('/attendance/today');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '今日の勤怠情報の取得に失敗しました');
    }
  }
);

export const clockIn = createAsyncThunk(
  'attendance/clockIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-in');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '出勤打刻に失敗しました');
    }
  }
);

export const clockOut = createAsyncThunk(
  'attendance/clockOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-out');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '退勤打刻に失敗しました');
    }
  }
);

export const getAttendanceHistory = createAsyncThunk(
  'attendance/getAttendanceHistory',
  async (params: { month?: string; year?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<AttendanceRecord[]>>('/attendance/history', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '勤怠履歴の取得に失敗しました');
    }
  }
);

export const getAttendanceSummary = createAsyncThunk(
  'attendance/getAttendanceSummary',
  async (params: { year: string; month?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<AttendanceSummary>>('/attendance/summary', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '勤怠集計の取得に失敗しました');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRecords: (state) => {
      state.records = [];
    },
  },
  extraReducers: (builder) => {
    // Get Today Attendance
    builder
      .addCase(getTodayAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayRecord = action.payload;
      })
      .addCase(getTodayAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clock In
    builder
      .addCase(clockIn.pending, (state) => {
        state.isClockingIn = true;
        state.error = null;
      })
      .addCase(clockIn.fulfilled, (state, action) => {
        state.isClockingIn = false;
        state.todayRecord = action.payload;
      })
      .addCase(clockIn.rejected, (state, action) => {
        state.isClockingIn = false;
        state.error = action.payload as string;
      });

    // Clock Out
    builder
      .addCase(clockOut.pending, (state) => {
        state.isClockingOut = true;
        state.error = null;
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        state.isClockingOut = false;
        state.todayRecord = action.payload;
      })
      .addCase(clockOut.rejected, (state, action) => {
        state.isClockingOut = false;
        state.error = action.payload as string;
      });

    // Get Attendance History
    builder
      .addCase(getAttendanceHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(getAttendanceHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Attendance Summary
    builder
      .addCase(getAttendanceSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(getAttendanceSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearRecords } = attendanceSlice.actions;
export default attendanceSlice.reducer;