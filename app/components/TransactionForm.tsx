'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TransactionForm({ accounts, onSubmit }: { accounts: any[]; onSubmit: (data: any) => void }) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [accountId, setAccountId] = useState(accounts[0]?.id || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ amount, type, description, accountId: accountId || accounts[0]?.id })
    setAmount('')
    setDescription('')
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" /> تسجيل معاملة جديدة
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">نوع المعاملة</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="expense">مصروف (سحب)</option>
              <option value="income">إيراد (إيداع)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">المبلغ</label>
            <input 
              type="number" step="0.01" placeholder="0.00" value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">الحساب المستهدف</label>
            <select 
              value={accountId} onChange={(e) => setAccountId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (الرصيد: ${acc.balance})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">الوصف أو الملاحظة</label>
            <input 
              type="text" placeholder="مثال: فاتورة الإنترنت، راتب..." value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
            حفظ المعاملة
          </button>
        </form>
      </div>
    </div>
  )
}