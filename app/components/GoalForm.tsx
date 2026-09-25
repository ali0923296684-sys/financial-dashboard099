'use client'
import { useState } from 'react'
import { Target } from 'lucide-react'

export default function GoalForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, target })
    setTitle('')
    setTarget('')
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target size={20} className="text-amber-600" /> هدف ادخاري جديد
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">اسم الهدف</label>
            <input 
              type="text" placeholder="مثال: شراء سيارة، جهاز جديد" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">المبلغ المستهدف</label>
            <input 
              type="number" step="0.01" placeholder="1000" value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              required
            />
          </div>

          <button type="submit" className="w-full bg-amber-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-amber-700 transition shadow-lg shadow-amber-500/20 mt-6">
            حفظ الهدف الادخاري
          </button>
        </form>
      </div>
    </div>
  )
}