import { apiClient } from './base';
import { User, LoginFormData, ApiResponse } from '../../types/common';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authApi = {
  login: (credentials: LoginFormData): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  logout: (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/logout');
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<{ token: string }>('/auth/refresh', { refreshToken });
  },

  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },

  forgotPassword: (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  resetPassword: (token: string, password: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/reset-password', { token, password });
  },
};