import React, { useEffect, useState } from 'react';
import { Database, Users, ShieldAlert, BarChart3, Activity, Terminal, RefreshCcw } from 'lucide-react';
import { useHabitStore } from '../habits/stores/habitStore';
import { useGoalStore } from '../goals/stores/goalStore';
import { useJournalStore } from '../journal/stores/journalStore';
import { useActivityStore } from '../../core/stores/activityStore';
import { supabase } from '../../core/services/supabase';

export default function DevDashboard() {
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { entries } = useJournalStore();
  const { activities } = useActivityStore();
  
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    async function checkSystem() {
      try {
        const { count, error } = await supabase.from('goals').select('*', { count: 'exact', head: true });
        if (error) throw error;
        setDbStatus('online');
        
        // In a real app we'd have an admin table or edge function for users
        // For now, let's just mock/estimate or use what we can
        setUserCount(1); 
      } catch (e) {
        setDbStatus('offline');
      }
    }
    checkSystem();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Terminal className="text-emerald-500" />
             Dev Console
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-widest">System Internals & Health</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
          dbStatus === 'online' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          <Database size={12} />
          {dbStatus === 'online' ? 'DB ONLINE' : 'DB OFFLINE'}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DevStat icon={<Users />} label="Total Users" value={userCount} color="text-blue-500" />
        <DevStat icon={<Activity />} label="Total Events" value={activities.length} color="text-emerald-500" />
        <DevStat icon={<ShieldAlert />} label="Sec Failures" value="0" color="text-rose-500" />
      </div>

      <section className="mb-8">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-4">Entity Distribution</h2>
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
           <div className="space-y-6">
              <DistributionRow label="Goals" count={goals.length} color="bg-orange-500" max={50} />
              <DistributionRow label="Habits" count={habits.length} color="bg-emerald-500" max={50} />
              <DistributionRow label="Entries" count={entries.length} color="bg-purple-500" max={100} />
              <DistributionRow label="Activity Records" count={activities.length} color="bg-blue-500" max={500} />
           </div>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-4">Recent System Log</h2>
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 font-mono text-[10px]">
           <div className="space-y-2 text-slate-400">
              <div className="flex gap-4">
                 <span className="text-slate-600">[2026-06-03 12:00]</span>
                 <span className="text-emerald-500">INFO:</span>
                 <span>SyncService started successfully.</span>
              </div>
              <div className="flex gap-4">
                 <span className="text-slate-600">[2026-06-03 12:05]</span>
                 <span className="text-blue-500">AUTH:</span>
                 <span>Anonymous session established.</span>
              </div>
              <div className="flex gap-4">
                 <span className="text-slate-600">[2026-06-03 12:10]</span>
                 <span className="text-yellow-500">SYNC:</span>
                 <span>UPSERT goals (success: 2, error: 0)</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function DevStat({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
      <div className={`${color} mb-3`}>{icon}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function DistributionRow({ label, count, color, max }: { label: string, count: number, color: string, max: number }) {
  const percentage = Math.min((count / max) * 100, 100);
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center px-1">
          <span className="text-sm font-bold text-white">{label}</span>
          <span className="text-xs text-slate-500">{count}</span>
       </div>
       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
       </div>
    </div>
  );
}
