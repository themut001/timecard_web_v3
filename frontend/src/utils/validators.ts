/**
 * Validation utility functions for form inputs and data validation
 */

import { VALIDATION } from './constants';

/**
 * Email validation using RFC 5322 compliant regex
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'メールアドレスを入力してください';
  }

  if (email.length > VALIDATION.EMAIL_MAX_LENGTH) {
    return `メールアドレスは${VALIDATION.EMAIL_MAX_LENGTH}文字以内で入力してください`;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '有効なメールアドレスを入力してください';
  }

  return null;
};

/**
 * Password validation with various security requirements
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'パスワードを入力してください';
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `パスワードは${VALIDATION.PASSWORD_MIN_LENGTH}文字以上で入力してください`;
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'パスワードには大文字を1文字以上含めてください';
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'パスワードには小文字を1文字以上含めてください';
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'パスワードには数字を1文字以上含めてください';
  }

  return null;
};

/**
 * Name validation
 */
export const validateName = (name: string): string | null => {
  if (!name?.trim()) {
    return '名前を入力してください';
  }

  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return `名前は${VALIDATION.NAME_MAX_LENGTH}文字以内で入力してください`;
  }

  return null;
};

/**
 * Required field validation
 */
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName}を入力してください`;
  }
  return null;
};

/**
 * Time validation (HH:MM format)
 */
export const validateTime = (time: string): string | null => {
  if (!time) {
    return '時刻を入力してください';
  }

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return '正しい時刻形式(HH:MM)で入力してください';
  }

  return null;
};

/**
 * Date validation (YYYY-MM-DD format)
 */
export const validateDate = (date: string): string | null => {
  if (!date) {
    return '日付を入力してください';
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '正しい日付を入力してください';
  }

  return null;
};

/**
 * Hours validation (0-24 range with decimals)
 */
export const validateHours = (hours: number): string | null => {
  if (hours < 0) {
    return '時間は0以上で入力してください';
  }

  if (hours > 24) {
    return '時間は24時間以内で入力してください';
  }

  return null;
};

/**
 * Tag effort validation for daily reports
 */
export const validateTagEfforts = (tagEfforts: Array<{ tagId: string; hours: number }>): string | null => {
  if (!tagEfforts || tagEfforts.length === 0) {
    return '少なくとも1つのタグに工数を入力してください';
  }

  const totalHours = tagEfforts.reduce((sum, effort) => sum + effort.hours, 0);
  
  if (totalHours === 0) {
    return '合計工数は0より大きくする必要があります';
  }

  if (totalHours > TIME_CONFIG.WORK_HOURS_PER_DAY * 1.5) {
    return `1日の工数は${TIME_CONFIG.WORK_HOURS_PER_DAY * 1.5}時間以下にしてください`;
  }

  // Check for duplicate tags
  const tagIds = tagEfforts.map(effort => effort.tagId);
  const uniqueTagIds = new Set(tagIds);
  
  if (tagIds.length !== uniqueTagIds.size) {
    return '同じタグを重複して選択することはできません';
  }

  // Validate individual efforts
  for (const effort of tagEfforts) {
    if (!effort.tagId) {
      return 'タグを選択してください';
    }
    
    const hoursError = validateHours(effort.hours);
    if (hoursError) {
      return hoursError;
    }
    
    if (effort.hours === 0) {
      return '工数は0より大きく入力してください';
    }
  }

  return null;
};

/**
 * Content length validation
 */
export const validateContent = (content: string, fieldName: string): string | null => {
  if (content && content.length > VALIDATION.CONTENT_MAX_LENGTH) {
    return `${fieldName}は${VALIDATION.CONTENT_MAX_LENGTH}文字以内で入力してください`;
  }
  return null;
};

/**
 * Tag name validation
 */
export const validateTagName = (tagName: string): string | null => {
  if (!tagName?.trim()) {
    return 'タグ名を入力してください';
  }

  if (tagName.length > VALIDATION.TAG_NAME_MAX_LENGTH) {
    return `タグ名は${VALIDATION.TAG_NAME_MAX_LENGTH}文字以内で入力してください`;
  }

  // Check for special characters that might cause issues
  if (!/^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s\-_]+$/.test(tagName)) {
    return 'タグ名には英数字、ひらがな、カタカナ、漢字、スペース、ハイフン、アンダースコアのみ使用できます';
  }

  return null;
};

// Import TIME_CONFIG for validation
import { TIME_CONFIG } from './constants';