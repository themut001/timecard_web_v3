import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiquidCard from '../common/LiquidCard';
import LiquidButton from '../common/LiquidButton';

interface EffortData {
  tagId: string;
  tagName: string;
  totalHours: number;
  userCount: number;
  entryCount: number;
  percentage: number;
}

interface UserEffortData {
  userId: string;
  userName: string;
  employeeId: string;
  totalHours: number;
  reportDays: number;
}

const EffortAnalytics: React.FC = () => {
  const [effortData, setEffortData] = useState<EffortData[]>([]);
  const [userEffortData, setUserEffortData] = useState<UserEffortData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  });

  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    fetchEffortData();
  }, [selectedPeriod]);

  const fetchEffortData = async () => {
    setIsLoading(true);
    
    // TODO: 実際のAPI呼び出し
    // 現在はダミーデータ
    setTimeout(() => {
      const dummyEffortData: EffortData[] = [
        {
          tagId: '1',
          tagName: 'プロジェクトA',
          totalHours: 120.5,
          userCount: 3,
          entryCount: 15,
          percentage: 45.2,
        },
        {
          tagId: '2',
          tagName: 'プロジェクトB',
          totalHours: 85.0,
          userCount: 2,
          entryCount: 12,
          percentage: 31.8,
        },
        {
          tagId: '3',
          tagName: '内部業務',
          totalHours: 42.5,
          userCount: 4,
          entryCount: 8,
          percentage: 15.9,
        },
        {
          tagId: '4',
          tagName: '研修・学習',
          totalHours: 19.0,
          userCount: 2,
          entryCount: 5,
          percentage: 7.1,
        },
      ];

      const dummyUserData: UserEffortData[] = [
        {
          userId: '1',
          userName: '田中太郎',
          employeeId: 'E001',
          totalHours: 152.0,
          reportDays: 20,
        },
        {
          userId: '2',
          userName: '佐藤花子',
          employeeId: 'E002',
          totalHours: 138.5,
          reportDays: 18,
        },
        {
          userId: '3',
          userName: '鈴木一郎',
          employeeId: 'S001',
          totalHours: 95.5,
          reportDays: 15,
        },
      ];

      setEffortData(dummyEffortData);
      setUserEffortData(dummyUserData);
      setTotalHours(dummyEffortData.reduce((sum, item) => sum + item.totalHours, 0));
      setIsLoading(false);
    }, 1000);
  };

  const handlePeriodChange = (field: 'startDate' | 'endDate') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPeriod(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const formatPeriod = () => {
    const start = new Date(selectedPeriod.startDate);
    const end = new Date(selectedPeriod.endDate);
    return `${start.toLocaleDateString('ja-JP')} 〜 ${end.toLocaleDateString('ja-JP')}`;
  };

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <LiquidCard>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">集計期間</h3>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedPeriod.startDate}
              onChange={handlePeriodChange('startDate')}
              className="glass-input w-auto"
            />
            <span className="text-text-muted">〜</span>
            <input
              type="date"
              value={selectedPeriod.endDate}
              onChange={handlePeriodChange('endDate')}
              className="glass-input w-auto"
            />
            <LiquidButton
              onClick={fetchEffortData}
              disabled={isLoading}
              size="sm"
            >
              更新
            </LiquidButton>
          </div>
        </div>
      </LiquidCard>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LiquidCard>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">総工数</h3>
            <div className="text-3xl font-bold text-text-primary">{totalHours.toFixed(1)}h</div>
            <p className="text-sm text-text-muted">{formatPeriod()}</p>
          </div>
        </LiquidCard>

        <LiquidCard>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">プロジェクト数</h3>
            <div className="text-3xl font-bold text-text-primary">{effortData.length}</div>
            <p className="text-sm text-text-muted">アクティブ</p>
          </div>
        </LiquidCard>

        <LiquidCard>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">参加者数</h3>
            <div className="text-3xl font-bold text-text-primary">{userEffortData.length}</div>
            <p className="text-sm text-text-muted">アクティブユーザー</p>
          </div>
        </LiquidCard>
      </div>

      {/* Project effort breakdown */}
      <LiquidCard>
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-6">プロジェクト別工数分析</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
              />
              <span className="ml-3 text-text-muted">データを読み込み中...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {effortData.map((project, index) => (
                <motion.div
                  key={project.tagId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">{project.tagName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-text-muted">
                        <span>{project.userCount}人参加</span>
                        <span>{project.entryCount}件の記録</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-text-primary">{project.totalHours}h</div>
                      <div className="text-sm text-text-muted">{project.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-4 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-text-muted min-w-12">
                      {project.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </LiquidCard>

      {/* User effort ranking */}
      <LiquidCard>
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-6">ユーザー別工数ランキング</h3>
          
          <div className="space-y-3">
            {userEffortData.map((user, index) => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.userName.charAt(0)}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary">{user.userName}</h4>
                      <p className="text-sm text-text-muted">ID: {user.employeeId}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-text-primary">{user.totalHours}h</div>
                    <div className="text-sm text-text-muted">{user.reportDays}日間</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </LiquidCard>
    </div>
  );
};

export default EffortAnalytics;