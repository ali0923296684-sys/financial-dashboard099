'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, Users, PlusCircle, Trash2, ArrowRight, Film, Sparkles, Upload } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<any[]>([])
  const [name, setName] = useState('')
  const [avatarData, setAvatarData] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // حالة التحكم في ظهور الفيديو الترحيجي من يوتيوب أولاً
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('financial_dashboard_profiles')
    if (saved) {
      try {
        setProfiles(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
    setLoading(false)

    const hasSeenIntro = sessionStorage.getItem('has_seen_intro')
    if (hasSeenIntro) {
      setShowIntroVideo(false)
    }
  }, [])

  const handleFinishIntro = () => {
    setShowIntroVideo(false)
    sessionStorage.setItem('has_seen_intro', 'true')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarData(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveProfiles = (newProfiles: any[]) => {
    setProfiles(newProfiles)
    localStorage.setItem('financial_dashboard_profiles', JSON.stringify(newProfiles))
  }

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const username = name.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000)
    const finalAvatar = avatarData || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

    const newProfile = {
      id: Date.now(),
      name: name.trim(),
      username,
      avatar_url: finalAvatar,
      createdAt: new Date().toLocaleDateString('ar-LY')
    }

    const updated = [newProfile, ...profiles]
    saveProfiles(updated)
    setName('')
    setAvatarData('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteProfile = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('هل أنت متأكد من حذف هذه اللوحة والبيانات التابعة لها؟')) {
      const filtered = profiles.filter(p => p.id !== id)
      saveProfiles(filtered)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">جاري التحميل...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white p-3 sm:p-6 md:p-8 font-sans overflow-x-hidden" dir="rtl">
      
      {/* 1. شاشة فيديو اليوتيوب التمهيدية (تظهر أولاً عند فتح المنظومة) */}
      {showIntroVideo && (
        <div className="fixed inset-0 bg-gray-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4 text-center relative">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-bold">
                <Sparkles size={14} />
                <span>أهلاً بك في المنظومة المالية</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">فيديو تعريفي من يوتيوب</h2>
              <p className="text-xs text-gray-400">شاهد الفيديو التعريفي ثم تابع الانتقال للمنظومة.</p>
            </div>

            {/* مشغل فيديو يوتيوب الخاص بك */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-700 shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/1WJsltfWwyc?autoplay=1&enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* زر الدخول إلى المنظومة الرئيسية */}
            <button
              onClick={handleFinishIntro}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>دخول إلى المنظومة الرئيسية</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. اللوحة الرئيسية */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
        
        {/* ترويسة الموقع */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold mb-2">
            <Sparkles size={14} />
            <span>نظام إدارة الأموال والفواتير الذكي</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
            المنظومة المالية المتقدمة
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto">
            قم بإدارة أرصدتك، ديونك، وتنزيل فواتيرك بكل سهولة وأمان عبر لوحات تحكم مخصصة.
          </p>

          <button
            onClick={() => setShowIntroVideo(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-xs text-emerald-400 font-bold transition-all mt-3"
          >
            <Film size={14} />
            <span>إعادة مشاهدة الفيديو الدعائي (يوتيوب)</span>
          </button>
        </div>

        {/* نموذج إضافة حساب/لوحة جديدة مع رفع صورة من الهاتف */}
        <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle size={20} className="text-emerald-400" />
            <span>إنشاء لوحة تحكم جديدة لشخص أو مشروع</span>
          </h3>

          <form onSubmit={handleAddProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs text-gray-400 mb-1">اسم الشخص أو المشروع</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد محمد، محل التلاجة..."
                required
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* خانة اختيار الصورة الشخصية من الهاتف */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">الصورة الشخصية من الهاتف (اختياري)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 hover:border-emerald-500 bg-gray-800/40 p-3 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                {avatarData ? (
                  <div className="flex items-center gap-2">
                    <img src={avatarData} alt="Preview" className="w-9 h-9 rounded-lg object-cover border border-emerald-500" />
                    <span className="text-xs text-emerald-400 font-bold">تم اختيار الصورة بنجاح (اضغط للتغيير)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Upload size={18} className="text-emerald-400" />
                    <span className="text-xs">اضغط لاختيار صورة شخصية من المعرض أو التقاطها بالكاميرا</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg"
            >
              إنشاء اللوحة والدخول
            </button>
          </form>
        </div>

        {/* قائمة اللوحات المتاحة */}
        <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            <span>اللوحات والحسابات المسجلة ({profiles.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {profiles.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-6 sm:col-span-2">
                لا توجد لوحات مسجلة بعد. قم بإنشاء أول لوحة من النموذج أعلاه.
              </p>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => router.push(`/${profile.username}`)}
                  className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 hover:border-emerald-500/50 p-3.5 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-11 h-11 rounded-xl object-cover border border-emerald-500 shrink-0 bg-gray-700"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                        {profile.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 block font-mono">@{profile.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDeleteProfile(profile.id, e)}
                      className="p-2 text-gray-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-gray-700/50"
                      title="حذف اللوحة"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="p-2 bg-gray-700/50 group-hover:bg-emerald-600 text-gray-300 group-hover:text-white rounded-lg transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  )
}