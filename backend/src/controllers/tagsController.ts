import { Request, Response } from 'express';
import prisma from '../database/client';
import { AuthenticatedRequest, ApiResponse, Tag, NotionSyncResult } from '../types';
import { createError } from '../middleware/errorHandler';
import { NotionService } from '../services/notionService';
const notionService = new NotionService();

export const getAllTags = async (req: AuthenticatedRequest, res: Response<ApiResponse<Tag[]>>) => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: tags,
  });
};

export const getActiveTags = async (req: AuthenticatedRequest, res: Response<ApiResponse<Tag[]>>) => {
  const tags = await prisma.tag.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: tags,
  });
};

export const searchTags = async (req: Request, res: Response<ApiResponse<Tag[]>>) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    throw createError('検索クエリが必要です', 400);
  }

  const tags = await prisma.tag.findMany({
    where: {
      AND: [
        {
          isActive: true,
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      name: 'asc',
    },
    take: 50, // 最大50件
  });

  res.status(200).json({
    success: true,
    data: tags,
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