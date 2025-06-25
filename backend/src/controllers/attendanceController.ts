import { Request, Response } from 'express';
import prisma from '../database/client';
import { AuthenticatedRequest, ApiResponse, AttendanceRecord, AttendanceSummary } from '../types';
import { createError } from '../middleware/errorHandler';

export const getTodayAttendance = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord | null>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendanceRecord.findUnique({
    where: {
      userId_date: {
        userId: req.user.id,
        date: today,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: attendance,
  });
};

export const clockIn = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 既に出勤打刻があるかチェック
  const existingAttendance = await prisma.attendanceRecord.findUnique({
    where: {
      userId_date: {
        userId: req.user.id,
        date: today,
      },
    },
  });

  if (existingAttendance && existingAttendance.clockIn) {
    throw createError('既に出勤打刻済みです', 400);
  }

  // 遅刻判定（9:00を基準とする）
  const standardTime = new Date(today);
  standardTime.setHours(9, 0, 0, 0);
  const isLate = now > standardTime;

  // 出勤打刻を作成または更新
  const attendance = await prisma.attendanceRecord.upsert({
    where: {
      userId_date: {
        userId: req.user.id,
        date: today,
      },
    },
    update: {
      clockIn: now,
      status: isLate ? 'LATE' : 'PRESENT',
    },
    create: {
      userId: req.user.id,
      date: today,
      clockIn: now,
      status: isLate ? 'LATE' : 'PRESENT',
    },
  });

  res.status(200).json({
    success: true,
    data: attendance,
    message: `出勤打刻しました${isLate ? '（遅刻）' : ''}`,
  });
};

export const clockOut = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 出勤記録があるかチェック
  const existingAttendance = await prisma.attendanceRecord.findUnique({
    where: {
      userId_date: {
        userId: req.user.id,
        date: today,
      },
    },
  });

  if (!existingAttendance || !existingAttendance.clockIn) {
    throw createError('出勤打刻がされていません', 400);
  }

  if (existingAttendance.clockOut) {
    throw createError('既に退勤打刻済みです', 400);
  }

  // 勤務時間を計算（分単位）
  const workMinutes = Math.floor((now.getTime() - existingAttendance.clockIn.getTime()) / (1000 * 60));
  const breakTime = existingAttendance.breakTime || 60; // デフォルト1時間休憩
  const totalMinutes = Math.max(0, workMinutes - breakTime);
  const totalHours = totalMinutes / 60;

  // 早退判定（18:00を基準とする）
  const standardEndTime = new Date(today);
  standardEndTime.setHours(18, 0, 0, 0);
  const isEarlyLeave = now < standardEndTime && existingAttendance.status !== 'LATE';

  // 退勤打刻を更新
  const attendance = await prisma.attendanceRecord.update({
    where: {
      id: existingAttendance.id,
    },
    data: {
      clockOut: now,
      totalHours,
      status: isEarlyLeave ? 'EARLY_LEAVE' : existingAttendance.status,
    },
  });

  res.status(200).json({
    success: true,
    data: attendance,
    message: `退勤打刻しました${isEarlyLeave ? '（早退）' : ''}`,
  });
};

export const getAttendanceHistory = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord[]>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { month, year } = req.query;
  
  let startDate: Date;
  let endDate: Date;

  if (month && year) {
    startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
  } else {
    // デフォルトで当月
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      userId: req.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    data: attendanceRecords,
  });
};

export const getAttendanceSummary = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceSummary>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { year, month } = req.query;
  
  let startDate: Date;
  let endDate: Date;

  if (year) {
    if (month) {
      startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
    } else {
      startDate = new Date(parseInt(year as string), 0, 1);
      endDate = new Date(parseInt(year as string), 11, 31);
    }
  } else {
    // デフォルトで当月
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      userId: req.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const summary: AttendanceSummary = {
    totalDays: attendanceRecords.length,
    presentDays: attendanceRecords.filter(r => r.status === 'PRESENT').length,
    absentDays: attendanceRecords.filter(r => r.status === 'ABSENT').length,
    lateDays: attendanceRecords.filter(r => r.status === 'LATE').length,
    totalHours: attendanceRecords.reduce((sum, r) => sum + r.totalHours, 0),
    averageHours: attendanceRecords.length > 0 
      ? attendanceRecords.reduce((sum, r) => sum + r.totalHours, 0) / attendanceRecords.length 
      : 0,
  };

  res.status(200).json({
    success: true,
    data: summary,
  });
};