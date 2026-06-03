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
        
        <h2 className="text-4xl font-display font-black text-white mb-4 tracking-tighter">Localized Instance</h2>
        <p className="text-slate-500 text-base max-w-sm mb-12 leading-relaxed">
          Your evolution is currently tethered to this local hardware. Authenticate to establish a multi-node cloud sync.
        </p>
        
        <button 
          onClick={() => setShowAuth(true)}
          className="w-full max-w-xs bg-emerald-500 text-slate-950 font-black px-10 py-6 rounded-[2.5rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/10"
        >
          Initialize Cloud Sync
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
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto scrollbar-hide pb-32">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Identity</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter">Profile</h1>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/10 hover:bg-rose-500 hover:text-slate-950 transition-all"
        >
          <LogOut size={22} />
        </button>
      </header>

      <div className="space-y-10">
        {/* Prime Identity Card */}
        <div className="bg-slate-900 border border-white/5 p-10 rounded-[4rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-8 mb-10 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-[2.5rem] flex items-center justify-center text-slate-950 text-4xl font-display font-black shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-500/10">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-display font-black text-white tracking-tighter mb-1">
                {user?.email?.split('@')[0]}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-full border border-white/5">
                <Cloud size={14} className="text-emerald-500" />
                Multi-Node Active
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <IdentityMetric label="Activation" value={new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} icon={<Calendar size={14} />} />
            <IdentityMetric label="Tier" value="Prime Operator" icon={<Award size={14} />} />
          </div>
        </div>

        {/* Global Configuration */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-1.5 h-6 bg-slate-800 rounded-full" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Global Configuration</h3>
          </div>
          
          <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] overflow-hidden">
             <MenuButton icon={<Mail />} label="Communication Hub" sub="Change archival email address" />
             <MenuButton icon={<Bell />} label="Alert Management" sub="Notification threshold & triggers" />
             <MenuButton icon={<Lock />} label="Instance Security" sub="Factor-2 authentication & keys" />
             <MenuButton icon={<Globe />} label="Data Residency" sub="Regional storage preferences" />
             
             <button 
                onClick={onDevRequest}
                className="w-full p-8 flex items-center justify-between hover:bg-emerald-500/5 transition-all group"
              >
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-slate-950 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Activity size={24} />
                   </div>
                   <div className="text-left">
                     <div className="text-white text-lg font-bold group-hover:text-emerald-400">Developer Console</div>
                     <div className="text-slate-500 text-xs font-medium uppercase tracking-widest">Internal Health Metrics</div>
                   </div>
                </div>
                <ChevronRight size={20} className="text-slate-800 group-hover:text-white transition-all" />
              </button>
          </div>
        </section>

        {/* System Details */}
        <section className="px-6 py-10 rounded-[3rem] bg-slate-900/30 border border-white/5 border-dashed text-center">
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2">GrowthOS Kernel v4.0.2-RC1</p>
           <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Built for High-Level Execution</p>
        </section>
      </div>
    </div>
  );
}

function IdentityMetric({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/5">
       <div className="flex items-center gap-2 mb-2 text-slate-600">
          {icon}
          <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <div className="text-white font-black text-lg font-display">{value}</div>
    </div>
  );
}

function MenuButton({ icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <button className="w-full p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all border-b border-white/[0.03] group last:border-0">
      <div className="flex items-center gap-5">
         <div className="w-14 h-14 bg-slate-950 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
            {React.cloneElement(icon, { size: 22 })}
         </div>
         <div className="text-left">
           <div className="text-white text-lg font-bold">{label}</div>
           <div className="text-slate-600 text-xs font-medium">{sub}</div>
         </div>
      </div>
      <ChevronRight size={20} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
