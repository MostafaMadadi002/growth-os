import React, { useEffect } from 'react';
import { useHabitStore } from '../habits/store/useHabitStore';
import { useGoalStore } from '../goals/store/useGoalStore';
import { useJournalStore } from '../journal/store/useJournalStore';
import { useGrowthStore } from '../../core/store/useGrowthStore';
import { useI18n } from '../../core/store/useI18n';
import { Flame, Target, BookText, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardScreen() {
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { entries } = useJournalStore();
  const { dailyScore, lifetimeScore, calculateScores } = useGrowthStore();
  const { t, dir } = useI18n();

  useEffect(() => {
    calculateScores();
  }, [habits, goals, entries, calculateScores]);

  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
  
  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto pb-32">
      <header className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-white mb-2"
        >
          {t('welcome')}
        </motion.h1>
        <p className="text-slate-500 font-medium text-lg italic">
          {dir === 'rtl' ? 'امروز فرصتی برای یک قدم بهتر است.' : 'Today is a chance to be better.'}
        </p>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group">
           <Zap className="text-yellow-500/20 absolute -right-2 -top-2 scale-150 group-hover:scale-175 transition-transform" size={80} />
           <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-widest">{t('growth_score')}</span>
           <span className="text-4xl font-black text-white">{dailyScore}</span>
           <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total: {lifetimeScore}</div>
         </div>
         <div className="bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between">
           <div className="flex items-center gap-2 text-orange-500">
              <Flame size={18} fill="currentColor" />
              <span className="font-black text-sm uppercase tracking-tighter">12 DAYS</span>
           </div>
           <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">STREAK</span>
         </div>
      </div>

      {/* Heatmap Section */}
      <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-black text-white tracking-tight">Activity Canvas</h2>
           <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-3 py-1 rounded-full uppercase tracking-widest">Last 30 Days</span>
        </div>
        
        <div className="flex gap-2 flex-wrap" dir="ltr">
           {Array.from({ length: 30 }).map((_, i) => (
             <motion.div 
               key={i} 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: i * 0.01 }}
               className={`w-5 h-5 rounded-md ${
                 i % 7 === 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 
                 i % 4 === 0 ? 'bg-emerald-500/40' : 
                 i % 3 === 0 ? 'bg-emerald-500/20' : 'bg-slate-800'
               }`} 
             />
           ))}
        </div>
      </section>

      {/* MVP Stats Cards */}
      <div className="space-y-4">
         <StatCard 
           icon={<CheckCircle2 className="text-emerald-500" />}
           label={t('daily_habits')}
           value={`${habits.length} Items`}
           progress={75}
         />
         <StatCard 
           icon={<Target className="text-blue-500" />}
           label={t('active_goals')}
           value={`${activeGoals} Goals`}
           progress={40}
         />
         <StatCard 
           icon={<BookText className="text-purple-500" />}
           label={t('journal')}
           value={`${entries.length} Entries`}
           progress={100}
         />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, progress }: { icon: React.ReactNode, label: string, value: string, progress: number }) {
  return (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-slate-850 transition-colors">
      <div className="flex items-center gap-5">
         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
         </div>
         <div>
            <span className="text-slate-500 text-xs font-bold block mb-1 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-black text-white">{value}</span>
         </div>
      </div>
      
      {/* Mini Progress Ring indicator (CSS only) */}
      <div className="w-12 h-12 rounded-full border-4 border-slate-800 relative flex items-center justify-center">
         <div 
           className="absolute inset-0 rounded-full border-4 border-emerald-500/50" 
           style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
         />
         <span className="text-[10px] font-black text-slate-400">{progress}%</span>
      </div>
    </div>
  );
}
