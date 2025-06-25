import { apiClient } from './base';
import { Tag, NotionSyncResult, ApiResponse } from '../../types/common';

export interface TagSearchParams {
  q?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export const tagsApi = {
  getTags: (params?: TagSearchParams): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get<Tag[]>('/tags', params);
  },

  getActiveTags: (): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get<Tag[]>('/tags/active');
  },

  searchTags: (query: string): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get<Tag[]>('/tags/search', { q: query });
  },

  createTag: (data: { name: string; notionId?: string }): Promise<ApiResponse<Tag>> => {
    return apiClient.post<Tag>('/tags', data);
  },

  updateTag: (tagId: string, data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
    return apiClient.put<Tag>(`/tags/${tagId}`, data);
  },

  deleteTag: (tagId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/tags/${tagId}`);
  },

  syncWithNotion: (): Promise<ApiResponse<NotionSyncResult>> => {
    return apiClient.post<NotionSyncResult>('/tags/sync');
  },

  getSyncStatus: (): Promise<ApiResponse<NotionSyncResult | null>> => {
    return apiClient.get<NotionSyncResult | null>('/tags/sync-status');
  },
};