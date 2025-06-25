import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { syncNotionTags, getSyncStatus } from '../../store/slices/tagsSlice';
import LiquidCard from '../common/LiquidCard';
import LiquidButton from '../common/LiquidButton';

const NotionSyncPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { syncResult, isSyncing, error } = useSelector((state: RootState) => state.tags);
  
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  useEffect(() => {
    // 同期ステータスを取得
    dispatch(getSyncStatus());
  }, [dispatch]);

  useEffect(() => {
    if (syncResult?.lastSyncAt) {
      const date = new Date(syncResult.lastSyncAt);
      setLastSyncTime(date.toLocaleString('ja-JP'));
    }
  }, [syncResult]);

  const handleSync = async () => {
    try {
      await dispatch(syncNotionTags()).unwrap();
    } catch (error) {
      // エラーはReduxで管理
    }
  };

  const formatSyncResult = () => {
    if (!syncResult) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-glass-light rounded-xl"
      >
        <h4 className="text-sm font-medium text-text-primary mb-2">前回の同期結果</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{syncResult.newTags}</div>
            <div className="text-text-muted">新規</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{syncResult.updatedTags}</div>
            <div className="text-text-muted">更新</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{syncResult.totalSynced}</div>
            <div className="text-text-muted">合計</div>
          </div>
        </div>
        {lastSyncTime && (
          <p className="text-xs text-text-muted mt-2">
            最終同期: {lastSyncTime}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <LiquidCard>
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Notion連携</h3>
            <p className="text-text-muted">プロジェクトタグの同期管理</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-glass-light rounded-xl">
            <div>
              <h4 className="font-medium text-text-primary">タグ同期</h4>
              <p className="text-sm text-text-muted">
                Notionデータベースからプロジェクトタグを取得
              </p>
            </div>
            <LiquidButton
              onClick={handleSync}
              disabled={isSyncing}
              size="sm"
            >
              {isSyncing ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  同期中...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  同期実行
                </>
              )}
            </LiquidButton>
          </div>

          {formatSyncResult()}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Notion連携について</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Notionデータベースの「物件名」フィールドからタグを自動取得</li>
              <li>• 最大1000件のタグまで同期可能</li>
              <li>• 重複するタグ名は自動的に統合されます</li>
              <li>• 同期後はアルファベット順にソートされます</li>
            </ul>
          </div>
        </div>
      </div>
    </LiquidCard>
  );
};

export default NotionSyncPanel;