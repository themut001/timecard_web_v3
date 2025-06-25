import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DailyReport, DailyReportForm, EffortSummary, ApiResponse } from '../../types';
import api from '../../services/api';

interface ReportsState {
  dailyReports: DailyReport[];
  currentReport: DailyReport | null;
  effortSummary: EffortSummary[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  dailyReports: [],
  currentReport: null,
  effortSummary: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

// Async thunks
export const getDailyReport = createAsyncThunk(
  'reports/getDailyReport',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<DailyReport>>(`/reports/daily?date=${date}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '日報の取得に失敗しました');
    }
  }
);

export const saveDailyReport = createAsyncThunk(
  'reports/saveDailyReport',
  async (reportData: DailyReportForm, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<DailyReport>>('/reports/daily', reportData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '日報の保存に失敗しました');
    }
  }
);

export const updateDailyReport = createAsyncThunk(
  'reports/updateDailyReport',
  async ({ id, reportData }: { id: string; reportData: DailyReportForm }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<DailyReport>>(`/reports/daily/${id}`, reportData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '日報の更新に失敗しました');
    }
  }
);

export const getDailyReports = createAsyncThunk(
  'reports/getDailyReports',
  async (params: { startDate?: string; endDate?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<DailyReport[]>>('/reports/daily/list', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '日報一覧の取得に失敗しました');
    }
  }
);

export const getEffortSummary = createAsyncThunk(
  'reports/getEffortSummary',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EffortSummary[]>>('/efforts/summary', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '工数集計の取得に失敗しました');
    }
  }
);

export const getAdminEffortSummary = createAsyncThunk(
  'reports/getAdminEffortSummary',
  async (params: { startDate: string; endDate: string; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EffortSummary[]>>('/admin/tags/efforts', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '管理者工数集計の取得に失敗しました');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearEffortSummary: (state) => {
      state.effortSummary = [];
    },
  },
  extraReducers: (builder) => {
    // Get Daily Report
    builder
      .addCase(getDailyReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDailyReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(getDailyReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Save Daily Report
    builder
      .addCase(saveDailyReport.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveDailyReport.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentReport = action.payload;
        // 既存の日報リストに追加
        const existingIndex = state.dailyReports.findIndex(r => r.date === action.payload.date);
        if (existingIndex >= 0) {
          state.dailyReports[existingIndex] = action.payload;
        } else {
          state.dailyReports.unshift(action.payload);
        }
      })
      .addCase(saveDailyReport.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // Update Daily Report
    builder
      .addCase(updateDailyReport.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateDailyReport.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentReport = action.payload;
        // 既存の日報リストを更新
        const existingIndex = state.dailyReports.findIndex(r => r.id === action.payload.id);
        if (existingIndex >= 0) {
          state.dailyReports[existingIndex] = action.payload;
        }
      })
      .addCase(updateDailyReport.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // Get Daily Reports
    builder
      .addCase(getDailyReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDailyReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyReports = action.payload;
      })
      .addCase(getDailyReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Effort Summary
    builder
      .addCase(getEffortSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEffortSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.effortSummary = action.payload;
      })
      .addCase(getEffortSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Admin Effort Summary
    builder
      .addCase(getAdminEffortSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminEffortSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.effortSummary = action.payload;
      })
      .addCase(getAdminEffortSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReport, clearEffortSummary } = reportsSlice.actions;
export default reportsSlice.reducer;