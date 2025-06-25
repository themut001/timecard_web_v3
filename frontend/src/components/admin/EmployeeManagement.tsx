import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LiquidCard from '../common/LiquidCard';
import LiquidInput from '../common/LiquidInput';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  departmentId: string;
  createdAt: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API呼び出しで社員データを取得
    // 現在はダミーデータ
    setTimeout(() => {
      setEmployees([
        {
          id: '1',
          employeeId: 'A001',
          name: '管理者',
          email: 'admin@company.com',
          role: 'admin',
          departmentId: 'dept_it_001',
          createdAt: '2025-01-01T00:00:00Z',
        },
        {
          id: '2',
          employeeId: 'E001',
          name: '田中太郎',
          email: 'user@company.com',
          role: 'employee',
          departmentId: 'dept_it_001',
          createdAt: '2025-01-01T00:00:00Z',
        },
        {
          id: '3',
          employeeId: 'E002',
          name: '佐藤花子',
          email: 'sato@company.com',
          role: 'employee',
          departmentId: 'dept_it_001',
          createdAt: '2025-01-01T00:00:00Z',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs rounded-full">
        管理者
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs rounded-full">
        社員
      </span>
    );
  };

  return (
    <LiquidCard>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary">社員管理</h3>
              <p className="text-text-muted">社員情報の管理と権限設定</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-text-primary">{employees.length}</div>
            <div className="text-sm text-text-muted">総社員数</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <LiquidInput
            type="search"
            placeholder="社員を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Employee list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
            />
            <span className="ml-3 text-text-muted">読み込み中...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4 rounded-xl hover:shadow-glass-light transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-text-primary">{employee.name}</h4>
                        {getRoleBadge(employee.role)}
                      </div>
                      <p className="text-sm text-text-muted">{employee.email}</p>
                      <p className="text-xs text-text-muted">ID: {employee.employeeId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-text-muted hover:text-primary-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button className="p-2 text-text-muted hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-text-muted">
                  {searchQuery ? '検索条件に一致する社員が見つかりません' : '社員データがありません'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </LiquidCard>
  );
};

export default EmployeeManagement;