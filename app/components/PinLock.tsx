'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function PinLock({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // كلمة السر الافتراضية (يمكنك تغييرها لأي رمز سري تفضله، مثلاً "1234")
  const CORRECT_PIN = '12120'; 

  useEffect(() => {
    // التحقق هل تم تسجيل الدخول مسبقاً في هذا المتصفح
    const auth = localStorage.getItem('financial_dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      localStorage.setItem('financial_dashboard_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4" dir="rtl">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">منطقة محمية</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            الرجاء إدخال رمز المرور السري للوصول إلى لوحة التحكم المالي.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="أدخل رمز المرور 000000)"
              className="w-full px-4 py-3 text-center tracking-widest text-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 dark:text-white"
              autoFocus
            />

            {error && (
              <p className="text-xs text-rose-500 font-semibold">
                رمز المرور غير صحيح، حاول مرة أخرى.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              <span>دخول للوحة التحكم</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}