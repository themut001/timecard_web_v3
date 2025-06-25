import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Tag, NotionSyncResult, ApiResponse } from '../../types';
import api from '../../services/api';

interface TagsState {
  tags: Tag[];
  activeTags: Tag[];
  syncResult: NotionSyncResult | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  activeTags: [],
  syncResult: null,
  isLoading: false,
  isSyncing: false,
  error: null,
};

// Async thunks
export const getAllTags = createAsyncThunk(
  'tags/getAllTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Tag[]>>('/tags');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'タグの取得に失敗しました');
    }
  }
);

export const getActiveTags = createAsyncThunk(
  'tags/getActiveTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Tag[]>>('/tags/active');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'アクティブタグの取得に失敗しました');
    }
  }
);

export const searchTags = createAsyncThunk(
  'tags/searchTags',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Tag[]>>(`/tags/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'タグの検索に失敗しました');
    }
  }
);

export const syncNotionTags = createAsyncThunk(
  'tags/syncNotionTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<NotionSyncResult>>('/tags/sync');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Notionタグの同期に失敗しました');
    }
  }
);

export const getSyncStatus = createAsyncThunk(
  'tags/getSyncStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<NotionSyncResult>>('/admin/tags/sync-status');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '同期ステータスの取得に失敗しました');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSyncResult: (state) => {
      state.syncResult = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Tags
    builder
      .addCase(getAllTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(getAllTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Active Tags
    builder
      .addCase(getActiveTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActiveTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeTags = action.payload;
      })
      .addCase(getActiveTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Tags
    builder
      .addCase(searchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(searchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sync Notion Tags
    builder
      .addCase(syncNotionTags.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncNotionTags.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.syncResult = action.payload;
      })
      .addCase(syncNotionTags.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });

    // Get Sync Status
    builder
      .addCase(getSyncStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSyncStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.syncResult = action.payload;
      })
      .addCase(getSyncStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSyncResult } = tagsSlice.actions;
export default tagsSlice.reducer;