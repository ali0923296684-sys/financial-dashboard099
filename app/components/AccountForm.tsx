'use client'

import React, { useState } from 'react'
import { PlusCircle, Wallet } from 'lucide-react'

export default function AccountForm({ onSubmit }: { onSubmit: (data: { name: string; balance: string }) => void }) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onSubmit({ name, balance: balance || '0' })
      setName('')
      setBalance('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Wallet className="text-emerald-600" size={20} />
        إضافة حساب جديد
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم الحساب أو المحفظة</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: محفظة الكاش، حساب البنك التجاري..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">الرصيد الابتدائي ($)</label>
          <input
            type="number"
            step="any"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <PlusCircle size={18} />
          <span>{loading ? 'جاري الإضافة...' : 'حفظ وإضافة الحساب'}</span>
        </button>
      </form>
    </div>
  )
}