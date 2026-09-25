export default function TransactionList({ transactions }: { transactions: any[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">آخر المعاملات المسجلة</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="pb-3 font-semibold">الوصف</th>
              <th className="pb-3 font-semibold">المبلغ</th>
              <th className="pb-3 font-semibold">النوع</th>
              <th className="pb-3 font-semibold">الحساب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">لا توجد معاملات مسجلة حتى الآن</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 font-medium text-gray-800">{tx.description || 'بدون وصف'}</td>
                  <td className={`py-3.5 font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount}
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'income' ? 'دخل' : 'مصروف'}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-500 font-medium">{tx.accounts?.name || 'حساب'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}