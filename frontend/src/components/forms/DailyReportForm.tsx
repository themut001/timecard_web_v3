import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getDailyReport, saveDailyReport, updateDailyReport } from '../../store/slices/reportsSlice';
import { Tag, DailyReportForm as DailyReportFormData } from '../../types';
import LiquidCard from '../common/LiquidCard';
import LiquidInput from '../common/LiquidInput';
import LiquidButton from '../common/LiquidButton';
import TagSelector from './TagSelector';
import EffortInput from './EffortInput';

interface DailyReportFormProps {
  date: string;
  onSuccess?: () => void;
  className?: string;
}

interface TagEffort {
  tagId: string;
  hours: number;
}

const DailyReportForm: React.FC<DailyReportFormProps> = ({
  date,
  onSuccess,
  className = "",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentReport, isSaving, error } = useSelector((state: RootState) => state.reports);
  const { activeTags } = useSelector((state: RootState) => state.tags);

  const [formData, setFormData] = useState<DailyReportFormData>({
    date,
    workContent: '',
    notes: '',
    tagEfforts: [],
  });

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagEfforts, setTagEfforts] = useState<TagEffort[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 指定された日付の日報を取得
    dispatch(getDailyReport(date));
  }, [dispatch, date]);

  useEffect(() => {
    // 取得した日報データをフォームに設定
    if (currentReport && currentReport.date === date) {
      setFormData({
        date: currentReport.date,
        workContent: currentReport.workContent,
        notes: currentReport.notes || '',
        tagEfforts: currentReport.tagEfforts?.map(effort => ({
          tagId: effort.tagId,
          hours: effort.hours,
        })) || [],
      });

      // 選択されたタグを復元
      const reportTags = currentReport.tagEfforts?.map(effort => effort.tag).filter(Boolean) as Tag[] || [];
      setSelectedTags(reportTags);
      
      // 工数データを復元
      const efforts = currentReport.tagEfforts?.map(effort => ({
        tagId: effort.tagId,
        hours: effort.hours,
      })) || [];
      setTagEfforts(efforts);
      
      setIsEditing(true);
    } else {
      // 新規作成の場合はフォームをリセット
      setFormData({
        date,
        workContent: '',
        notes: '',
        tagEfforts: [],
      });
      setSelectedTags([]);
      setTagEfforts([]);
      setIsEditing(false);
    }
  }, [currentReport, date]);

  const handleInputChange = (field: keyof Pick<DailyReportFormData, 'workContent' | 'notes'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
    setTagEfforts(prev => prev.filter(effort => effort.tagId !== tagId));
  };

  const handleEffortChange = (efforts: TagEffort[]) => {
    setTagEfforts(efforts);
  };

  const getTotalHours = (): number => {
    return tagEfforts.reduce((total, effort) => total + effort.hours, 0);
  };

  const isFormValid = (): boolean => {
    return (
      formData.workContent.trim() !== '' &&
      tagEfforts.length > 0 &&
      getTotalHours() <= 8 &&
      getTotalHours() > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    const submitData: DailyReportFormData = {
      ...formData,
      tagEfforts: tagEfforts,
    };

    try {
      if (isEditing && currentReport) {
        await dispatch(updateDailyReport({ id: currentReport.id, reportData: submitData })).unwrap();
      } else {
        await dispatch(saveDailyReport(submitData)).unwrap();
      }
      
      onSuccess?.();
    } catch (error) {
      // エラーはReduxで管理
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <LiquidCard className={className}>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isEditing ? '日報編集' : '日報作成'}
          </h2>
          <p className="text-text-muted">{formatDate(date)}</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 作業内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-text-primary mb-2">
              作業内容 <span className="text-secondary-500">*</span>
            </label>
            <textarea
              value={formData.workContent}
              onChange={handleInputChange('workContent')}
              placeholder="今日の作業内容を入力してください..."
              rows={4}
              className="glass-input resize-none"
              required
            />
          </motion.div>

          {/* タグ選択 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-text-primary mb-2">
              プロジェクトタグ <span className="text-secondary-500">*</span>
            </label>
            <TagSelector
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
              maxTags={8}
              placeholder="プロジェクトタグを検索..."
            />
          </motion.div>

          {/* 工数入力 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-text-primary mb-2">
              タグ別工数 <span className="text-secondary-500">*</span>
            </label>
            <EffortInput
              tags={selectedTags}
              efforts={tagEfforts}
              onChange={handleEffortChange}
              maxTotal={8}
              showTotal={true}
            />
          </motion.div>

          {/* 特記事項 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-text-primary mb-2">
              特記事項・コメント
            </label>
            <textarea
              value={formData.notes}
              onChange={handleInputChange('notes')}
              placeholder="特記事項やコメントがあれば入力してください..."
              rows={3}
              className="glass-input resize-none"
            />
          </motion.div>

          {/* 送信ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-end space-x-4"
          >
            <LiquidButton
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  date,
                  workContent: '',
                  notes: '',
                  tagEfforts: [],
                });
                setSelectedTags([]);
                setTagEfforts([]);
              }}
              disabled={isSaving}
            >
              リセット
            </LiquidButton>

            <LiquidButton
              type="submit"
              disabled={!isFormValid() || isSaving}
              className="min-w-32"
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  保存中...
                </div>
              ) : isEditing ? (
                '更新'
              ) : (
                '保存'
              )}
            </LiquidButton>
          </motion.div>
        </form>

        {/* フォームヘルプ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 p-4 bg-glass-light rounded-xl"
        >
          <h4 className="text-sm font-medium text-text-primary mb-2">📝 入力のポイント</h4>
          <ul className="text-xs text-text-muted space-y-1">
            <li>• 作業内容は具体的に記録してください</li>
            <li>• プロジェクトタグはNotionと連携しています</li>
            <li>• 工数の合計は8時間以内で入力してください</li>
            <li>• 0.5時間単位での入力が推奨されます</li>
          </ul>
        </motion.div>
      </div>
    </LiquidCard>
  );
};

export default DailyReportForm;