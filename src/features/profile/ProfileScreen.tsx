import React, { useState, useMemo } from 'react';
import { 
  User, GraduationCap, Terminal, Globe, ChevronRight, 
  LogOut, Shield, Zap, Activity, Target, Trash2, 
  Settings2, BarChart3, TrendingUp, Wallet, PieChart,
  GitBranch, Box, Database, Network
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart as RePieChart, Pie
} from 'recharts';

type ManagementTab = 'GOALS' | 'HABITS' | 'TRADES';

export default function ProfileScreen() {
  const { t, language, setLanguage } = useI18n();
  const { 
    currentRoot, setRoot, setLanguage: setStoreLanguage, 
    studentData, traderData,
    deleteStudentGoal, deleteStudentHabit, deleteTraderTrade
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<ManagementTab>('GOALS');

  const handleLanguageToggle = () => {
    const newLang = language === 'fa' ? 'EN' : 'FA';
    setStoreLanguage(newLang);
    setLanguage(newLang.toLowerCase() as 'fa' | 'en');
  };

  // 1. Comprehensive Stats Calculation
  const stats = useMemo(() => {
    const goalXp = studentData.goals.reduce((acc, g) => acc + g.progress, 0);
    const habitXp = studentData.habits.reduce((acc, h) => acc + h.weekLog.filter(v => v === 1).length * 10, 0);
    const tradeCount = traderData.trades.length;
    const totalPoints = goalXp + habitXp + (tradeCount * 25);
    const level = Math.floor(totalPoints / 250) + 1;
    const progressPct = ((totalPoints % 250) / 250) * 100;

    return { level, progressPct, totalPoints, goalXp, habitXp, tradeCount };
  }, [studentData, traderData]);

  // 2. Branch Distribution Data
  const branchData = [
    { name: 'Educational', value: stats.goalXp, color: '#6366f1' },
    { name: 'Behavioral', value: stats.habitXp, color: '#f43f5e' },
    { name: 'Financial', value: stats.tradeCount * 25, color: '#10b981' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
        
        {/* --- SECTION 1: SYSTEM IDENTITY --- */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-10"
        >
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-28 h-28 bg-slate-900 border border-white/10 rounded-[2.8rem] flex items-center justify-center relative shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <div className="absolute inset-0 bg-brand-primary/5 rounded-[2.8rem] blur-xl group-hover:bg-brand-primary/10 transition-colors" />
                <User size={48} className="text-brand-primary relative z-10" />
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-slate-950 flex items-center justify-center shadow-xl ${currentRoot === UserRole.STUDENT ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  {currentRoot === UserRole.STUDENT ? <GraduationCap size={16} className="text-white" /> : <Terminal size={16} className="text-white" />}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em]">Node_Stream // System_Admin</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
              <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">Management.</h1>
            </div>
          </div>

          <div className="flex gap-4">
             <button onClick={handleLanguageToggle} className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl group">
                <span className="text-xs font-mono font-black group-hover:text-brand-primary transition-colors">{language.toUpperCase()}</span>
             </button>
             <button className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
                <Settings2 size={24} />
             </button>
          </div>
        </motion.header>

        {/* --- SECTION 2: COMPREHENSIVE INTELLIGENCE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Level Progression */}
           <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 p-10 opacity-[0.03] rotate-12"><Box size={300} /></div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">Evolution_Status</h3>
                 <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest leading-loose">
                    {language === 'fa' ? 'تجمع تمام داده‌های ریشه و شاخه در یک سنجه واحد' : 'Aggregating all root & branch data into a unified stability index'}
                 </p>
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                       <span className="text-7xl font-display font-black text-white leading-none tracking-tighter">{stats.level}</span>
                       <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Global_Level</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest block mb-1">{stats.totalPoints} XP</span>
                       <span className="text-[9px] font-mono text-slate-700 uppercase">Trajectory Optimal</span>
                    </div>
                 </div>
                 <div className="w-full h-3 bg-slate-950 rounded-full border border-white/5 p-[2px]">
                    <motion.div 
                      className="h-full bg-brand-primary rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.progressPct}%` }}
                      transition={{ duration: 1.5, ease: 'circOut' }}
                    />
                 </div>
              </div>
           </div>

           {/* Branch Distribution (Pie Chart) */}
           <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-full h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={branchData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {branchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                 <h4 className="text-sm font-mono font-black text-white uppercase tracking-[0.2em] mb-1">Nexus_Balance</h4>
                 <div className="flex gap-4 justify-center mt-4">
                    {branchData.map(b => (
                       <div key={b.name} className="flex flex-col items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: b.color }} />
                          <span className="text-[8px] font-mono font-black text-slate-600 uppercase">{b.name.slice(0, 3)}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* --- SECTION 3: MANAGEMENT CENTER --- */}
        <section className="bg-slate-900/30 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col min-h-[600px]">
           <div className="p-10 border-b border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <GitBranch className="text-indigo-400" size={18} />
                   <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Logical Core Distribution</h3>
                </div>
                <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.2em]">Full Database CRUD Access</p>
              </div>
              <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto max-w-full">
                 <TabButton active={activeTab === 'GOALS'} onClick={() => setActiveTab('GOALS')} label={t('branch_goals')} />
                 <TabButton active={activeTab === 'HABITS'} onClick={() => setActiveTab('HABITS')} label={t('branch_habits')} />
                 <TabButton active={activeTab === 'TRADES'} onClick={() => setActiveTab('TRADES')} label={t('trades') || 'Trades'} />
              </div>
           </div>

           <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <AnimatePresence mode="wait">
                 {activeTab === 'GOALS' && (
                   <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      {studentData.goals.map(goal => (
                        <ListItem key={goal.id} title={goal.title} meta={`${goal.progress}% Efficiency`} onDelete={() => deleteStudentGoal(goal.id)} />
                      ))}
                      {studentData.goals.length === 0 && <EmptyState label="No Strategic Goals Recorded" />}
                   </motion.div>
                 )}
                 {activeTab === 'HABITS' && (
                   <motion.div key="habits" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      {studentData.habits.map(habit => (
                        <ListItem key={habit.id} title={habit.title} meta={`${habit.type.toUpperCase()}_LOG_COORD`} onDelete={() => deleteStudentHabit(habit.id)} />
                      ))}
                      {studentData.habits.length === 0 && <EmptyState label="No Neural Habits Mapped" />}
                   </motion.div>
                 )}
                 {activeTab === 'TRADES' && (
                   <motion.div key="trades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      {traderData.trades.map(trade => (
                        <ListItem key={trade.id} title={trade.market} meta={`$${trade.pnl_amount} Net_Result`} onDelete={() => deleteTraderTrade(trade.id)} isNegative={trade.pnl_amount < 0} />
                      ))}
                      {traderData.trades.length === 0 && <EmptyState label="No Market Transmissions Logged" />}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </section>

        {/* --- SECTION 4: IDENTITY SECURITY --- */}
        <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-2xl">
                 <Shield size={28} />
              </div>
              <div>
                 <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">Security_Core</h4>
                 <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">Status: Stable and Persistent</p>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setRoot(UserRole.STUDENT)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${currentRoot === UserRole.STUDENT ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-slate-950 border-white/5 text-slate-500 hover:bg-slate-900'}`}
              >
                 <GraduationCap size={16} />
                 <span className="text-[10px] font-mono font-black uppercase tracking-widest">{t('student_mode').split(' ')[0]}</span>
              </button>
              <button 
                onClick={() => setRoot(UserRole.TRADER)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${currentRoot === UserRole.TRADER ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'bg-slate-950 border-white/5 text-slate-500 hover:bg-slate-900'}`}
              >
                 <Terminal size={16} />
                 <span className="text-[10px] font-mono font-black uppercase tracking-widest">{t('trader_mode').split(' ')[0]}</span>
              </button>
           </div>
        </section>

        {/* --- SECTION 5: SYSTEM TERMINATION --- */}
        <footer className="text-center pt-8">
           <button className="inline-flex items-center gap-4 text-rose-500 hover:text-rose-400 transition-colors group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em]">Power Down Session</span>
           </button>
           <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-[0.4em]">GrowthOS // v2.1.0 // Cluster_Mode</span>
           </div>
        </footer>

      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-brand-primary text-slate-950 shadow-2xl' : 'text-slate-600 hover:text-slate-200'}`}
    >
      {label}
    </button>
  );
}

function ListItem({ title, meta, onDelete, isNegative }: { title: string, meta: string, onDelete: () => void, isNegative?: boolean }) {
  return (
    <div className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-slate-900 hover:border-brand-primary/30 transition-all shadow-sm">
       <div className="flex items-center gap-6">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-white/10 group-hover:bg-brand-primary group-hover:border-brand-primary/50 transition-all transition-colors" />
          <div>
            <p className="text-base font-display font-black text-white uppercase leading-none mb-1.5 group-hover:text-brand-primary transition-colors">{title}</p>
            <p className={`text-[10px] font-mono font-black uppercase tracking-widest ${isNegative ? 'text-rose-500' : 'text-slate-600'}`}>{meta}</p>
          </div>
       </div>
       <button onClick={onDelete} className="w-12 h-12 flex items-center justify-center text-slate-800 hover:text-rose-500 transition-colors bg-slate-900 rounded-2xl hover:shadow-xl active:scale-90">
          <Trash2 size={18} />
       </button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
       <Database size={48} className="mx-auto mb-6 text-slate-800 opacity-20" />
       <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">{label}</p>
    </div>
  );
}
