import React, { useState } from 'react';
import { User, LogOut, Cloud, CloudOff, Shield, Mail, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { motion } from 'motion/react';
import AuthScreen from '../auth/AuthScreen';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !showAuth) {
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5">
          <CloudOff size={40} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Local Mode</h2>
        <p className="text-slate-400 text-sm max-w-xs mb-10 leading-relaxed">
          Your data is currently stored only on this device. Sign in to enable cloud backup and sync across all your devices.
        </p>
        <button 
          onClick={() => setShowAuth(true)}
          className="bg-emerald-500 text-slate-950 font-black px-10 py-4 rounded-[2rem] hover:bg-emerald-400 transition-all active:scale-95"
        >
          Enable Cloud Sync
        </button>
      </div>
    );
  }

  if (showAuth && !user) {
    return (
      <div className="h-full relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-6 left-6 z-50 bg-slate-900/50 p-2 rounded-full text-white"
        >
          Cancel
        </button>
        <AuthScreen onSuccess={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto pb-32">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Profile</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <Cloud size={12} />
              Cloud Synced
            </div>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-emerald-500/20">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-black text-xl">{user?.email?.split('@')[0]}</div>
              <div className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                <Mail size={12} />
                {user?.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-slate-950 p-4 rounded-3xl border border-white/5">
              <div className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">Joined</div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-500" />
                {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-3xl border border-white/5">
              <div className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">Account Level</div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-500" />
                Master
              </div>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4 mb-4">Account Security</h3>
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <button className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-bold">Change Email</div>
                  <div className="text-slate-500 text-[10px]">Update your login address</div>
                </div>
              </div>
            </button>
            <button className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400">
                  <Shield size={18} />
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-bold">Two-Factor Auth</div>
                  <div className="text-slate-500 text-[10px]">Add an extra layer of protection</div>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
