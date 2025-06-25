import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard, ActivityFeed, TabNavigation } from '../components/ui';
import NotionSyncPanel from '../components/admin/NotionSyncPanel';
import EmployeeManagement from '../components/admin/EmployeeManagement';
import EffortAnalytics from '../components/admin/EffortAnalytics';
import LiquidCard from '../components/common/LiquidCard';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'analytics' | 'notion'>('overview');

  const tabs = [
    { 
      id: 'overview', 
      label: '概要', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    { 
      id: 'employees', 
      label: '社員管理', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    },
    { 
      id: 'analytics', 
      label: '工数分析', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    { 
      id: 'notion', 
      label: 'Notion連携', 
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
  ];

  const overviewStats = [
    {
      title: '総社員数',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '今月の総工数',
      value: '1,247h',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'アクティブプロジェクト',
      value: '8',
      change: '+1',
      changeType: 'positive' as const,
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '今日の出勤率',
      value: '91.7%',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const recentActivities = [
    { user: '田中太郎', action: '日報を作成しました', time: '5分前', type: 'report' as const },
    { user: '佐藤花子', action: '出勤打刻しました', time: '1時間前', type: 'attendance' as const },
    { user: 'システム', action: 'Notionタグを同期しました', time: '2時間前', type: 'sync' as const },
    { user: '鈴木一郎', action: '有給申請を提出しました', time: '3時間前', type: 'request' as const },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">管理者機能</h1>
        <p className="text-text-muted">社員管理、勤怠管理、Notion連携の管理を行います。</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab as (tabId: string) => void}
        />
      </motion.div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  icon={stat.icon}
                  color={stat.color}
                  index={index}
                />
              ))}
            </div>

            {/* Recent activities */}
            <LiquidCard>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">最近のアクティビティ</h3>
                <ActivityFeed activities={recentActivities} maxItems={4} />
              </div>
            </LiquidCard>
          </div>
        )}

        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'analytics' && <EffortAnalytics />}
        {activeTab === 'notion' && <NotionSyncPanel />}
      </motion.div>
    </div>
  );
};

export default AdminPage;