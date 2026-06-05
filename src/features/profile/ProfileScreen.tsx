import React, { useState, useMemo } from 'react';
import { 
  User, GraduationCap, Terminal, Globe, ChevronRight, 
  LogOut, Shield, Zap, Activity, Target, Trash2, 
  Settings2, BarChart3, TrendingUp
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

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

  // Systematic Level Calculation (All Progress Integrated)
  const stats = useMemo(() => {
    const goalXp = studentData.goals.reduce((acc, g) => acc + g.progress, 0);
    const habitXp = studentData.habits.reduce((acc, h) => acc + h.weekLog.filter(v => v === 1).length * 10, 0);
    const tradeCount = traderData.trades.length;
    const totalPoints = goalXp + habitXp + (tradeCount * 25);
    const level = Math.floor(totalPoints / 250) + 1;
    const nextLevelXp = 250;
    const currentProgress = totalPoints % 250;
    const progressPct = (currentProgress / nextLevelXp) * 100;

    return { level, progressPct, totalPoints };
  }, [studentData, traderData]);

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
        
        {/* 1. System Identity Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
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
                 <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em]">{t('system_core')}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              </div>
              <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">User_Node.</h1>
              <div className="flex items-center gap-4 mt-4">
                 <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">LVL_{stats.level}</div>
                 <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[9px] font-mono font-black text-brand-primary uppercase tracking-widest">{stats.totalPoints}_XP</div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="w-full md:w-64 space-y-3">
             <div className="flex justify-between text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">
                <span>Core_Stability</span>
                <span>{Math.round(stats.progressPct)}%</span>
             </div>
             <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progressPct}%` }}
                  className="h-full bg-brand-primary rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                />
             </div>
          </div>
        </header>

        {/* 2. Global Metrics Nexus */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricBox label={t('branch_goals')} value={studentData.goals.length} sub="Active Nodes" />
           <MetricBox label={t('branch_habits')} value={studentData.habits.length} sub="Neural Paths" />
           <MetricBox label={t('trades') || 'Trades'} value={traderData.trades.length} sub="Market Ops" />
           <MetricBox label="Stability" value={`${Math.min(100, Math.floor(stats.totalPoints / 10))}%`} sub="System Rank" />
        </section>

        {/* 3. Core Switching Mechanism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <CoreButton 
             active={currentRoot === UserRole.STUDENT} 
             onClick={() => setRoot(UserRole.STUDENT)}
             icon={<GraduationCap />}
             label={t('student_mode')}
             color="indigo"
           />
           <CoreButton 
             active={currentRoot === UserRole.TRADER} 
             onClick={() => setRoot(UserRole.TRADER)}
             icon={<Terminal />}
             label={t('trader_mode')}
             color="emerald"
           />
        </div>

        {/* 4. The Nexus Management Center (CRUD) */}
        <section className="bg-slate-900/30 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col min-h-[500px]">
           <div className="p-8 border-b border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{t('global_metrics')}</h3>
                <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Operational Database Management</p>
              </div>
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
                 <TabButton active={activeTab === 'GOALS'} onClick={() => setActiveTab('GOALS')} label={t('branch_goals')} />
                 <TabButton active={activeTab === 'HABITS'} onClick={() => setActiveTab('HABITS')} label={t('branch_habits')} />
                 <TabButton active={activeTab === 'TRADES'} onClick={() => setActiveTab('TRADES')} label={t('trades')} />
              </div>
           </div>

           <div className="flex-1 p-6 md:p-8">
              <AnimatePresence mode="wait">
                 {activeTab === 'GOALS' && (
                   <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      {studentData.goals.map(goal => (
                        <ListItem key={goal.id} title={goal.title} meta={`${goal.progress}% Done`} onDelete={() => deleteStudentGoal(goal.id)} />
                      ))}
                      {studentData.goals.length === 0 && <EmptyState label="No Strategic Goals Recorded" />}
                   </motion.div>
                 )}
                 {activeTab === 'HABITS' && (
                   <motion.div key="habits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      {studentData.habits.map(habit => (
                        <ListItem key={habit.id} title={habit.title} meta={`${habit.type === 'good' ? 'POS' : 'NEG'}`} onDelete={() => deleteStudentHabit(habit.id)} />
                      ))}
                      {studentData.habits.length === 0 && <EmptyState label="No Neural Habits Mapped" />}
                   </motion.div>
                 )}
                 {activeTab === 'TRADES' && (
                   <motion.div key="trades" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      {traderData.trades.map(trade => (
                        <ListItem key={trade.id} title={trade.market} meta={`$${trade.pnl_amount}`} onDelete={() => deleteTraderTrade(trade.id)} isNegative={trade.pnl_amount < 0} />
                      ))}
                      {traderData.trades.length === 0 && <EmptyState label="No Market Transmissions Logged" />}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </section>

        {/* 5. System Configuration */}
        <section className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] divide-y divide-white/[0.03] overflow-hidden">
           <ConfigRow icon={<Globe />} label={t('language')} val={language.toUpperCase()} onClick={handleLanguageToggle} />
           <ConfigRow icon={<Shield />} label={t('security')} val="SECURED" />
           <ConfigRow icon={<Settings2 />} label={t('diagnostics')} val="STABLE" />
           <button className="w-full p-8 flex items-center justify-between text-rose-500 hover:bg-rose-500/5 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center"><LogOut size={22} /></div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase">Terminate Session</p>
                  <p className="text-[9px] font-mono text-rose-500/50 uppercase tracking-widest mt-1">Flush environment state</p>
                </div>
              </div>
              <ChevronRight size={18} />
           </button>
        </section>

      </div>
    </div>
  );
}

function MetricBox({ label, value, sub }: { label: string, value: number | string, sub: string }) {
  return (
    <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] group hover:border-brand-primary/30 transition-all cursor-default">
       <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest block mb-4 group-hover:text-brand-primary transition-colors">{label}</span>
       <div className="text-4xl font-display font-black text-white group-hover:scale-110 transition-transform origin-left">{value}</div>
       <div className="text-[8px] font-mono font-bold text-slate-700 uppercase tracking-[0.2em] mt-2">{sub}</div>
    </div>
  );
}

function CoreButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: any, label: string, color: string }) {
  const activeStyles = color === 'indigo' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 border-indigo-500' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 border-emerald-500';
  
  return (
    <button 
      onClick={onClick}
      className={`p-10 rounded-[3rem] border transition-all duration-500 text-left relative overflow-hidden group ${active ? activeStyles : 'bg-slate-900/40 border-white/5 opacity-40 hover:opacity-100 hover:bg-slate-900'}`}
    >
       <div className={`absolute -right-10 -top-10 w-40 h-40 opacity-0 group-hover:opacity-10 blur-3xl rounded-full ${color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600'}`} />
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-all ${active ? 'bg-white/20' : 'bg-slate-800 text-slate-500 group-hover:text-white'}`}>
         {React.cloneElement(icon, { size: 28 })}
       </div>
       <h4 className="text-2xl font-display font-black uppercase tracking-tight mb-2">{label}</h4>
       <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${active ? 'text-white/60' : 'text-slate-600'}`}>
         {active ? 'CURRENT_CORE_ACTIVE' : 'SWITCH_TO_CORE'}
       </div>
    </button>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-primary text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
    >
      {label}
    </button>
  );
}

function ListItem({ title, meta, onDelete, isNegative }: { title: string, meta: string, onDelete: () => void, isNegative?: boolean }) {
  return (
    <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all shadow-sm">
       <div className="flex items-center gap-5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-brand-primary transition-colors" />
          <div>
            <p className="text-sm font-black text-white uppercase leading-none mb-1 group-hover:text-brand-primary transition-colors">{title}</p>
            <p className={`text-[9px] font-mono font-black uppercase tracking-widest ${isNegative ? 'text-rose-500' : 'text-slate-600'}`}>{meta}</p>
          </div>
       </div>
       <button onClick={onDelete} className="p-3 text-slate-800 hover:text-rose-500 transition-colors bg-slate-900 rounded-xl">
          <Trash2 size={16} />
       </button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
       <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ConfigRow({ icon, label, val, onClick }: { icon: any, label: string, val: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">{React.cloneElement(icon, { size: 20 })}</div>
        <div className="text-left">
          <p className="text-sm font-black text-white uppercase">{label}</p>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Status: Stable</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono font-black text-brand-primary uppercase px-3 py-1 bg-brand-primary/10 rounded-lg">{val}</span>
        <ChevronRight size={16} className="text-slate-800 group-hover:text-white transition-colors" />
      </div>
    </button>
  );
}
