import React, { useState } from 'react';
import { User, LogOut, Cloud, CloudOff, Shield, Mail, Calendar, Award, Activity, Settings, Bell, Lock, Globe, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { motion, AnimatePresence } from 'motion/react';
import AuthScreen from '../auth/AuthScreen';

interface ProfileProps {
  onDevRequest?: () => void;
}

export default function ProfileScreen({ onDevRequest }: ProfileProps) {
  const { user, signOut, isLoading } = useAuthStore();
  const { t } = useI18n();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
      </div>
    );
  }

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
        
        <h2 className="text-4xl font-display font-black text-white mb-4 tracking-tighter">{t('localized_instance') || 'Localized Instance'}</h2>
        <p className="text-slate-500 text-base max-w-sm mb-12 leading-relaxed">
          {t('local_evolution_desc') || 'Your evolution is currently tethered to this local hardware. Authenticate to establish a multi-node cloud sync.'}
        </p>
        
        <button 
          onClick={() => setShowAuth(true)}
          className="w-full max-w-xs bg-emerald-500 text-slate-950 font-black px-10 py-6 rounded-[2.5rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/10"
        >
          {t('initialize_sync') || 'Initialize Cloud Sync'}
        </button>
      </div>
    );
  }

  if (showAuth && !user) {
    return (
      <div className="h-full relative bg-slate-950">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-8 left-8 z-50 bg-slate-900 border border-white/5 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
        <AuthScreen onSuccess={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-base p-8 md:p-12 overflow-y-auto scrollbar-hide pb-40 data-grid">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Operator Identity // Personal Hub</span>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">{t('profile')}.</h1>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-16 h-16 bg-rose-500/5 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/10 hover:bg-rose-500 hover:text-slate-950 transition-all group"
        >
          <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </header>

      <div className="space-y-12">
        {/* Prime Identity Card - Industrial Style */}
        <div className="command-card group relative p-12 overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative">
            <div className="w-32 h-32 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-brand-primary text-5xl font-display font-black shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500">
               {user?.email?.[0].toUpperCase()}
               <div className="absolute inset-0 bg-brand-primary/10 blur-2xl rounded-full opacity-50" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em] bg-brand-primary/10 px-4 py-1.5 rounded-sm border border-brand-primary/20">Operational_Active</span>
              <div className="w-1 h-3 bg-slate-800 rounded-full" />
              <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest hidden md:inline">Tier_Prime_Operator</span>
            </div>
            <h2 className="text-5xl font-display font-black text-white tracking-tight leading-tight">
              {user?.email?.split('@')[0].toUpperCase()}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4 text-slate-500">
              <Mail size={14} className="text-brand-secondary" />
              <span className="text-xs font-mono font-bold">{user?.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <IdentityMetric label="Activation" value={new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} icon={<Calendar size={14} />} />
            <IdentityMetric label="Status" value="Verified" icon={<Shield size={14} />} />
          </div>
        </div>

        {/* Global Configuration */}
        <section>
          <div className="flex items-center gap-4 mb-10 px-6">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">System Control Panel</h3>
            <div className="h-[1px] flex-1 bg-white/[0.03]" />
          </div>
          
          <div className="command-card !p-0 overflow-hidden divide-y divide-white/[0.04]">
             <MenuButton icon={<Mail />} label="Communication Core" sub="Configure archival destination & recovery keys" />
             <MenuButton icon={<Bell />} label="Telemetry Config" sub="Adjust notification thresholds & priority logs" />
             <MenuButton icon={<Lock />} label="Security Protocol" sub="Multi-factor authentication & hardware tokens" />
             <MenuButton icon={<Globe />} label="Data Geometry" sub="Manage cloud residency & sync regions" />
             
             <button 
                onClick={onDevRequest}
                className="w-full p-10 flex items-center justify-between hover:bg-brand-primary/[0.02] transition-all group"
              >
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all duration-500">
                      <Activity size={24} />
                   </div>
                   <div className="text-left">
                     <div className="text-white text-xl font-display font-black tracking-tight group-hover:text-brand-primary transition-colors">System Diagnostics</div>
                     <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">Direct Kernel Access // Metrics</div>
                   </div>
                </div>
                <ChevronRight size={24} className="text-slate-850 group-hover:text-white transition-all duration-500" />
              </button>
          </div>
        </section>

        {/* System Details - Technical Style */}
        <section className="p-16 rounded-3xl border border-white/[0.04] bg-slate-950/40 relative overflow-hidden text-center backdrop-blur-sm">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-brand-primary/20" />
           <p className="text-[11px] font-mono font-black text-slate-600 uppercase tracking-[0.5em] mb-4">Growth_Command_OS // Kernel_v4.2.0-PRO_MAX</p>
           <p className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-[0.3em]">Optimized for industrial scale personal growth // High level execution only</p>
        </section>
      </div>
    </div>
  );
}

function IdentityMetric({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="bg-slate-950/50 p-6 rounded-xl border border-white/[0.03]">
       <div className="flex items-center gap-3 mb-3 text-slate-700">
          {icon}
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] pt-0.5">{label}_LOG</span>
       </div>
       <div className="text-white font-mono font-black text-xs uppercase tracking-widest">{value}</div>
    </div>
  );
}

function MenuButton({ icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <button className="w-full p-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group overflow-hidden relative">
      <div className="flex items-center gap-8 relative z-10">
         <div className="w-16 h-16 bg-slate-950 border border-white/[0.04] rounded-2xl flex items-center justify-center text-slate-700 group-hover:text-brand-secondary transition-all">
            {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 })}
         </div>
         <div className="text-left">
           <div className="text-white text-xl font-display font-black tracking-tight mb-1">{label}</div>
           <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{sub}</div>
         </div>
      </div>
      <ChevronRight size={24} className="text-slate-900 group-hover:text-white group-hover:translate-x-1 transition-all relative z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/0 to-brand-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
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
