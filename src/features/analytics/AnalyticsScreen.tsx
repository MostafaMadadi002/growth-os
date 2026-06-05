import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Filter, Target, Activity, Zap
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export default function AnalyticsScreen() {
  const { t, language } = useI18n();
  const { currentRoot, traderData, studentData } = useAppStore();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const isTrader = currentRoot === UserRole.TRADER;

  // Trader Data Processing
  const trades = traderData.trades;
  const pnlHistory = trades.length > 0 ? trades.reduce((acc: any[], trade) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    acc.push({
      date: trade.date.split('T')[0],
      pnl: trade.pnl_amount,
      balance: lastBalance + trade.pnl_amount
    });
    return acc;
  }, []) : [{ balance: 0, date: 'N/A' }];

  const marketStats = trades.reduce((acc: Record<string, number>, trade) => {
    acc[trade.market] = (acc[trade.market] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(marketStats).map(([name, value]) => ({ name, value }));

  // Heatmap Data (Last 140 days)
  const heatmapData = Array.from({ length: 140 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (139 - i));
    const dStr = d.toISOString().split('T')[0];
    const outcome = traderData.dailyOutcomes[dStr] || { pnl: 0, count: 0 };
    return { date: dStr, ...outcome };
  });

  const selectedDayData = selectedDay ? (traderData.dailyOutcomes[selectedDay] || { pnl: 0, count: 0 }) : null;

  if (isTrader) {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
        <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-emerald-500" size={18} />
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">TRADER_CORE // FEED_ANALYTICS</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">{t('branch_charts')}</h1>
            </div>
          </header>

          {/* 1. The PnL Calendar Heatmap */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{t('streak')}</h3>
                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1">
                  Sequential performance mapping // {language === 'fa' ? 'سبز=سود، قرمز=ضرر' : 'Green=Profit, Red=Loss'}
                </p>
              </div>
              <AnimatePresence>
                {selectedDay && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-950 border border-emerald-500/20 px-5 py-3 rounded-2xl flex flex-col md:flex-row md:items-center gap-3 md:gap-6 shadow-2xl"
                  >
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono font-black text-slate-600 uppercase">Snapshot_Date</span>
                      <span className="text-xs font-mono font-black text-slate-400">{selectedDay}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-display font-black ${selectedDayData!.pnl > 0 ? 'text-emerald-400' : selectedDayData!.pnl < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                        {selectedDayData!.pnl > 0 ? '+' : ''}${Math.abs(selectedDayData!.pnl)}
                      </span>
                      <div className="w-px h-6 bg-white/5" />
                      <span className="text-xs font-mono font-black text-slate-500 uppercase">{selectedDayData!.count} {t('trades') || 'Trades'}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              {heatmapData.map((day, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedDay(day.date)}
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-sm transition-all duration-300 hover:scale-125 hover:z-10 ${
                    day.count === 0 ? 'bg-slate-900/50' :
                    day.pnl > 0 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]' :
                    day.pnl < 0 ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]' :
                    'bg-slate-700'
                  } ${selectedDay === day.date ? 'ring-2 ring-white scale-110 z-20' : ''}`}
                />
              ))}
            </div>
            
            <div className="flex justify-between items-center text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest px-1 border-t border-white/5 pt-6">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500/30 rounded-xs" /><span>PROFIT_RANGE</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-500/30 rounded-xs" /><span>LOSS_RANGE</span></div>
               </div>
               <span className="opacity-50">140_DAY_SYSTEM_DUMP</span>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* 2. Cumulative Equity Curve */}
             <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-10 h-[450px] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20"><TrendingUp size={80} /></div>
                <div className="mb-10">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Equity Curve</h3>
                  <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1">Cumulative Profit/Loss propagation</p>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pnlHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        fontFamily="JetBrains Mono" 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSze: '10px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 900 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        dot={false}
                        animationDuration={2500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </section>

             {/* 3. Market Frequency */}
             <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-10 h-[450px] flex flex-col group">
                <div className="mb-10">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Market Domain Exposure</h3>
                  <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1">Tactical frequency across exchanges</p>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#475569" 
                        fontSize={10} 
                        fontFamily="JetBrains Mono" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </section>
          </div>
        </div>
      </div>
    );
  }

  // Student Mode Analytics
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-brand-primary" size={18} />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">STUDENT_CORE // OPTIMIZATION_DUMP</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">{t('branch_charts')}</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goal Progress */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{t('branch_goals')}</h3>
                <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">Strategic Objective Propagation</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {studentData.goals.slice(0, 5).map(goal => (
                <div key={goal.id} className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-white uppercase group-hover:text-brand-primary transition-colors">{goal.title}</span>
                    <span className="text-xs font-mono font-black text-brand-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-[2px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className="h-full bg-brand-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
              {studentData.goals.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No active objectives detected</p>
                </div>
              )}
            </div>
          </section>

          {/* Habit Matrix */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{t('habit_consistency_label')}</h3>
                <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">Neural Habit formation indices</p>
              </div>
            </div>

            <div className="space-y-8">
              {studentData.habits.slice(0, 5).map(habit => {
                const completed = habit.weekLog.filter(v => v === 1).length;
                const score = (completed / 7) * 100;
                return (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl group hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${habit.type === 'good' ? 'bg-brand-primary' : 'bg-rose-500'} shadow-lg`} />
                      <div>
                        <p className="text-sm font-black text-white uppercase group-hover:text-brand-primary transition-colors">{habit.title}</p>
                        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-1">{habit.dailyTarget} {t('sessions') || 'Units'} / DAY</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex gap-1.5">
                        {habit.weekLog.map((val, idx) => (
                          <div key={idx} className={`w-2 h-2 rounded-xs transition-colors ${val === 1 ? 'bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border border-white/5'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-mono font-black text-slate-500">{Math.round(score)}%</span>
                    </div>
                  </div>
                );
              })}
              {studentData.habits.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No active routines detected</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
