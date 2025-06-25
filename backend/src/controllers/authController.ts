import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/client';
import { AuthenticatedRequest, ApiResponse, LoginRequest, TokenPayload, UserResponse } from '../types';
import { createError } from '../middleware/errorHandler';

export const login = async (req: Request<{}, ApiResponse<{ user: UserResponse; token: string; refreshToken: string }>, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError('メールアドレスとパスワードが必要です', 400);
  }

  // ユーザーを検索
  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true },
  });

  if (!user) {
    throw createError('メールアドレスまたはパスワードが正しくありません', 401);
  }

  // パスワードを確認
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError('メールアドレスまたはパスワードが正しくありません', 401);
  }

  // JWT トークンを生成
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role.toLowerCase(),
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '24h' });
  const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  // ユーザー情報（パスワードハッシュを除く）
  const userResponse: UserResponse = {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase() as 'employee' | 'admin',
    departmentId: user.departmentId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(200).json({
    success: true,
    data: {
      user: userResponse,
      token,
      refreshToken,
    },
    message: 'ログインに成功しました',
  });
};

export const logout = async (req: AuthenticatedRequest, res: Response<ApiResponse<null>>) => {
  // トークンのブラックリスト処理はここで実装可能
  // 現在はクライアント側でトークンを削除するだけ
  
  res.status(200).json({
    success: true,
    data: null,
    message: 'ログアウトしました',
  });
};

export const refreshToken = async (req: Request<{}, ApiResponse<{ token: string }>, { refreshToken: string }>, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('リフレッシュトークンが必要です', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    
    // ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw createError('ユーザーが見つかりません', 404);
    }

    // 新しいアクセストークンを生成
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    };

    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      data: { token: newToken },
      message: 'トークンを更新しました',
    });
  } catch (error) {
    throw createError('無効なリフレッシュトークンです', 401);
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  // データベースから最新のユーザー情報を取得
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { department: true },
  });

  if (!user) {
    throw createError('ユーザーが見つかりません', 404);
  }

  const userResponse: UserResponse = {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase() as 'employee' | 'admin',
    departmentId: user.departmentId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(200).json({
    success: true,
    data: userResponse,
  });
};

export const forgotPassword = async (req: Request<{}, ApiResponse<null>, { email: string }>, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw createError('メールアドレスが必要です', 400);
  }

  // ユーザーを検索
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // セキュリティのため、ユーザーが存在しない場合でも成功レスポンスを返す
    res.status(200).json({
      success: true,
      data: null,
      message: 'パスワードリセットの手順をメールで送信しました',
    });
    return;
  }

  // TODO: パスワードリセットメールの送信処理を実装
  // パスワードリセットトークンの生成と保存
  // メール送信処理

  res.status(200).json({
    success: true,
    data: null,
    message: 'パスワードリセットの手順をメールで送信しました',
  });
};