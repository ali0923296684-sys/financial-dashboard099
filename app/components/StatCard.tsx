interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'emerald' | 'amber'
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h2 className="text-2xl font-black text-gray-900 mt-1">{value}</h2>
      </div>
      <div className={`p-4 rounded-2xl border ${colorClasses[color]}`}>
        {icon}
      </div>
    </div>
  )
}