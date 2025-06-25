import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, TokenPayload, ApiResponse } from '../types';
import { createError } from './errorHandler';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw createError('アクセストークンが提供されていません', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = {
      id: decoded.userId,
      employeeId: '', // データベースから取得する必要がある
      name: '',
      email: decoded.email,
      role: decoded.role as 'employee' | 'admin',
      departmentId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    next();
  } catch (error) {
    next(createError('認証に失敗しました', 401));
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('認証が必要です', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('この操作を実行する権限がありません', 403));
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = authorize(['admin']);

// Employee or Admin middleware  
export const requireAuth = authorize(['employee', 'admin']);