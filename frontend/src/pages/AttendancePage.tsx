import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getTodayAttendance, clockIn, clockOut } from '../store/slices/attendanceSlice';
import LiquidCard from '../components/common/LiquidCard';
import LiquidButton from '../components/common/LiquidButton';

const AttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todayRecord, isClockingIn, isClockingOut, isLoading, error } = useSelector((state: RootState) => state.attendance);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(getTodayAttendance());
    
    // 現在時刻を1秒ごとに更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleClockIn = () => {
    dispatch(clockIn());
  };

  const handleClockOut = () => {
    dispatch(clockOut());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const isWeekend = () => {
    const day = currentTime.getDay();
    return day === 0 || day === 6; // 日曜日または土曜日
  };

  const getWorkingTime = () => {
    if (!todayRecord?.clockIn) return '00:00:00';
    
    const startTime = new Date(todayRecord.clockIn);
    const endTime = todayRecord.clockOut ? new Date(todayRecord.clockOut) : currentTime;
    const diff = endTime.getTime() - startTime.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">勤怠管理</h1>
        <p className="text-text-muted">出退勤の打刻と履歴を管理します。</p>
      </motion.div>

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current time and punch clock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <LiquidCard>
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl font-mono text-text-primary mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-text-muted">
                  {formatDate(currentTime)}
                </div>
                {isWeekend() && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    休日
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {!todayRecord?.clockIn ? (
                  <LiquidButton
                    onClick={handleClockIn}
                    disabled={isClockingIn || isWeekend()}
                    size="lg"
                    className="w-full"
                  >
                    {isClockingIn ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        出勤打刻中...
                      </div>
                    ) : isWeekend() ? (
                      '休日のため打刻できません'
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        出勤打刻
                      </>
                    )}
                  </LiquidButton>
                ) : !todayRecord?.clockOut ? (
                  <LiquidButton
                    onClick={handleClockOut}
                    disabled={isClockingOut}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    {isClockingOut ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        退勤打刻中...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        退勤打刻
                      </>
                    )}
                  </LiquidButton>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-center text-green-700">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      本日の勤務は完了しています
                    </div>
                  </div>
                )}
              </div>
            </div>
          </LiquidCard>
        </motion.div>

        {/* Today's status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LiquidCard>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">今日の勤務状況</h3>
              
              {todayRecord ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-glass-light rounded-xl">
                      <div className="text-sm text-text-muted mb-1">出勤時刻</div>
                      <div className="text-lg font-mono text-text-primary">
                        {todayRecord.clockIn 
                          ? new Date(todayRecord.clockIn).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                          : '--:--'
                        }
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-glass-light rounded-xl">
                      <div className="text-sm text-text-muted mb-1">退勤時刻</div>
                      <div className="text-lg font-mono text-text-primary">
                        {todayRecord.clockOut 
                          ? new Date(todayRecord.clockOut).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                          : '--:--'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-glass-light rounded-xl">
                    <div className="text-sm text-text-muted mb-1">勤務時間</div>
                    <div className="text-2xl font-mono text-text-primary">
                      {todayRecord.clockOut ? `${todayRecord.totalHours.toFixed(1)}時間` : getWorkingTime()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      todayRecord.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                      todayRecord.status === 'LATE' ? 'bg-yellow-100 text-yellow-700' :
                      todayRecord.status === 'EARLY_LEAVE' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {todayRecord.status === 'PRESENT' && '出勤'}
                      {todayRecord.status === 'LATE' && '遅刻'}
                      {todayRecord.status === 'EARLY_LEAVE' && '早退'}
                      {todayRecord.status === 'ABSENT' && '欠勤'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-text-muted">まだ出勤していません</p>
                </div>
              )}
            </div>
          </LiquidCard>
        </motion.div>
      </div>

      {/* Recent attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <LiquidCard>
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">最近の打刻履歴</h3>
            <div className="text-center py-8">
              <p className="text-text-muted">履歴機能は実装予定です</p>
            </div>
          </div>
        </LiquidCard>
      </motion.div>
    </div>
  );
};

export default AttendancePage;