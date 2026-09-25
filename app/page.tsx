'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Wallet, TrendingUp, Target, Plus, CreditCard, Loader2 } from 'lucide-react'

// استيراد المكونات الفرعية (سنقوم بإنشائها أو دمجها)
import StatCard from './components/StatCard'
import TransactionForm from './components/TransactionForm'
import AccountForm from './components/AccountForm'
import GoalForm from './components/GoalForm'
import TransactionList from './components/TransactionList'
import GoalList from './components/GoalList'

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // دالة جلب البيانات باستخدام useCallback لتحسين الأداء
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [accRes, txRes, goalRes] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('transactions').select('*, accounts(name)').order('created_at', { ascending: false }).limit(10),
        supabase.from('savings_goals').select('*')
      ])

      if (accRes.data) setAccounts(accRes.data)
      if (txRes.data) setTransactions(txRes.data)
      if (goalRes.data) setGoals(goalRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // إضافة معاملة جديدة بطريقة احترافية مع Optimistic Update
  const handleAddTransaction = async (formData: { amount: string; type: string; description: string; accountId: string }) => {
    const { amount, type, description, accountId } = formData
    if (!amount || !accountId) return

    const numAmount = parseFloat(amount)
    const selectedAcc = accounts.find(acc => acc.id === accountId)
    if (!selectedAcc) return

    let newBalance = Number(selectedAcc.balance)
    if (type === 'income') {
      newBalance += numAmount
    } else {
      newBalance -= numAmount
    }

    // تنفيذ التحديث في قاعدة البيانات
    const { error: txError } = await supabase.from('transactions').insert([
      { amount: numAmount, type, description, account_id: accountId }
    ])

    if (txError) {
      alert('خطأ في إضافة المعاملة: ' + txError.message)
      return
    }

    await supabase.from('accounts').update({ balance: newBalance }).eq('id', accountId)
    fetchData()
  }

  // إضافة حساب جديد
  const handleAddAccount = async (formData: { name: string; balance: string }) => {
    const { name, balance } = formData
    if (!name) return

    const { error } = await supabase.from('accounts').insert([
      { name, balance: parseFloat(balance || '0') }
    ])

    if (!error) {
      fetchData()
    } else {
      alert('خطأ في إضافة الحساب: ' + error.message)
    }
  }

  // إضافة هدف مالي جديد
  const handleAddGoal = async (formData: { title: string; target: string }) => {
    const { title, target } = formData
    if (!title || !target) return

    const { error } = await supabase.from('savings_goals').insert([
      { title, target_amount: parseFloat(target), current_amount: 0 }
    ])

    if (!error) {
      fetchData()
    } else {
      alert('خطأ في إضافة الهدف: ' + error.message)
    }
  }

  const totalBalance = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0)

  if (loading && accounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="flex items-center gap-3 text-blue-600 font-medium">
          <Loader2 className="animate-spin" size={24} />
          <span>جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الترويسة الاحترافية */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">لوحة التحكم المالي</h1>
            <p className="text-sm text-gray-500 mt-1">تتبع أصولك، راقب تدفقاتك النقدية، وحقق أهدافك بذكاء</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              متصل بـ Supabase بنجاح
            </span>
          </div>
        </header>

        {/* شبكة الإحصائيات (Stat Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="إجمالي الأرصدة المتاحة" value={`$${totalBalance.toLocaleString()}`} icon={<Wallet size={24} />} color="blue" />
          <StatCard title="الحسابات المصرفية النشطة" value={`${accounts.length} حسابات`} icon={<TrendingUp size={24} />} color="emerald" />
          <StatCard title="الأهداف الادخارية الجارية" value={`${goals.length} أهداف`} icon={<Target size={24} />} color="amber" />
        </div>

        {/* شبكة النماذج للإدخال */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TransactionForm accounts={accounts} onSubmit={handleAddTransaction} />
          <AccountForm onSubmit={handleAddAccount} />
          <GoalForm onSubmit={handleAddGoal} />
        </div>

        {/* الجداول وقوائم العرض */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionList transactions={transactions} />
          <GoalList goals={goals} />
        </div>

      </div>
    </main>
  )
}