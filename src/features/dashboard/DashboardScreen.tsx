import React, { useEffect } from 'react';
import { useHabitStore } from '../habits/stores/habitStore';
import { useGoalStore } from '../goals/stores/goalStore';
import { useJournalStore } from '../journal/stores/journalStore';
import { useTradingStore } from '../trading/stores/tradingStore';
import { useActivityStore } from '../../core/stores/activityStore';
import { useI18n } from '../../core/store/useI18n';
import { Flame, Target, BookText, Zap, ChevronRight, Trophy, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { ProgressRing } from '../../components/ProgressRing';

export default function DashboardScreen() {
  const { habits, todayLogs } = useHabitStore();
  const { goals } = useGoalStore();
  const { entries } = useJournalStore();
  const { trades } = useTradingStore();
  const { todayPoints, heatmapData, fetchTodayPoints, fetchHeatmapData } = useActivityStore();
  const { t, dir, language } = useI18n();

  useEffect(() => {
    fetchTodayPoints();
    fetchHeatmapData(30);
  }, [fetchTodayPoints, fetchHeatmapData]);

  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
  const heatmapArray = Object.entries(heatmapData).sort((a, b) => b[0].localeCompare(a[0])).reverse();

  // Dynamic calculations
  const habitConsistency = habits.length > 0 
    ? Math.round((Object.values(todayLogs).filter(l => l.status === 'DONE').length / habits.length) * 100) 
    : 0;

  const tradingWinRate = trades.length > 0 
    ? Math.round((trades.filter(t => t.pnl_amount && t.pnl_amount > 0).length / trades.length) * 100) 
    : 0;

  const totalPossiblePoints = habits.length * 10;
  const reliabilityAvg = totalPossiblePoints > 0 
    ? Math.min(100, Math.round((todayPoints / totalPossiblePoints) * 100)) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-surface-base p-4 md:p-12 overflow-y-auto pb-40 data-grid scrollbar-hide">
      {/* Dynamic Header - Industrial Style */}
      <header className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2 md:mb-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[9px] md:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Node-01 // {t('welcome')}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter leading-none"
          >
            {t('dashboard')}.
          </motion.h1>
        </div>
        
        <div className="flex gap-6 md:gap-12 border-t md:border-t-0 md:border-l border-white/[0.05] pt-6 md:pt-0 md:pl-12 w-full md:w-auto items-center justify-between md:justify-start">
            <div className="text-left md:text-right">
              <span className="text-[8px] md:text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest block mb-1">{t('local_time') || 'LOCAL_TIME'}</span>
              <div className="text-lg md:text-2xl font-mono font-medium text-white tracking-tight">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] md:text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest block mb-1">UPTIME_NODE</span>
              <div className="text-lg md:text-2xl font-mono font-medium text-brand-primary tracking-tight">12.04d</div>
            </div>
        </div>
      </header>

      {/* Bento Grid Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-12">
        
        {/* Prime Objective Progress (High Impact) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-4 md:row-span-2 command-card relative overflow-hidden group min-h-[340px] md:min-h-[400px] flex flex-col justify-between !p-6 md:!p-12"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
            <Zap size={300} strokeWidth={1} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-8 md:mb-12">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-brand-primary rounded-full" />
                  <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">{t('growth_score')}</h3>
               </div>
               <div className="text-[8px] md:text-[10px] font-mono text-slate-600">STABILITY_LOCK_v4</div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-10">
               <div className="relative">
                  <h2 className="text-7xl md:text-[12rem] font-display font-black text-white leading-none tracking-tighter mix-blend-difference">
                    {todayPoints}
                  </h2>
                  <div className="absolute -right-4 top-1 md:top-4 text-brand-primary">
                    <ArrowUpRight size={24} md:size={48} strokeWidth={3} />
                  </div>
               </div>
               <div className="pb-1 md:pb-6">
                  <div className="text-[8px] md:text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.3em] mb-1 md:mb-2">+12.4% {t('productivity')}</div>
                  <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed max-w-[240px]">
                    {t('trajectory_message')}
                  </p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-8 pt-12 border-t border-white/[0.03]">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-900 group-hover:translate-x-1 transition-transform cursor-pointer" />
               ))}
             </div>
             <div className="flex-1 h-[2px] bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  className="h-full bg-brand-primary shadow-[0_0_15px_#10b981]" 
                />
             </div>
             <span className="text-[10px] font-mono font-black text-white">74% PK.</span>
          </div>
        </motion.div>

        {/* Tactical Metrics (Dense) */}
        <div className="md:col-span-2 grid grid-cols-1 gap-6">
           <motion.div 
             whileHover={{ y: -4 }}
             className="command-card bg-emerald-600/10 border-emerald-500/20 flex flex-col justify-between"
           >
              <div className="flex justify-between items-start">
                 <div className="text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">{t('win_rate')}</div>
                 <Activity size={16} className="text-emerald-500" />
              </div>
              <div>
                 <div className="text-4xl md:text-6xl font-display font-black text-white leading-none">{tradingWinRate}%</div>
                 <div className="text-[8px] md:text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1 md:mt-2">{t('trading')} OPERATIONAL_STAT</div>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -4 }}
             className="command-card !p-0 overflow-hidden flex"
           >
              <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                <div className="text-[9px] font-mono font-black text-brand-secondary uppercase tracking-widest">{t('active_goals')}</div>
                <div>
                  <div className="text-4xl md:text-5xl font-display font-black text-white">{activeGoals}</div>
                  <div className="w-full bg-slate-800 h-1 mt-2 md:mt-3 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-brand-secondary" />
                  </div>
                </div>
              </div>
              <div className="w-1 bg-brand-secondary shadow-[0_0_20px_#3b82f6]" />
           </motion.div>
        </div>

        {/* Secondary Modules */}
        <motion.div className="md:col-span-2 command-card flex flex-col justify-between hover:bg-slate-900/80">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">{t('habits')} EX_MAP</span>
              <Activity size={16} className="text-emerald-500" />
            </div>
            <div className="py-2">
               <ProgressRing progress={habitConsistency} size={90} strokeWidth={8} color="#10b981" label="" />
            </div>
            <div className="text-white font-black font-display text-3xl md:text-4xl">{habitConsistency}%</div>
        </motion.div>

        <motion.div 
          onClick={() => {}} 
          className="md:col-span-2 command-card flex flex-col justify-between cursor-pointer group"
        >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono font-black text-purple-500 uppercase tracking-widest">{t('journal')}</span>
              <BookText size={16} className="text-purple-500" />
            </div>
            <div className="text-5xl md:text-6xl font-display font-black text-white">{entries.length}</div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">
               {t('access_archives')} <ChevronRight size={12} />
            </div>
        </motion.div>

        <motion.div className="md:col-span-2 command-card bg-slate-900/80 border-white/[0.08] flex items-center justify-center">
           <div className="text-center">
              <div className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Neural Readiness</div>
              <div className="text-3xl font-display font-black text-brand-primary uppercase">{t('optimal')}</div>
              <div className="mt-4 flex gap-1 justify-center">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-brand-primary rounded-full shadow-[0_0_8px_#10b981]" />)}
                 {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-slate-800 rounded-full" />)}
              </div>
           </div>
        </motion.div>

      </div>

        {/* Strategic Grid (Reliability Matrix) */}
      <section className="command-card !p-6 md:!p-12 border-white/[0.04]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
           <div>
             <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter">{t('consistency_matrix')}.</h2>
             <span className="text-[10px] font-mono font-bold text-slate-650 uppercase tracking-[0.4em]">{t('continuous_monitoring')}</span>
           </div>
           
           <div className="flex gap-8 md:gap-10 border-t md:border-t-0 md:border-l border-white/[0.04] pt-6 md:pt-0 md:pl-10">
              <div className="text-right">
                <span className="text-[8px] font-mono text-slate-650 uppercase tracking-widest block mb-1">Peak_Output</span>
                <span className="text-white font-mono font-bold">{Math.max(...heatmapArray.map(m => m[1] as number), 0)} PTS</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-slate-650 uppercase tracking-widest block mb-1">{t('efficiency')}</span>
                <span className="text-brand-primary font-mono font-bold">{reliabilityAvg}%</span>
              </div>
           </div>
        </div>

        
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 xl:grid-cols-20 gap-2.5" dir="ltr">
           {heatmapArray.slice(-60).map(([date, points], i) => (
             <motion.div 
               key={date} 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: i * 0.005 + 0.5 }}
               className={`aspect-square rounded-[2px] transition-all duration-300 hover:scale-150 cursor-crosshair border border-white/5 relative group ${
                 points >= 100 ? 'bg-brand-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
                 points >= 50 ? 'bg-brand-primary/60' : 
                 points >= 25 ? 'bg-brand-primary/30' : 
                 points > 0 ? 'bg-brand-primary/10 border-brand-primary/5' : 'bg-slate-950 opacity-20'
               }`} 
             >
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 border border-white/10 rounded text-[8px] font-mono font-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {date} // {points} PTS
               </div>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}
