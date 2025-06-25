import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../store';
import { login, clearError } from '../store/slices/authSlice';
import LiquidButton from '../components/common/LiquidButton';
import LiquidInput from '../components/common/LiquidInput';
import LiquidCard from '../components/common/LiquidCard';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    // エラーをクリア
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // 入力時にエラーをクリア
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  // 既に認証済みの場合はリダイレクト
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <LiquidCard className="p-8">
          {/* Logo and title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-glass mx-auto mb-6 flex items-center justify-center liquid-float">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              TimeCard Web
            </h1>
            <p className="text-text-muted">
              社内勤怠管理システム
            </p>
          </motion.div>

          {/* Login form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <LiquidInput
              type="email"
              name="email"
              label="メールアドレス"
              placeholder="your-email@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={error && error.includes('メールアドレス') ? error : undefined}
            />

            <LiquidInput
              type="password"
              name="password"
              label="パスワード"
              placeholder="パスワードを入力してください"
              value={formData.password}
              onChange={handleChange}
              required
              error={error && error.includes('パスワード') ? error : undefined}
            />

            {/* Error message */}
            {error && !error.includes('メールアドレス') && !error.includes('パスワード') && (
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

            <LiquidButton
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  ログイン中...
                </div>
              ) : (
                'ログイン'
              )}
            </LiquidButton>
          </motion.form>

          {/* Additional options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200">
              パスワードを忘れた方はこちら
            </button>
          </motion.div>

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 p-4 bg-glass-light rounded-xl border border-white/30"
          >
            <h3 className="text-sm font-medium text-text-primary mb-2">デモ用アカウント</h3>
            <div className="text-xs text-text-muted space-y-1">
              <p><strong>管理者:</strong> admin@company.com / password123</p>
              <p><strong>社員:</strong> user@company.com / password123</p>
            </div>
          </motion.div>
        </LiquidCard>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-muted">
            &copy; 2025 TimeCard Web. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;