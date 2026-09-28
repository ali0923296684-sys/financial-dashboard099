'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Users, ArrowRightLeft, Plus, DollarSign, Calendar, ShieldCheck, Lock } from 'lucide-react'

// إجبار الصفحة على العمل بشكل ديناميكي لتجنب مشاكل البناء مع أسطر العميل
export const dynamic = 'force-dynamic'

export default function SharedDashboard() {
  const params = useParams()
  // الرابط سيكون مثلاً /shared/elias-and-maryem
  const usersParam = typeof params.users === 'string' ? params.users : ''
  const usersList = usersParam.split('-and-') // تقسيم الأسماء (مثال: elias, maryem)
  
  const user1 = usersList[0] || 'شخص 1'
  const user2 = usersList[1] || 'شخص 2'

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // نموذج إضافة معاملة جديدة بين الطرفين
  const [amount, setAmount] = useState('')
  const [sender, setSender] = useState(user1)
  const [description, setDescription] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '1234') {
      setIsAuthenticated(true)
      localStorage.setItem(`auth_shared_${usersParam}`, 'true')
    } else {
      setError(true)
      setPin('')
    }
  }

  useEffect(() => {
    if (localStorage.getItem(`auth_shared_${usersParam}`) === 'true') {
      setIsAuthenticated(true)
    }
  }, [usersParam])

  // جلب المعاملات المشتركة التي طرفاها هما الشخصان فقط
  const fetchSharedTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shared_transactions')
        .select('*')
        .or(`and(sender.eq.${user1},receiver.eq.${user2}),and(sender.eq.${user2},receiver.eq.${user1})`)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setTransactions(data)
    } catch (err) {
      console.error('Error fetching shared transactions:', err)
    } finally {
      setLoading(false)
    }
  }, [user1, user2])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSharedTransactions()
    }
  }, [isAuthenticated, fetchSharedTransactions])

  // إضافة معاملة جديدة
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    // تحديد الطرف الآخر كـ receiver تلقائياً
    const receiver = sender === user1 ? user2 : user1

    try {
      const { error } = await supabase.from('shared_transactions').insert([
        {
          sender,
          receiver,
          amount: parseFloat(amount),
          description: description || 'تسوية / مصاريف مشتركة'
        }
      ])

      if (error) throw error

      setAmount('')
      setDescription('')
      fetchSharedTransactions()
    } catch (err) {
      console.error('Error adding transaction:', err)
    }
  }

  // حساب الصافي (من له ومن عليه بين الشخصين)
  const calculateBalance = () => {
    let balanceUser1 = 0 // كم دفع أو أعطى user1 لـ user2
    let balanceUser2 = 0 // كم دفع أو أعطى user2 لـ user1

    transactions.forEach((tx) => {
      if (tx.sender === user1) {
        balanceUser1 += Number(tx.amount)
      } else if (tx.sender === user2) {
        balanceUser2 += Number(tx.amount)
      }
    })

    const diff = balanceUser1 - balanceUser2
    return {
      user1Total: balanceUser1,
      user2Total: balanceUser2,
      netDifference: Math.abs(diff),
      creditor: diff > 0 ? user2 : user1, // من له المبلغ
      debtor: diff > 0 ? user1 : user2    // على من المبلغ
    }
  }

  const stats = calculateBalance()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4" dir="rtl">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">لوحة المعاملات المشتركة</h2>
          <p className="text-sm text-gray-400 mb-6">بين: <span className="text-emerald-500 font-bold">{user1}</span> و <span className="text-emerald-500 font-bold">{user2}</span></p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="أدخل رمز المرور"
              className="w-full px-4 py-3 text-center tracking-widest text-xl bg-gray-900 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              autoFocus
            />
            {error && <p className="text-xs text-rose-500 font-semibold">رمز المرور غير صحيح.</p>}
            <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
              <ShieldCheck size={18} />
              <span>دخول اللوحة المشتركة</span>
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
              <Users size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">المعاملات المشتركة</h1>
              <p className="text-sm text-gray-500 mt-0.5">الحسابات والديون بين <span className="font-bold text-emerald-600">{user1}</span> و <span className="font-bold text-emerald-600">{user2}</span></p>
            </div>
          </div>
        </header>

        {/* صندوق ملخص التسوية (من له ومن عليه) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-100 text-sm font-semibold">
            <ArrowRightLeft size={18} />
            <span>حالة الحساب الصافي بين الطرفين</span>
          </div>
          <div className="text-3xl md:text-4xl font-black tracking-tight">
            {stats.netDifference === 0 ? (
              <span>الحساب خالص تماماً (لا يوجد مبالغ معلقة)</span>
            ) : (
              <span>
                على <span className="underline decoration-amber-400">{stats.debtor}</span> لـ <span className="underline decoration-amber-400">{stats.creditor}</span> مبلغ <span className="text-amber-300">${stats.netDifference.toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>

        {/* نموذج إضافة معاملة جديدة بينهما */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="text-emerald-600" size={20} />
            إضافة معاملة أو مصروف جديد
          </h3>

          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">الدافع / المُرسل</label>
              <select
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800 font-bold"
              >
                <option value={user1}>{user1}</option>
                <option value={user2}>{user2}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">المبلغ ($)</label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">البيان / السبب</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: فاتورة عشاء، سلفة، أغراض..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={18} />
                <span>تسجيل المعاملة المشتركة</span>
              </button>
            </div>
          </form>
        </div>

        {/* سجل المعاملات المشتركة */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="text-emerald-600" size={20} />
            سجل العمليات السابقة بينهما
          </h3>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">جاري التحميل...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">لا توجد معاملات مسجلة بين الطرفين حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const receiver = tx.sender === user1 ? user2 : user1
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">{tx.sender}</span>
                        <span className="text-xs text-gray-400">دفع لـ</span>
                        <span className="font-bold text-emerald-600 text-sm">{receiver}</span>
                      </div>
                      <p className="text-xs text-gray-500">{tx.description}</p>
                    </div>

                    <div className="text-left space-y-1">
                      <span className="font-black text-gray-900 text-base">${Number(tx.amount).toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 justify-end">
                        <Calendar size={12} />
                        <span>{new Date(tx.created_at).toLocaleDateString('ar-LY')}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}