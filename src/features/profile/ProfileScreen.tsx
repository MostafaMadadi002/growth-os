import React, { useState, useEffect } from 'react';
import { 
  User, LogOut, Cloud, CloudOff, Shield, Mail, Calendar, 
  Award, Activity, Settings, Bell, Lock, Globe, ChevronRight,
  GraduationCap, Terminal, Flame, Info
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { useActivityStore } from '../../core/stores/activityStore';
import { motion, AnimatePresence } from 'motion/react';
import AuthScreen from '../auth/AuthScreen';

interface ProfileProps {
  onDevRequest?: () => void;
}

export default function ProfileScreen({ onDevRequest }: ProfileProps) {
  const { user, signOut, isLoading } = useAuthStore();
  const { activeRole, setActiveRole } = useAppStore();
  const { activities, fetchActivities } = useActivityStore();
  const { t, language } = useI18n();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
      </div>
    );
  }

  // Simplified Heatmap Mock (52 weeks x 7 days)
  const heatmapData = Array.from({ length: 52 * 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (52 * 7 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayActivity = activities.filter(a => a.date === dStr);
    return { date: dStr, intensity: Math.min(dayActivity.length, 4) };
  });

  if (!user && !showAuth) {
    return (
      <div className="flex flex-col h-full bg-slate-950 p-10 items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center mb-10 border border-white/5 relative"
        >
          <div className="absolute inset-0 bg-rose-500/10 rounded-[3rem] blur-2xl animate-pulse" />
          <CloudOff size={48} className="text-slate-600 relative z-10" />
        </motion.div>
        
        <h2 className="text-4xl font-display font-black text-white mb-4 tracking-tighter">{t('localized_instance')}</h2>
        <p className="text-slate-500 text-base max-w-sm mb-12 leading-relaxed">
          {t('local_evolution_desc')}
        </p>
        
        <button 
          onClick={() => setShowAuth(true)}
          className="w-full max-w-xs bg-emerald-500 text-slate-950 font-black px-10 py-6 rounded-[2.5rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/10"
        >
          {t('initialize_sync')}
        </button>
      </div>
    );
  }

  const Roles = [
    { id: UserRole.STUDENT, icon: <GraduationCap />, label: t('student_role'), color: 'bg-indigo-500', sub: t('educational_objectives') },
    { id: UserRole.TRADER, icon: <Terminal />, label: t('trader_role'), color: 'bg-emerald-500', sub: t('technical_journal') },
    { id: UserRole.ATHLETE, icon: <Flame />, label: t('athlete_role'), color: 'bg-rose-500', sub: t('physical_metrics') },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 overflow-y-auto scrollbar-hide pb-40">
      
      <header className="mb-12 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">GrowthOS // System_Level: {Math.floor(activities.length / 10) + 1}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">{t('profile')}</h1>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-white/5 px-6 py-4 rounded-2xl flex flex-col items-end">
              <span className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">{t('total_xp')}</span>
              <span className="text-xl font-mono font-black text-brand-primary">{activities.length * 10}</span>
           </div>
           <button 
             onClick={() => signOut()}
             className="p-4 bg-rose-500/5 text-rose-500 rounded-2xl border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
           >
             <LogOut size={20} />
           </button>
        </div>
      </header>

      <div className="space-y-12">
        
        {/* Growth Heatmap (System Contribution Graph) */}
        <section className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] pointer-events-none" />
           <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-display font-black text-white tracking-tight uppercase mb-1">{t('growth_heatmap')}</h3>
              <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('system_contributions')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {heatmapData.map((day, i) => (
              <motion.div 
                key={i} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.001 }}
                title={`${day.date}: ${day.intensity} activities`}
                className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-sm transition-colors duration-500 ${
                  day.intensity === 0 ? 'bg-slate-900' :
                  day.intensity === 1 ? 'bg-brand-primary/20' :
                  day.intensity === 2 ? 'bg-brand-primary/40' :
                  day.intensity === 3 ? 'bg-brand-primary/70' :
                  'bg-brand-primary'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-8 text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest px-1">
             <span>{t('weekly_summary')} // 365_Day_Window</span>
             <div className="flex items-center gap-2">
                <span>{language === 'fa' ? 'کمتر' : 'Less'}</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                  <div className="w-2 h-2 bg-brand-primary/20 rounded-xs" />
                  <div className="w-2 h-2 bg-brand-primary/40 rounded-xs" />
                  <div className="w-2 h-2 bg-brand-primary rounded-xs" />
                </div>
                <span>{language === 'fa' ? 'بیشتر' : 'More'}</span>
             </div>
          </div>
        </section>

        {/* System Roots selection */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-mono font-black text-slate-600 uppercase tracking-widest">{t('select_role')}</h3>
            <div className="h-[1px] flex-1 bg-white/[0.03]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Roles.map((role) => (
              <button 
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-500 text-left group ${
                  activeRole === role.id 
                    ? `bg-slate-900 border-white/10 ring-2 ring-${role.color.replace('bg-', '')}/30` 
                    : 'bg-slate-900/40 border-white/[0.03] opacity-40 hover:opacity-100'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                   activeRole === role.id ? `${role.color} text-slate-950 scale-110 shadow-2xl` : 'bg-slate-950 text-slate-600 group-hover:bg-slate-800'
                }`}>
                   {React.cloneElement(role.icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
                </div>
                <h4 className={`text-xl font-display font-black tracking-tight mb-2 ${activeRole === role.id ? 'text-white' : 'text-slate-500'}`}>{role.label}</h4>
                <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">{role.sub}</p>
                
                {activeRole === role.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className={`absolute top-6 right-6 w-3 h-3 rounded-full ${role.color} shadow-[0_0_15px_currentColor]`}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* System Metrics (Summary for the active root) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('branch_goals')} value="12" sub="85% Done" />
           <MetricCard label={t('branch_habits')} value="24" sub="92% Strength" />
           <MetricCard label={t('branch_notes')} value="156" sub="Knowledge Nodes" />
           <MetricCard label={t('system_level')} value={String(Math.floor(activities.length / 10) + 1)} sub="Core Stability" />
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="bg-slate-900/50 border border-white/[0.03] p-8 rounded-3xl group hover:border-white/10 transition-all">
       <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest block mb-4">{label}</span>
       <div className="text-4xl font-display font-black text-white mb-2 group-hover:text-brand-primary transition-colors">{value}</div>
       <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{sub}</div>
    </div>
  );
}

function MenuButton({ icon, label, sub, onClick }: { icon: any, label: string, sub: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-8 md:p-12 flex items-center justify-between hover:bg-white/[0.01] transition-all group overflow-hidden relative"
    >
      <div className="flex items-center gap-8 relative z-10 text-left">
         <div className="w-14 h-14 bg-slate-950 border border-white/[0.04] rounded-2xl flex items-center justify-center text-slate-700 group-hover:text-brand-secondary transition-all">
            {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
         </div>
         <div>
           <div className="text-white text-xl font-display font-black tracking-tight mb-1">{label}</div>
           <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{sub}</div>
         </div>
      </div>
      <ChevronRight size={20} className="text-slate-900 group-hover:text-white group-hover:translate-x-1 transition-all relative z-10" />
    </button>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
