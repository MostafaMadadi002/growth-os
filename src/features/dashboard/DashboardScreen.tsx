import React from 'react';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { 
  Flame, Target, Zap, ChevronRight, TrendingUp, 
  Terminal, GraduationCap, ArrowUpRight, Activity,
  Layers, Wallet
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardScreen() {
  const { currentRoot, studentData, traderData } = useAppStore();
  const { t } = useI18n();

  const isTrader = currentRoot === UserRole.TRADER;

  if (isTrader) {
    // Trader Dashboard View
    const totalTrades = traderData.trades.length;
    const winTrades = traderData.trades.filter(t => t.pnl_amount > 0).length;
    const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
    const totalPnl = traderData.trades.reduce((acc, curr) => acc + curr.pnl_amount, 0);

    return (
      <div className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Node_Stream // Trader_Mode</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">Terminal.</h1>
          </div>
          <div className="flex gap-8 bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
             <div className="text-right">
                <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest block mb-1">Session_PnL</span>
                <span className={`text-2xl font-mono font-black ${totalPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl}
                </span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <MetricCard label="Win Rate" value={`${winRate}%`} sub="Tactical Accuracy" icon={<Activity size={18} />} color="text-emerald-500" bg="bg-emerald-500/10" />
           <MetricCard label="Total Ops" value={String(totalTrades)} sub="Trade Frequency" icon={<Layers size={18} />} color="text-blue-500" bg="bg-blue-500/10" />
           <MetricCard label="Active Margin" value="$12,450" sub="Capital Exposure" icon={<Wallet size={18} />} color="text-brand-primary" bg="bg-emerald-500/10" />
        </div>

        <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Recent Activity Feed</h3>
              <button className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">View History <ChevronRight size={12} /></button>
           </div>
           <div className="space-y-4">
              {traderData.trades.slice(-4).reverse().map(trade => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
              {traderData.trades.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">No market activity detected in node</p>
                </div>
              )}
           </div>
        </section>
      </div>
    );
  }

  // Student Dashboard View
  const activeGoalsCount = studentData.goals.length;
  const completedHabitsToday = studentData.habits.filter(h => h.weekLog[new Date().getDay()] === 1).length;
  const habitRate = studentData.habits.length > 0 ? Math.round((completedHabitsToday / studentData.habits.length) * 100) : 0;

  return (
    <div className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Core_Link // Student_Mode</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">Studio.</h1>
        </div>
        <div className="flex gap-8 bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
           <div className="text-right">
              <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest block mb-1">Growth_Score</span>
              <span className="text-2xl font-mono font-black text-brand-primary">1,250 PTS</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[300px] relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-10 opacity-10"><Target size={120} /></div>
            <div className="relative z-10">
               <h3 className="text-3xl font-display font-black text-white tracking-tight leading-none uppercase">{t('branch_goals')}</h3>
               <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-2">Active Strategic Objectives</p>
            </div>
            <div className="relative z-10 flex items-end justify-between border-t border-white/5 pt-8">
               <div className="text-6xl font-display font-black text-white leading-none">{activeGoalsCount}</div>
               <div className="text-brand-primary flex items-center gap-2 font-mono font-black text-[10px] uppercase">Trajectory Optimal <ArrowUpRight size={16} /></div>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[300px] relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-10 opacity-10"><Activity size={120} /></div>
            <div className="relative z-10">
               <h3 className="text-3xl font-display font-black text-white tracking-tight leading-none uppercase">{t('branch_habits')}</h3>
               <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-2">{t('habit_consistency_label')}</p>
            </div>
            <div className="relative z-10 flex items-end justify-between border-t border-white/5 pt-8">
               <div className="text-6xl font-display font-black text-white leading-none">{habitRate}%</div>
               <div className="flex gap-1.5 mb-2">
                  {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-6 rounded-full ${i <= 3 ? 'bg-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`} />)}
               </div>
            </div>
         </motion.div>
      </div>

      <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
         <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Active Goals Feed</h3>
            <button className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">Expand Node <ChevronRight size={12} /></button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData.goals.slice(0, 4).map(goal => (
              <div key={goal.id} className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl group hover:border-brand-primary transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <h4 className="text-base font-black text-white uppercase group-hover:text-brand-primary transition-colors">{goal.title}</h4>
                    <span className="text-[10px] font-mono font-black text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-lg border border-brand-primary/20">{goal.progress}%</span>
                 </div>
                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} className="h-full bg-brand-primary" />
                 </div>
              </div>
            ))}
            {studentData.goals.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">No strategic objectives found</p>
                </div>
            )}
         </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, sub, icon, color, bg }: { label: string, value: string, sub: string, icon: React.ReactNode, color: string, bg: string }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] group hover:border-white/10 transition-all relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-24 h-24 ${bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
       <div className="flex justify-between items-start mb-6 relative z-10">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{label}</span>
          <div className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>
             {icon}
          </div>
       </div>
       <div className="text-5xl font-display font-black text-white tracking-tighter mb-2 relative z-10 group-hover:scale-105 transition-transform origin-left">{value}</div>
       <div className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest relative z-10">{sub}</div>
    </div>
  );
}

function TradeCard({ trade }: { trade: any }) {
  return (
    <div className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-slate-900 transition-all">
       <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trade.pnl_amount >= 0 ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e]'}`}>
             {trade.pnl_amount >= 0 ? <TrendingUp size={20} /> : <Zap size={20} className="rotate-180" />}
          </div>
          <div className="text-left">
             <p className="text-sm font-black text-white uppercase">{trade.market}</p>
             <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mt-1">{trade.date.split('T')[0]} // SN_ID: {trade.id.slice(0, 8)}</p>
          </div>
       </div>
       <div className="text-right">
          <p className={`text-xl font-display font-black ${trade.pnl_amount >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {trade.pnl_amount >= 0 ? '+' : ''}${Math.abs(trade.pnl_amount)}
          </p>
          <p className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">Settled_Result</p>
       </div>
    </div>
  );
}
