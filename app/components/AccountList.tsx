'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard, Edit2, Check, X } from 'lucide-react'

export default function AccountList({ accounts, onUpdate }: { accounts: any[]; onUpdate: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newBalance, setNewBalance] = useState('')

  const handleStartEdit = (acc: any) => {
    setEditingId(acc.id)
    setNewBalance(acc.balance.toString())
  }

  const handleSaveEdit = async (id: string) => {
    const parsed = parseFloat(newBalance)
    if (isNaN(parsed)) return

    const { error } = await supabase
      .from('accounts')
      .update({ balance: parsed })
      .eq('id', id)

    if (!error) {
      setEditingId(null)
      onUpdate()
    } else {
      alert('خطأ في تحديث الرصيد: ' + error.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="text-blue-600" size={20} />
        حسابات إلياس المصرفية
      </h3>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">لا توجد حسابات مضافة بعد.</p>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-800">{acc.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">رصيد الحساب المالي</p>
              </div>

              <div className="flex items-center gap-3">
                {editingId === acc.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="w-28 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(acc.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                      title="حفظ"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition"
                      title="إلغاء"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-black text-blue-600 text-lg">${Number(acc.balance).toLocaleString()}</span>
                    <button
                      onClick={() => handleStartEdit(acc)}
                      className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition"
                      title="تعديل الرصيد"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}