export default function GoalList({ goals }: { goals: any[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">تقدم الأهداف الادخارية</h3>
      <div className="space-y-4">
        {goals.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">لا توجد أهداف مالية مسجلة</p>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
            return (
              <div key={goal.id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                  <span>{goal.title}</span>
                  <span className="text-amber-600">${goal.current_amount} /${goal.target_amount}</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
                  <span>{percentage}% مكتمل</span>
                  <span>الهدف المتبقي: ${goal.target_amount - goal.current_amount}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}