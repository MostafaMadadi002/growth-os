import React, { useEffect } from 'react';
import { useHabitStore } from '../habits/stores/habitStore';
import { useGoalStore } from '../goals/stores/goalStore';
import { useJournalStore } from '../journal/stores/journalStore';
import { useActivityStore } from '../../core/stores/activityStore';
import { useI18n } from '../../core/store/useI18n';
import { Flame, Target, BookText, Zap, ChevronRight, Trophy, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ProgressRing } from '../../components/ProgressRing';

export default function DashboardScreen() {
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { entries } = useJournalStore();
  const { todayPoints, heatmapData, fetchTodayPoints, fetchHeatmapData } = useActivityStore();
  const { t, dir } = useI18n();

  useEffect(() => {
    fetchTodayPoints();
    fetchHeatmapData(30);
  }, [habits, goals, entries, fetchTodayPoints, fetchHeatmapData]);

  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
  const heatmapArray = Object.entries(heatmapData).sort((a, b) => b[0].localeCompare(a[0])).reverse();

  // Mock consistency percentage for visualization
  const habitConsistency = habits.length > 0 ? 84 : 0; 
  const goalProgress = 42;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto pb-32">
      {/* Dynamic Header */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">System Online</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-black text-white tracking-tighter"
          >
            {t('welcome')}
          </motion.h1>
        </div>
        <div className="text-right hidden sm:block">
           <div className="text-3xl font-display font-black text-white">12:42</div>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Cycle #42</div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Main Score Card (Large) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 md:row-span-2 bg-slate-900 border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={200} className="text-emerald-500" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Trophy size={24} />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth Index</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-8xl font-display font-black text-white leading-none">{todayPoints}</h2>
                <div className="flex items-center gap-1 text-emerald-500 font-black text-sm">
                  <ArrowUpRight size={16} />
                  +12%
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-4 font-medium max-w-[200px]">
                You are in the top 5% of consistency this week.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Community Leaderboard</span>
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-500 border border-orange-400/20 rounded-[3.5rem] p-8 flex flex-col justify-between shadow-2xl shadow-orange-500/10 group"
        >
          <div className="flex justify-between items-start">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <Flame size={24} />
             </div>
             <ArrowUpRight className="text-white/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div>
            <div className="text-5xl font-display font-black text-white leading-none mb-1">12</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Day Streak</div>
          </div>
        </motion.div>

        {/* Habits Consistency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-8 flex flex-col items-center justify-center group"
        >
          <ProgressRing progress={habitConsistency} size={110} strokeWidth={10} color="#10b981" label="Habits" />
          <div className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Consistency</div>
        </motion.div>

        {/* Goals Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-600 border border-blue-500/20 rounded-[3.5rem] p-8 flex flex-col justify-between group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
             <Target size={24} />
          </div>
          <div>
            <div className="text-4xl font-display font-black text-white leading-none mb-1">{activeGoals}</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Active Goals</div>
          </div>
        </motion.div>

        {/* Journal Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <BookText size={80} />
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
             <BookText size={24} />
          </div>
          <div>
            <div className="text-4xl font-display font-black text-white leading-none mb-1">{entries.length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Journal Entries</div>
          </div>
        </motion.div>

      </div>

      {/* Activity Heatmap Grid */}
      <section className="bg-slate-900/50 border border-white/5 rounded-[3.5rem] p-10 mb-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-10">
           <div>
             <h2 className="text-2xl font-display font-black text-white tracking-tight">Consistency Matrix</h2>
             <p className="text-slate-500 text-xs mt-1">Your activity distribution across the last 30 days.</p>
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">
             Full Analysis <ChevronRight size={14} />
           </button>
        </div>
        
        <div className="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-15 gap-3" dir="ltr">
           {heatmapArray.map(([date, points], i) => (
             <motion.div 
               key={date} 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: i * 0.01 + 0.5 }}
               title={`${date}: ${points} points`}
               className={`aspect-square rounded-xl transition-all duration-500 hover:scale-110 cursor-help ${
                 points >= 100 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
                 points >= 50 ? 'bg-emerald-500/60' : 
                 points >= 25 ? 'bg-emerald-500/30' : 
                 points > 0 ? 'bg-emerald-500/10' : 'bg-slate-850'
               }`} 
             />
           ))}
        </div>
      </section>

    </div>
  );
}
