import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const notFound = (req: Request, res: Response<ApiResponse<null>>) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `ルート ${req.originalUrl} が見つかりません`,
  });
};