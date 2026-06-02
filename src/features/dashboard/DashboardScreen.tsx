import React from 'react';
import { useHabitStore } from '../habits/store/useHabitStore';
import { useGoalStore } from '../goals/store/useGoalStore';
import { useTradingStore } from '../trading/store/useTradingStore';
import { Flame, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function DashboardScreen() {
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { trades } = useTradingStore();

  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
  const winRate = trades.length > 0 
    ? Math.round((trades.filter(t => t.status === 'WIN').length / trades.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto" dir="rtl">
      <header className="mb-10 text-right">
        <h1 className="text-4xl font-black text-white mb-2">GrowthOS</h1>
        <p className="text-slate-500 font-medium text-lg">روز خوبی برای رشد داشته باش!</p>
      </header>

      {/* Heatmap Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-white">فعالیت اخیر</h2>
           <div className="flex items-center gap-1 text-orange-500">
              <Flame size={20} fill="currentColor" />
              <span className="font-bold">۱۲ روز متوالی</span>
           </div>
        </div>
        
        <div className="flex gap-1.5 flex-wrap justify-end">
           {/* Mock Heatmap */}
           {Array.from({ length: 42 }).map((_, i) => (
             <div 
               key={i} 
               className={`w-4 h-4 rounded-sm ${i % 7 === 0 ? 'bg-emerald-500' : i % 5 === 0 ? 'bg-emerald-500/60' : i % 3 === 0 ? 'bg-emerald-500/30' : 'bg-slate-800'}`} 
             />
           ))}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 pb-24">
         <StatCard 
           icon={<CheckCircle2 className="text-emerald-500" />}
           label="عادت‌های امروز"
           value={`${habits.length} مورد`}
           color="bg-emerald-500/10"
         />
         <StatCard 
           icon={<Target className="text-blue-500" />}
           label="اهداف فعال"
           value={`${activeGoals} هدف`}
           color="bg-blue-500/10"
         />
         <StatCard 
           icon={<TrendingUp className="text-purple-500" />}
           label="وین‌ریت معامله"
           value={`${winRate}٪`}
           color="bg-purple-500/10"
         />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
         <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
            {icon}
         </div>
         <div className="text-right">
            <span className="text-slate-500 text-sm block mb-1">{label}</span>
            <span className="text-2xl font-black text-white">{value}</span>
         </div>
      </div>
    </div>
  );
}
