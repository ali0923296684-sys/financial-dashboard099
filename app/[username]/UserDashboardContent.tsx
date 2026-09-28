'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Wallet, TrendingUp, Target, User, Lock, ShieldCheck } from 'lucide-react'

import StatCard from '../components/StatCard'
import AccountForm from '../components/AccountForm'
import TransactionList from '../components/TransactionList'
import GoalList from '../components/GoalList'
import FinancialCharts from '../components/FinancialCharts'
import AccountList from '../components/AccountList'

export default function UserDashboardContent() {
  const params = useParams()
  const username = typeof params.username === 'string' ? params.username : 'user'

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '1234') {
      setIsAuthenticated(true)
      localStorage.setItem(`auth_${username}`, 'true')
    } else {
      setError(true)
      setPin('')
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem(`auth_${username}`)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [username])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [accRes, txRes, goalRes] = await Promise.all([
        supabase.from('accounts').select('*').eq('owner', username),
        supabase.from('transactions').select('*, accounts(name)').eq('owner', username).order('created_at', { ascending: false }).limit(10),
        supabase.from('savings_goals').select('*').eq('owner', username)
      ])

      if (accRes.data) setAccounts(accRes.data)
      if (txRes.data) setTransactions(txRes.data)
      if (goalRes.data) setGoals(goalRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, fetchData])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4" dir="rtl">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">لوحة المستخدم: {username}</h2>
          <p className="text-sm text-gray-400 mb-6">أدخل رمز المرور السري الخاص بهذه اللوحة للوصول.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="أدخل رمز المرور"
              className="w-full px-4 py-3 text-center tracking-widest text-xl bg-gray-900 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              autoFocus
            />
            {error && <p className="text-xs text-rose-500 font-semibold">رمز المرور غير صحيح.</p>}
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
              <ShieldCheck size={18} />
              <span>دخول اللوحة</span>
            </button>
          </form>
        </div>
      </div>
    )
  }

  const totalBalance = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0)

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
              <User size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">لوحة الماليّة لـ: {username}</h1>
              <p className="text-sm text-gray-500 mt-0.5">إدارة الأموال والأرصدة الخاصة بك بشكل مستقل وآمن</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            لوحة مستقلة وفعالة
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="إجمالي الأرصدة" value={`$${totalBalance.toLocaleString()}`} icon={<Wallet size={24} />} color="blue" />
          <StatCard title="الحسابات النشطة" value={`${accounts.length} حسابات`} icon={<TrendingUp size={24} />} color="emerald" />
          <StatCard title="الأهداف" value={`${goals.length} أهداف`} icon={<Target size={24} />} color="amber" />
        </div>

        <FinancialCharts transactions={transactions} accounts={accounts} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AccountList accounts={accounts} onUpdate={fetchData} />
          <AccountForm onSubmit={async (data) => {
            await supabase.from('accounts').insert([{ ...data, owner: username, balance: parseFloat(data.balance || '0') }])
            fetchData()
          }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionList transactions={transactions} />
          <GoalList goals={goals} />
        </div>

      </div>
    </main>
  )
}