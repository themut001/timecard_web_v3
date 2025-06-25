import { Request, Response } from 'express';
import prisma from '../database/client';
import { AuthenticatedRequest, ApiResponse, UserResponse, AttendanceRecord, EffortSummary, NotionSyncResult } from '../types';
import { createError } from '../middleware/errorHandler';
import { NotionService } from '../services/notionService';
const notionService = new NotionService();

export const getAllEmployees = async (req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse[]>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const employees = await prisma.user.findMany({
    include: {
      department: true,
    },
    orderBy: {
      employeeId: 'asc',
    },
  });

  const employeeResponses: UserResponse[] = employees.map((emp) => ({
    id: emp.id,
    employeeId: emp.employeeId,
    name: emp.name,
    email: emp.email,
    role: emp.role.toLowerCase() as 'employee' | 'admin',
    departmentId: emp.departmentId,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
  }));

  res.status(200).json({
    success: true,
    data: employeeResponses,
  });
};

export const getAllAttendance = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord[]>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const { date } = req.query;
  
  let targetDate: Date;
  if (date && typeof date === 'string') {
    targetDate = new Date(date);
  } else {
    targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
  }

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      date: targetDate,
    },
    include: {
      user: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          role: true,
          departmentId: true,
        },
      },
    },
    orderBy: {
      user: {
        employeeId: 'asc',
      },
    },
  });

  res.status(200).json({
    success: true,
    data: attendanceRecords,
  });
};

export const updateAttendance = async (req: AuthenticatedRequest, res: Response<ApiResponse<AttendanceRecord>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const { id } = req.params;
  const { clockIn, clockOut, breakTime, status } = req.body;

  const existingRecord = await prisma.attendanceRecord.findUnique({
    where: { id },
  });

  if (!existingRecord) {
    throw createError('勤怠記録が見つかりません', 404);
  }

  // 勤務時間を再計算
  let totalHours = 0;
  if (clockIn && clockOut) {
    const clockInTime = new Date(clockIn);
    const clockOutTime = new Date(clockOut);
    const workMinutes = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60));
    const breakTimeMinutes = breakTime || 0;
    const totalMinutes = Math.max(0, workMinutes - breakTimeMinutes);
    totalHours = totalMinutes / 60;
  }

  const updatedRecord = await prisma.attendanceRecord.update({
    where: { id },
    data: {
      clockIn: clockIn ? new Date(clockIn) : null,
      clockOut: clockOut ? new Date(clockOut) : null,
      breakTime: breakTime || 0,
      totalHours,
      status: status || existingRecord.status,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedRecord,
    message: '勤怠記録を更新しました',
  });
};

export const getMonthlyReports = async (req: AuthenticatedRequest, res: Response<ApiResponse<any>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const { year, month } = req.query;
  
  let startDate: Date;
  let endDate: Date;

  if (year && month) {
    startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
  } else {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  // 部署別勤怠集計
  const departmentSummary = await prisma.$queryRaw`
    SELECT 
      d.name as "departmentName",
      COUNT(DISTINCT ar.user_id) as "employeeCount",
      AVG(ar.total_hours) as "averageHours",
      SUM(ar.total_hours) as "totalHours",
      COUNT(CASE WHEN ar.status = 'LATE' THEN 1 END) as "lateCount",
      COUNT(CASE WHEN ar.status = 'ABSENT' THEN 1 END) as "absentCount"
    FROM departments d
    LEFT JOIN users u ON d.id = u.department_id
    LEFT JOIN attendance_records ar ON u.id = ar.user_id
      AND ar.date >= ${startDate}
      AND ar.date <= ${endDate}
    GROUP BY d.id, d.name
    ORDER BY d.name
  `;

  res.status(200).json({
    success: true,
    data: {
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      departmentSummary,
    },
  });
};

export const getTagEffortsSummary = async (req: AuthenticatedRequest, res: Response<ApiResponse<any>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const { startDate, endDate, userId } = req.query;

  if (!startDate || !endDate) {
    throw createError('開始日と終了日が必要です', 400);
  }

  let userFilter = '';
  let userParams: any[] = [new Date(startDate as string), new Date(endDate as string)];

  if (userId && typeof userId === 'string') {
    userFilter = 'AND dr.user_id = $3';
    userParams.push(userId);
  }

  // タグ別工数集計（全体または特定ユーザー）
  const tagSummary = await prisma.$queryRaw`
    SELECT 
      t.id as "tagId",
      t.name as "tagName",
      COALESCE(SUM(te.hours), 0) as "totalHours",
      COUNT(DISTINCT dr.user_id) as "userCount",
      COUNT(te.id) as "entryCount"
    FROM tags t
    LEFT JOIN tag_efforts te ON t.id = te.tag_id
    LEFT JOIN daily_reports dr ON te.daily_report_id = dr.id
    WHERE t.is_active = true
      AND (dr.date >= $1 OR dr.date IS NULL)
      AND (dr.date <= $2 OR dr.date IS NULL)
      ${userFilter}
    GROUP BY t.id, t.name
    HAVING COALESCE(SUM(te.hours), 0) > 0
    ORDER BY "totalHours" DESC
  ` as any[];

  // ユーザー別工数集計（期間内）
  const userSummary = await prisma.$queryRaw`
    SELECT 
      u.id as "userId",
      u.name as "userName",
      u.employee_id as "employeeId",
      COALESCE(SUM(te.hours), 0) as "totalHours",
      COUNT(DISTINCT dr.date) as "reportDays"
    FROM users u
    LEFT JOIN daily_reports dr ON u.id = dr.user_id
      AND dr.date >= $1
      AND dr.date <= $2
    LEFT JOIN tag_efforts te ON dr.id = te.daily_report_id
    WHERE u.role = 'EMPLOYEE'
      ${userId ? 'AND u.id = $3' : ''}
    GROUP BY u.id, u.name, u.employee_id
    HAVING COALESCE(SUM(te.hours), 0) > 0
    ORDER BY "totalHours" DESC
  ` as any[];

  // 合計時間を計算してパーセンテージを追加
  const totalAllHours = tagSummary.reduce((sum, item) => sum + parseFloat(item.totalHours), 0);

  const tagSummaryWithPercentage = tagSummary.map((item) => ({
    ...item,
    totalHours: parseFloat(item.totalHours),
    percentage: totalAllHours > 0 ? (parseFloat(item.totalHours) / totalAllHours) * 100 : 0,
  }));

  res.status(200).json({
    success: true,
    data: {
      period: {
        startDate: startDate as string,
        endDate: endDate as string,
      },
      tagSummary: tagSummaryWithPercentage,
      userSummary: userSummary.map((item) => ({
        ...item,
        totalHours: parseFloat(item.totalHours),
      })),
      totalHours: totalAllHours,
    },
  });
};

export const getSyncStatus = async (req: AuthenticatedRequest, res: Response<ApiResponse<NotionSyncResult | null>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  const syncSetting = await prisma.setting.findUnique({
    where: { key: 'last_notion_sync' },
  });

  let syncResult: NotionSyncResult | null = null;

  if (syncSetting) {
    try {
      syncResult = JSON.parse(syncSetting.value);
    } catch (error) {
      console.warn('Failed to parse sync result:', error);
    }
  }

  res.status(200).json({
    success: true,
    data: syncResult,
  });
};

export const syncNotionTags = async (req: AuthenticatedRequest, res: Response<ApiResponse<NotionSyncResult>>) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createError('管理者権限が必要です', 403);
  }

  try {
    // Notionからタグデータを取得
    const notionPages = await notionService.getPages();
    
    let newTags = 0;
    let updatedTags = 0;
    let totalSynced = 0;

    for (const page of notionPages) {
      const tagName = notionService.extractTagName(page);
      
      if (!tagName) continue; // 空の物件名はスキップ

      try {
        // 既存のタグをチェック
        const existingTag = await prisma.tag.findUnique({
          where: { notionId: page.id },
        });

        if (existingTag) {
          // 既存タグを更新
          if (existingTag.name !== tagName) {
            await prisma.tag.update({
              where: { id: existingTag.id },
              data: {
                name: tagName,
                updatedAt: new Date(),
              },
            });
            updatedTags++;
          }
        } else {
          // 新しいタグを作成
          await prisma.tag.create({
            data: {
              name: tagName,
              notionId: page.id,
              isActive: true,
            },
          });
          newTags++;
        }

        totalSynced++;
      } catch (error) {
        // 重複エラーなどは無視して続行
        console.warn(`Tag sync error for ${tagName}:`, error);
      }
    }

    const syncResult: NotionSyncResult = {
      newTags,
      updatedTags,
      totalSynced,
      lastSyncAt: new Date(),
    };

    // 同期結果を設定に保存
    await prisma.setting.upsert({
      where: { key: 'last_notion_sync' },
      update: { 
        value: JSON.stringify(syncResult),
        updatedAt: new Date(),
      },
      create: {
        key: 'last_notion_sync',
        value: JSON.stringify(syncResult),
      },
    });

    res.status(200).json({
      success: true,
      data: syncResult,
      message: `Notionタグの同期が完了しました（新規: ${newTags}件、更新: ${updatedTags}件）`,
    });
  } catch (error) {
    console.error('Notion sync error:', error);
    throw createError('Notionタグの同期に失敗しました', 500);
  }
};