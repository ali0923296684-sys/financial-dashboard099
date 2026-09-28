'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function FinancialCharts({ transactions, accounts }: { transactions: any[]; accounts: any[] }) {
  // حساب إجمالي الأرصدة لكل حساب لعرضها في الرسم الدائري
  const accountPieData = accounts.map((acc, index) => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
    return {
      name: acc.name,
      value: Number(acc.balance),
      color: colors[index % colors.length]
    };
  });

  // تجميع المعاملات الأخيرة لعرض التدفقات (دخل / مصاريف)
  const incomeTotal = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expenseTotal = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const summaryBarData = [
    { name: 'إجمالي العمليات', الدخل: incomeTotal, المصاريف: expenseTotal }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* رسم بياني لمقارنة الدخل والمصاريف من المعاملات الفعلية */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          إجمالي التدفقات النقدية (الحالية)
        </h3>
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryBarData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="الدخل" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="المصاريف" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* رسم بياني دائري لتوزيع الأرصدة عبر الحسابات المصرفية */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          توزيع الأرصدة حسب الحسابات
        </h3>
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accountPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {accountPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}