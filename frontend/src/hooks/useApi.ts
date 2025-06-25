import { useState, useCallback } from 'react';
import { ApiResponse } from '../types/common';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showLoading?: boolean;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    try {
      if (options.showLoading !== false) {
        setIsLoading(true);
      }
      setError(null);

      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.message || 'エラーが発生しました';
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      if (options.showLoading !== false) {
        setIsLoading(false);
      }
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
};