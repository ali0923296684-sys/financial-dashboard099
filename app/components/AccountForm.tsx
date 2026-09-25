'use client'
import { useState } from 'react'
import { CreditCard } from 'lucide-react'

export default function AccountForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, balance })
    setName('')
    setBalance('')
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-emerald-600" /> إضافة حساب / محفظة
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">اسم الحساب</label>
            <input 
              type="text" placeholder="مثال: البنك التجاري، كاش" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">الرصيد الابتدائي</label>
            <input 
              type="number" step="0.01" placeholder="0.00" value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 mt-6">
            إنشاء الحساب
          </button>
        </form>
      </div>
    </div>
  )
}