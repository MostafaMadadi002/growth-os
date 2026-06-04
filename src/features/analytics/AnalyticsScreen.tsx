import React, { useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { motion } from 'motion/react';
import { 
  TrendingUp, Activity, Target, Brain, 
  ChevronRight, Calendar, Zap, AlertCircle
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useActivityStore } from '../../core/stores/activityStore';
import { useHabitStore } from '../habits/stores/habitStore';
import { useGoalStore } from '../goals/stores/goalStore';
import { useJournalStore } from '../journal/stores/journalStore';
import { format, subDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AnalyticsScreen() {
  const { t, language } = useI18n();
  const { heatmapData, fetchHeatmapData } = useActivityStore();
  const { habits, allLogs: habitLogs, fetchHabits, fetchHistoricalLogs } = useHabitStore();
  const { goals, fetchGoals } = useGoalStore();
  const { entries: journalEntries, fetchEntries: fetchJournals } = useJournalStore();

  useEffect(() => {
    fetchHeatmapData(30);
    fetchHabits();
    fetchHistoricalLogs(30);
    fetchGoals();
    fetchJournals();
  }, []);

  // 1. Weekly Growth Data (Last 7 Days)
  const weeklyGrowthData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        name: language === 'fa' ? format(date, 'EEEE') : format(date, 'EEE'),
        points: heatmapData[dateStr] || 0,
        fullDate: dateStr
      };
    });
  }, [heatmapData, language]);

  // 2. Habit Consistency Data (Last 14 Days)
  const habitConsistencyData = useMemo(() => {
    const interval = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date(),
    });

    return interval.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dailyLogs = habitLogs.filter(log => log.date === dateStr);
      const completed = dailyLogs.filter(log => log.status === 'DONE').length;
      const total = habits.length || 1;
      return {
        name: format(date, 'MM/dd'),
        rate: Math.round((completed / total) * 100),
      };
    });
  }, [habitLogs, habits]);

  // 3. Goal Distribution
  const goalDistData = useMemo(() => {
    const categories: Record<string, number> = {};
    goals.forEach(g => {
      categories[g.category] = (categories[g.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [goals]);

  // 4. Mood Analytics
  const moodData = useMemo(() => {
    const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    journalEntries.forEach(entry => {
      // Map potential 1-10 scale to 1-5 if needed, or use directly
      const m = Math.ceil(entry.mood / 2) || 3;
      moodCounts[m as keyof typeof moodCounts]++;
    });
    return [
      { name: 'Terrible', mood: 1, count: moodCounts[1] },
      { name: 'Bad', mood: 2, count: moodCounts[2] },
      { name: 'Neutral', mood: 3, count: moodCounts[3] },
      { name: 'Good', mood: 4, count: moodCounts[4] },
      { name: 'Excellent', mood: 5, count: moodCounts[5] },
    ].filter(d => d.count > 0 || true); // Keep all to show distribution
  }, [journalEntries]);

  const moodEmojis = ['😞', '🙁', '😐', '🙂', '😄'];

  return (
    <div className="h-full bg-slate-950 overflow-y-auto pb-32 scrollbar-hide">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em] mb-3 block">Neural_Matrix // Intelligence</span>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase">{t('analytics')}</h1>
           </div>
           <div className="flex gap-4 md:gap-8 bg-slate-900/50 border border-white/[0.03] p-4 md:p-6 rounded-3xl backdrop-blur-xl">
              <div>
                 <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Consistency_Index</span>
                 <span className="text-2xl font-mono font-black text-brand-primary">84.2%</span>
              </div>
              <div className="w-px h-10 bg-white/[0.05]" />
              <div>
                 <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Delta_Growth</span>
                 <span className="text-2xl font-mono font-black text-emerald-500">+12%</span>
              </div>
           </div>
        </section>

        {/* Top Grid: Weekly Growth & Habit Consistency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
           
           {/* Weekly Growth Bar Chart */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="command-card min-h-[400px] flex flex-col"
           >
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Zap className="text-brand-primary" size={20} />
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">{t('weekly_growth')}</h3>
                 </div>
                 <span className="text-[10px] font-mono text-slate-600">UNIT: PTS</span>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#ffffff05' }}
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#10b981', fontWeight: 900 }}
                    />
                    <Bar 
                      dataKey="points" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

           {/* Habit Consistency Line Chart */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="command-card min-h-[400px] flex flex-col"
           >
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <TrendingUp className="text-blue-500" size={20} />
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">{t('habit_consistency_label')}</h3>
                 </div>
                 <span className="text-[10px] font-mono text-slate-600">UNIT: %</span>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={habitConsistencyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 900 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, shadow: '0 0 10px #3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

        </div>

        {/* Bottom Grid: Goal Distribution & Mood Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
           
           {/* Goal Distribution Donut Chart */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="command-card min-h-[350px] flex flex-col"
           >
              <div className="flex items-center gap-3 mb-8">
                 <Target className="text-purple-500" size={20} />
                 <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">{t('goal_distribution')}</h3>
              </div>
              <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="w-full h-[200px] md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={goalDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {goalDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-1/2">
                  {goalDistData.length > 0 ? goalDistData.map((d, i) => (
                    <div key={d.name} className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-white/[0.03]">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                       </div>
                       <span className="text-sm font-mono font-black text-white">{d.value}</span>
                    </div>
                  )) : (
                    <div className="text-[10px] font-mono text-slate-600 italic">No strategic objectives logged...</div>
                  )}
                </div>
              </div>
           </motion.div>

           {/* Mood Analytics Bar Chart */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="command-card min-h-[350px] flex flex-col"
           >
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Brain className="text-rose-500" size={20} />
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">{t('mood_analysis')}</h3>
                 </div>
                 <AlertCircle size={14} className="text-slate-700" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-end gap-2 h-[180px] mb-6">
                    {moodData.map((d, i) => {
                       const max = Math.max(...moodData.map(md => md.count), 1);
                       const pct = (d.count / max) * 100;
                       return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                             <div className="w-full relative flex flex-col justify-end h-full"> 
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${pct}%` }}
                                  className={`w-full rounded-t-lg bg-gradient-to-t from-rose-500/10 to-rose-500/40 border-t border-rose-500/30 group-hover:from-rose-500/20 group-hover:to-rose-500/60 transition-all`}
                                />
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                   {d.count}
                                </div>
                             </div>
                             <span className="text-xl">{moodEmojis[i]}</span>
                          </div>
                       );
                    })}
                 </div>
                 <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest text-center leading-relaxed">
                    Frequency distribution of neural phases recorded in the Strategic Journal.
                 </p>
              </div>
           </motion.div>

        </div>

        {/* Global Achievement Pulse */}
        <section className="command-card bg-gradient-to-r from-slate-900 to-slate-900/40 flex items-center justify-between group">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-xl shadow-brand-primary/5 group-hover:scale-110 transition-transform">
                 <Zap size={28} />
              </div>
              <div>
                 <h4 className="text-xl md:text-2xl font-display font-black text-white tracking-tight uppercase">Operational Velocity</h4>
                 <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Growth sequence prioritized: Next Objective in 48 hours.</p>
              </div>
           </div>
           <button className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white transition-all">
              <ChevronRight size={24} />
           </button>
        </section>

      </div>
    </div>
  );
}
