import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getDailyReports, getEffortSummary } from '../store/slices/reportsSlice';
import LiquidCard from '../components/common/LiquidCard';
import LiquidButton from '../components/common/LiquidButton';
import DailyReportForm from '../components/forms/DailyReportForm';

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dailyReports, effortSummary, isLoading } = useSelector((state: RootState) => state.reports);
  
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'summary'>('create');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    // 最近の日報を取得
    dispatch(getDailyReports({ limit: 10 }));
    
    // 今月の工数集計を取得
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    dispatch(getEffortSummary({ startDate, endDate }));
  }, [dispatch]);

  const handleReportSuccess = () => {
    // 日報保存成功時の処理
    dispatch(getDailyReports({ limit: 10 }));
    
    // 工数集計を更新
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    dispatch(getEffortSummary({ startDate, endDate }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getTotalEffortHours = () => {
    return effortSummary.reduce((total, effort) => total + effort.totalHours, 0);
  };

  const tabs = [
    { id: 'create', label: '日報作成', icon: 'M12 4v16m8-8H4' },
    { id: 'history', label: '履歴', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'summary', label: '工数集計', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">日報・工数管理</h1>
        <p className="text-text-muted">日報の作成とタグ別工数の管理を行います。</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <LiquidCard padding="sm">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-glass-light'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </LiquidCard>
      </motion.div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Date selector */}
            <LiquidCard>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">日報作成日</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass-input w-auto"
                />
              </div>
            </LiquidCard>

            {/* Daily report form */}
            <DailyReportForm
              date={selectedDate}
              onSuccess={handleReportSuccess}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <LiquidCard>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">日報履歴</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
                  />
                  <span className="ml-3 text-text-muted">読み込み中...</span>
                </div>
              ) : dailyReports.length > 0 ? (
                <div className="space-y-4">
                  {dailyReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-card p-4 rounded-xl hover:shadow-glass-light transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDate(report.date);
                        setActiveTab('create');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg font-semibold text-text-primary">
                              {formatDate(report.date)}
                            </span>
                            <span className="text-sm text-text-muted">
                              {report.totalHours}時間
                            </span>
                          </div>
                          <p className="text-text-secondary line-clamp-2">
                            {report.workContent}
                          </p>
                          {report.tagEfforts && report.tagEfforts.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {report.tagEfforts.slice(0, 3).map((effort) => (
                                <span
                                  key={effort.id}
                                  className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs rounded-full"
                                >
                                  {effort.tag?.name} ({effort.hours}h)
                                </span>
                              ))}
                              {report.tagEfforts.length > 3 && (
                                <span className="text-xs text-text-muted">
                                  +{report.tagEfforts.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-text-muted">まだ日報がありません</p>
                </div>
              )}
            </div>
          </LiquidCard>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Summary overview */}
            <LiquidCard>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">今月の工数集計</h3>
                <div className="text-4xl font-bold text-text-primary mb-2">
                  {getTotalEffortHours().toFixed(1)}時間
                </div>
                <p className="text-text-muted">
                  {effortSummary.length}個のプロジェクトに従事
                </p>
              </div>
            </LiquidCard>

            {/* Effort breakdown */}
            <LiquidCard>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">プロジェクト別工数</h3>
                
                {effortSummary.length > 0 ? (
                  <div className="space-y-4">
                    {effortSummary.map((effort, index) => (
                      <motion.div
                        key={effort.tagId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="glass-card p-4 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-text-primary">{effort.tagName}</h4>
                          <span className="text-lg font-semibold text-text-primary">
                            {effort.totalHours.toFixed(1)}時間
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${effort.percentage}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                            />
                          </div>
                          <span className="text-sm text-text-muted min-w-12">
                            {effort.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-text-muted">工数データがありません</p>
                  </div>
                )}
              </div>
            </LiquidCard>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportsPage;