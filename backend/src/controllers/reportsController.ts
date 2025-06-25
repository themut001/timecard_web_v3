import { Request, Response } from 'express';
import prisma from '../database/client';
import { AuthenticatedRequest, ApiResponse, DailyReport, DailyReportForm, EffortSummary } from '../types';
import { createError } from '../middleware/errorHandler';

export const getDailyReport = async (req: AuthenticatedRequest, res: Response<ApiResponse<DailyReport | null>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { date } = req.query;
  
  if (!date || typeof date !== 'string') {
    throw createError('日付が必要です', 400);
  }

  const reportDate = new Date(date);
  
  const report = await prisma.dailyReport.findUnique({
    where: {
      userId_date: {
        userId: req.user.id,
        date: reportDate,
      },
    },
    include: {
      tagEfforts: {
        include: {
          tag: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: report,
  });
};

export const saveDailyReport = async (req: AuthenticatedRequest, res: Response<ApiResponse<DailyReport>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { date, workContent, notes, tagEfforts }: DailyReportForm = req.body;

  if (!date || !workContent) {
    throw createError('日付と作業内容は必須です', 400);
  }

  // 工数の合計を計算
  const totalHours = tagEfforts.reduce((sum, effort) => sum + effort.hours, 0);

  // バリデーション: 合計8時間以内
  if (totalHours > 8) {
    throw createError('工数の合計は8時間以内で入力してください', 400);
  }

  const reportDate = new Date(date);

  try {
    // トランザクションで日報とタグ工数を保存
    const result = await prisma.$transaction(async (tx) => {
      // 日報を作成
      const report = await tx.dailyReport.create({
        data: {
          userId: req.user!.id,
          date: reportDate,
          workContent,
          notes: notes || '',
          totalHours,
        },
      });

      // タグ工数を作成
      if (tagEfforts && tagEfforts.length > 0) {
        await tx.tagEffort.createMany({
          data: tagEfforts.map((effort) => ({
            dailyReportId: report.id,
            tagId: effort.tagId,
            hours: effort.hours,
          })),
        });
      }

      // 作成された日報とタグ工数を取得
      return await tx.dailyReport.findUnique({
        where: { id: report.id },
        include: {
          tagEfforts: {
            include: {
              tag: true,
            },
          },
        },
      });
    });

    res.status(201).json({
      success: true,
      data: result!,
      message: '日報を保存しました',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError('指定した日付の日報は既に存在します', 400);
    }
    throw error;
  }
};

export const updateDailyReport = async (req: AuthenticatedRequest, res: Response<ApiResponse<DailyReport>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { id } = req.params;
  const { date, workContent, notes, tagEfforts }: DailyReportForm = req.body;

  if (!workContent) {
    throw createError('作業内容は必須です', 400);
  }

  // 工数の合計を計算
  const totalHours = tagEfforts.reduce((sum, effort) => sum + effort.hours, 0);

  // バリデーション: 合計8時間以内
  if (totalHours > 8) {
    throw createError('工数の合計は8時間以内で入力してください', 400);
  }

  // 日報が存在し、自分のものかチェック
  const existingReport = await prisma.dailyReport.findUnique({
    where: { id },
  });

  if (!existingReport) {
    throw createError('日報が見つかりません', 404);
  }

  if (existingReport.userId !== req.user.id) {
    throw createError('この日報を編集する権限がありません', 403);
  }

  try {
    // トランザクションで日報とタグ工数を更新
    const result = await prisma.$transaction(async (tx) => {
      // 既存のタグ工数を削除
      await tx.tagEffort.deleteMany({
        where: { dailyReportId: id },
      });

      // 日報を更新
      const report = await tx.dailyReport.update({
        where: { id },
        data: {
          workContent,
          notes: notes || '',
          totalHours,
        },
      });

      // 新しいタグ工数を作成
      if (tagEfforts && tagEfforts.length > 0) {
        await tx.tagEffort.createMany({
          data: tagEfforts.map((effort) => ({
            dailyReportId: report.id,
            tagId: effort.tagId,
            hours: effort.hours,
          })),
        });
      }

      // 更新された日報とタグ工数を取得
      return await tx.dailyReport.findUnique({
        where: { id: report.id },
        include: {
          tagEfforts: {
            include: {
              tag: true,
            },
          },
        },
      });
    });

    res.status(200).json({
      success: true,
      data: result!,
      message: '日報を更新しました',
    });
  } catch (error) {
    throw error;
  }
};

export const getDailyReports = async (req: AuthenticatedRequest, res: Response<ApiResponse<DailyReport[]>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { startDate, endDate, limit = '30' } = req.query;

  let dateFilter: any = {};

  if (startDate && endDate) {
    dateFilter = {
      date: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };
  }

  const reports = await prisma.dailyReport.findMany({
    where: {
      userId: req.user.id,
      ...dateFilter,
    },
    include: {
      tagEfforts: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: parseInt(limit as string),
  });

  res.status(200).json({
    success: true,
    data: reports,
  });
};

export const getEffortSummary = async (req: AuthenticatedRequest, res: Response<ApiResponse<EffortSummary[]>>) => {
  if (!req.user) {
    throw createError('認証が必要です', 401);
  }

  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw createError('開始日と終了日が必要です', 400);
  }

  // タグ別工数集計をSQLで実行
  const result = await prisma.$queryRaw`
    SELECT 
      t.id as "tagId",
      t.name as "tagName",
      COALESCE(SUM(te.hours), 0) as "totalHours"
    FROM tags t
    LEFT JOIN tag_efforts te ON t.id = te.tag_id
    LEFT JOIN daily_reports dr ON te.daily_report_id = dr.id
    WHERE t.is_active = true
      AND (dr.user_id = ${req.user.id} OR dr.user_id IS NULL)
      AND (dr.date >= ${new Date(startDate as string)} OR dr.date IS NULL)
      AND (dr.date <= ${new Date(endDate as string)} OR dr.date IS NULL)
    GROUP BY t.id, t.name
    HAVING COALESCE(SUM(te.hours), 0) > 0
    ORDER BY "totalHours" DESC
  ` as any[];

  // 合計時間を計算
  const totalAllHours = result.reduce((sum, item) => sum + parseFloat(item.totalHours), 0);

  // パーセンテージを計算
  const effortSummary: EffortSummary[] = result.map((item) => ({
    tagId: item.tagId,
    tagName: item.tagName,
    totalHours: parseFloat(item.totalHours),
    percentage: totalAllHours > 0 ? (parseFloat(item.totalHours) / totalAllHours) * 100 : 0,
  }));

  res.status(200).json({
    success: true,
    data: effortSummary,
  });
};