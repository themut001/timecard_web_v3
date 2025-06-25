import { useMemo } from 'react';

export const useDateUtils = () => {
  const formatters = useMemo(() => ({
    // 日本語形式の日付フォーマット
    formatJapaneseDate: (date: string | Date): string => {
      const d = new Date(date);
      return d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    },

    // 短い日本語形式
    formatShortJapaneseDate: (date: string | Date): string => {
      const d = new Date(date);
      return d.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });
    },

    // 時刻フォーマット
    formatTime: (time: string | Date): string => {
      const d = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : time;
      return d.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    // 日時フォーマット
    formatDateTime: (dateTime: string | Date): string => {
      const d = new Date(dateTime);
      return d.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    // 相対時間フォーマット
    formatRelativeTime: (date: string | Date): string => {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return 'たった今';
      if (diffMinutes < 60) return `${diffMinutes}分前`;
      if (diffHours < 24) return `${diffHours}時間前`;
      if (diffDays < 7) return `${diffDays}日前`;
      
      return formatters.formatJapaneseDate(d);
    },

    // 時間の差分計算（分単位）
    calculateMinutesDiff: (start: string, end: string): number => {
      const startTime = new Date(`1970-01-01T${start}`);
      const endTime = new Date(`1970-01-01T${end}`);
      return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    },

    // 時間の差分計算（時間単位、小数点付き）
    calculateHoursDiff: (start: string, end: string): number => {
      const minutes = formatters.calculateMinutesDiff(start, end);
      return Math.round((minutes / 60) * 10) / 10; // 小数点第1位まで
    },
  }), []);

  const utils = useMemo(() => ({
    // 今日の日付を取得（YYYY-MM-DD形式）
    getTodayString: (): string => {
      return new Date().toISOString().split('T')[0];
    },

    // 現在時刻を取得（HH:MM形式）
    getCurrentTimeString: (): string => {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    },

    // 月の最初と最後の日を取得
    getMonthBounds: (date: Date = new Date()) => {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    },

    // 週末かどうかチェック
    isWeekend: (date: string | Date): boolean => {
      const d = new Date(date);
      const dayOfWeek = d.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // 0 = 日曜日, 6 = 土曜日
    },

    // 今日かどうかチェック
    isToday: (date: string | Date): boolean => {
      const d = new Date(date);
      const today = new Date();
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    },

    // 営業日かどうかチェック（週末を除く）
    isBusinessDay: (date: string | Date): boolean => {
      return !utils.isWeekend(date);
    },
  }), []);

  return {
    ...formatters,
    ...utils,
  };
};