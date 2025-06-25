import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// APIのベースURL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axiosインスタンスの作成
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 認証トークンを自動的に追加
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401エラー（認証エラー）の場合の処理
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // リフレッシュトークンを使用して新しいアクセストークンを取得
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data.data;
          localStorage.setItem('token', token);

          // 元のリクエストを再実行
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // リフレッシュトークンも無効な場合はログアウト
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403エラー（権限エラー）の場合
    if (error.response?.status === 403) {
      console.error('アクセス権限がありません');
    }

    // 500エラー（サーバーエラー）の場合
    if (error.response?.status >= 500) {
      console.error('サーバーエラーが発生しました');
    }

    return Promise.reject(error);
  }
);

// エラーハンドリング用のヘルパー関数
export const handleApiError = (error: any): string => {
  if (error.response) {
    // サーバーからのエラーレスポンス
    return error.response.data?.message || 'サーバーエラーが発生しました';
  } else if (error.request) {
    // ネットワークエラー
    return 'ネットワークエラーが発生しました';
  } else {
    // その他のエラー
    return 'エラーが発生しました';
  }
};

// API関数のヘルパー
export const apiHelpers = {
  // GETリクエスト
  get: <T = any>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config),
  
  // POSTリクエスト
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.post<T>(url, data, config),
  
  // PUTリクエスト
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.put<T>(url, data, config),
  
  // DELETEリクエスト
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config),
  
  // PATCHリクエスト
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.patch<T>(url, data, config),
};

export default api;