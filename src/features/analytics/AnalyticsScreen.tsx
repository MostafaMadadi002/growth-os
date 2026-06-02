import React from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, Info } from 'lucide-react';
import { useHabitStore } from '../habits/store/useHabitStore';
import { useGoalStore } from '../goals/store/useGoalStore';
import { useTradingStore } from '../trading/store/useTradingStore';

export default function AnalyticsScreen() {
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { trades } = useTradingStore();

  const winRate = trades.length > 0 
    ? Math.round((trades.filter(t => t.status === 'WIN').length / trades.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto" dir="rtl">
      <header className="mb-10 text-right">
        <h1 className="text-4xl font-black text-white mb-2">تحلیل و آمار</h1>
        <p className="text-slate-500">روند رشد خود را اینجا دنبال کنید</p>
      </header>

      {/* Grid for main scores */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <Zap className="text-yellow-500 mb-2" size={24} />
           <span className="text-slate-500 text-sm block mb-1">امتیاز بهره‌وری</span>
           <span className="text-3xl font-black text-white">۸۴</span>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <TrendingUp className="text-emerald-500 mb-2" size={24} />
           <span className="text-slate-500 text-sm block mb-1">پیشرفت کلی</span>
           <span className="text-3xl font-black text-white">۱۲٪+</span>
         </div>
      </div>

      {/* Heatmap Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
              <Calendar size={20} className="text-slate-400" />
              <h2 className="text-xl font-bold text-white">هیت‌مپ فعالیت</h2>
           </div>
        </div>
        
        <div className="flex gap-1.5 flex-wrap justify-start" dir="ltr">
           {Array.from({ length: 90 }).map((_, i) => (
             <div 
               key={i} 
               className={`w-3 h-3 rounded-sm ${i % 10 === 0 ? 'bg-emerald-500' : i % 7 === 0 ? 'bg-emerald-500/60' : i % 5 === 0 ? 'bg-emerald-500/30' : 'bg-slate-800'}`} 
             />
           ))}
        </div>
        <p className="text-xs text-slate-600 mt-4 text-center italic">نمایش فعالیت در ۹۰ روز گذشته</p>
      </section>

      {/* Insights Section */}
      <section className="space-y-4 pb-24">
         <h2 className="text-xl font-bold text-white mb-2 pr-2">بینش‌های هوشمند</h2>
         <InsightCard 
           title="ثبات در عادت‌ها"
           desc="شما در عادت‌های مثبت خود ۸۰٪ ثبات داشته‌اید که نسبت به هفته پیش ۵٪ رشد کرده است."
           status="positive"
         />
         <InsightCard 
           title="معاملات ترید"
           desc={`نرخ برد شما (${winRate}٪) بالاتر از میانگین است. سعی کنید روی مدیریت ریسک بیشتر تمرکز کنید.`}
           status="neutral"
         />
         <InsightCard 
           title="زمان یادگیری"
           desc="بیشترین بازدهی یادگیری شما ساعت ۱۰ شب بوده است."
           status="info"
         />
      </section>
    </div>
  );
}

function InsightCard({ title, desc, status }: { title: string, desc: string, status: 'positive' | 'neutral' | 'info' }) {
  const colors = {
    positive: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
    neutral: 'border-blue-500/20 bg-blue-500/5 text-blue-500',
    info: 'border-slate-500/20 bg-slate-500/5 text-slate-400'
  };

  return (
    <div className={`p-5 rounded-3xl border ${colors[status]} flex items-start gap-4`}>
       <div className="mt-1">
          <Info size={18} />
       </div>
       <div className="text-right">
          <h3 className="font-bold mb-1">{title}</h3>
          <p className="text-sm opacity-80 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
