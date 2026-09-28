'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Wallet, BookOpen, PlusCircle, Trash2, ArrowUpRight, ArrowDownLeft, FileText, Download, Upload, X } from 'lucide-react'

export default function UserDashboard() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // حالات العمليات المالية والفواتير
  const [transactions, setTransactions] = useState<any[]>([])
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'deposit' | 'withdraw' | 'debt'>('deposit')
  const [description, setDescription] = useState('')
  
  // حالة الفاتورة المرفوعة
  const [invoiceFile, setInvoiceFile] = useState<{ name: string; data: string; type: string } | null>(null)
  const [previewFileModal, setPreviewFileModal] = useState<{ name: string; data: string; type: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 1. جلب بيانات الشخص
    const savedProfiles = localStorage.getItem('financial_dashboard_profiles')
    if (savedProfiles) {
      try {
        const profilesList = JSON.parse(savedProfiles)
        const found = profilesList.find((p: any) => p.username === username)
        if (found) setProfile(found)
      } catch (e) {
        console.error(e)
      }
    }

    // 2. جلب العمليات المالية الخاصة بهذا المستخدم
    const savedTransactions = localStorage.getItem(`transactions_${username}`)
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (e) {
        console.error(e)
      }
    }

    setLoading(false)
  }, [username])

  // حفظ العمليات وتحديث الذاكرة
  const saveTransactions = (newTransactions: any[]) => {
    setTransactions(newTransactions)
    localStorage.setItem(`transactions_${username}`, JSON.stringify(newTransactions))
  }

  // التعامل مع تنزيل/رفع ملف الفاتورة من الهاتف
  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInvoiceFile({
          name: file.name,
          data: reader.result as string,
          type: file.type
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // إضافة عملية جديدة مع الفاتورة
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    const newTx = {
      id: Date.now(),
      amount: parseFloat(amount),
      type, // 'deposit', 'withdraw', 'debt'
      description: description || (type === 'deposit' ? 'إيداع مالي' : type === 'withdraw' ? 'سحب / مصروف' : 'تسجيل دين'),
      invoice: invoiceFile || null,
      date: new Date().toLocaleDateString('ar-LY')
    }

    saveTransactions([newTx, ...transactions])
    setAmount('')
    setDescription('')
    setInvoiceFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // حذف عملية مالية
  const handleDeleteTransaction = (id: number) => {
    const filtered = transactions.filter(tx => tx.id !== id)
    saveTransactions(filtered)
  }

  // حساب الأرصدة والديون تلقائياً
  const totalBalance = transactions
    .filter(tx => tx.type === 'deposit' || tx.type === 'withdraw')
    .reduce((acc, tx) => tx.type === 'deposit' ? acc + tx.amount : acc - tx.amount, 0)

  const totalDebts = transactions
    .filter(tx => tx.type === 'debt')
    .reduce((acc, tx) => acc + tx.amount, 0)

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">جاري التحميل...</div>
  }

  const currentName = profile ? profile.name : username
  const currentAvatar = profile ? profile.avatar_url : `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white p-3 sm:p-6 md:p-8 font-sans overflow-x-hidden" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-8">
        
        {/* الترويسة وصورة الشخص */}
        <div className="flex items-center justify-between bg-gray-900/90 border border-gray-800 p-3 sm:p-5 rounded-2xl backdrop-blur-xl shadow-xl">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs sm:text-sm transition-all border border-gray-700"
          >
            <ArrowRight size={16} />
            <span>الرئيسية</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="text-left hidden xs:block">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px]">{currentName}</h2>
              <span className="text-[10px] text-blue-400 font-mono">@{username}</span>
            </div>
            <img
              src={currentAvatar}
              alt={currentName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-md bg-gray-800"
            />
          </div>
        </div>

        {/* بطاقة الترحيب المتجاوبة */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-gray-900 to-blue-900/40 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center gap-3.5 shadow-xl">
          <img
            src={currentAvatar}
            alt={currentName}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0"
          />
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-black text-white truncate">لوحة: {currentName}</h1>
            <p className="text-gray-400 text-xs sm:text-sm">إدارة الأرصدة، العمليات، وتنزيل الفواتير.</p>
          </div>
        </div>

        {/* ملخص الأرصدة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
          <div className="bg-gray-900/70 border border-gray-800 p-4 sm:p-6 rounded-2xl space-y-1.5">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 w-fit rounded-xl"><Wallet size={20} /></div>
            <h3 className="text-xs sm:text-sm text-gray-400">الرصيد المتاح (إيداعات - مسحوبات)</h3>
            <p className={`text-2xl sm:text-3xl font-black ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalBalance.toFixed(2)} <span className="text-xs sm:text-sm font-normal">د.ل</span>
            </p>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-4 sm:p-6 rounded-2xl space-y-1.5">
            <div className="p-2.5 bg-amber-600/20 text-amber-400 w-fit rounded-xl"><BookOpen size={20} /></div>
            <h3 className="text-xs sm:text-sm text-gray-400">إجمالي الديون المستحقة</h3>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">
              {totalDebts.toFixed(2)} <span className="text-xs sm:text-sm font-normal">د.ل</span>
            </p>
          </div>
        </div>

        {/* نموذج إضافة عملية مالية مع تنزيل/رفع الفاتورة */}
        <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle size={20} className="text-emerald-400" />
            <span>تسجيل عملية وتنزيل فاتورة</span>
          </h3>

          <form onSubmit={handleAddTransaction} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-gray-400 mb-1">نوع العملية</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="deposit">إيداع (زيادة رصيد)</option>
                  <option value="withdraw">سحب (مصروف)</option>
                  <option value="debt">تسجيل دين</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">المبلغ (د.ل)</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">البيان / الوصف</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: فاتورة شراء مواد، أرباح، سداد..."
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* خانة تنزيل/رفع ملف الفاتورة */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">تنزيل/رفع ملف الفاتورة (PDF أو صورة)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleInvoiceUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 hover:border-emerald-500 bg-gray-800/40 p-3.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all"
              >
                {invoiceFile ? (
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={18} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-emerald-400 font-bold truncate">تم اختيار الفاتورة: {invoiceFile.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Upload size={18} className="text-emerald-400" />
                    <span className="text-xs">اضغط لتنزيل أو اختيار ملف الفاتورة من هاتفك</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg mt-2"
            >
              حفظ العملية مع الفاتورة
            </button>
          </form>
        </div>

        {/* سجل العمليات المالية والفواتير المحفوظة */}
        <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3.5 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-white">سجل العمليات والفواتير</h3>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-6">لا توجد عمليات أو فواتير مسجلة حتى الآن.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800/50 border border-gray-700/60 p-3.5 rounded-xl gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      tx.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                      tx.type === 'withdraw' ? 'bg-rose-600/20 text-rose-400' : 'bg-amber-600/20 text-amber-400'
                    }`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> :
                       tx.type === 'withdraw' ? <ArrowUpRight size={18} /> : <BookOpen size={18} />}
                    </div>
                    
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">{tx.description}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.type === 'deposit' ? 'إيداع' : tx.type === 'withdraw' ? 'سحب' : 'دين'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t sm:border-0 border-gray-700/50">
                    {/* زر تحميل أو معاينة الفاتورة المحفوظة */}
                    {tx.invoice && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewFileModal(tx.invoice)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-emerald-400 text-xs"
                          title="معاينة الفاتورة"
                        >
                          <FileText size={14} />
                          <span className="truncate max-w-[80px]">{tx.invoice.name}</span>
                        </button>
                        
                        <a
                          href={tx.invoice.data}
                          download={tx.invoice.name}
                          className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg transition-all"
                          title="تنزيل الفاتورة على الهاتف"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    )}

                    <span className={`font-black text-sm sm:text-base ${
                      tx.type === 'deposit' ? 'text-emerald-400' :
                      tx.type === 'withdraw' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {tx.type === 'withdraw' ? '-' : '+'}{tx.amount.toFixed(2)} د.ل
                    </span>
                    
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                      title="حذف العملية"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* نافذة منبثقة لمعاينة الفاتورة المحفوظة */}
      {previewFileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl max-w-lg w-full relative space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white truncate max-w-[350px]">فاتورة: {previewFileModal.name}</h4>
              <button 
                onClick={() => setPreviewFileModal(null)}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex justify-center bg-black/40 p-3 rounded-xl max-h-[65vh] overflow-auto">
              {previewFileModal.type.includes('image') ? (
                <img src={previewFileModal.data} alt="Invoice" className="object-contain max-h-[60vh] rounded-lg" />
              ) : (
                <div className="text-center py-10 space-y-3">
                  <FileText size={48} className="mx-auto text-emerald-400" />
                  <p className="text-sm text-gray-300">هذا المستند ملف (PDF أو ملف نصي).</p>
                  <a
                    href={previewFileModal.data}
                    download={previewFileModal.name}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    <Download size={16} />
                    <span>تنزيل الملف على الهاتف</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}