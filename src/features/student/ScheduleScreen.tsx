import React, { useState } from 'react';
import { 
  CalendarDays, Clock, CheckCircle2, 
  Plus, Timer, Hash, X
} from 'lucide-react';
import { useAppStore } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function ScheduleScreen() {
  const { t, dir, language } = useI18n();
  const { logActivity } = useAppStore();
  const [tasks, setTasks] = useState<{ id: string; time: string; label: string; done: boolean }[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      time: formData.get('time') as string,
      label: formData.get('label') as string,
      done: false
    };
    setTasks(prev => [...prev, newTask].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.done) logActivity(new Date().toISOString().split('T')[0]);
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full rtl:font-farsi">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">{t('chronos_sequencing')}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
             {t('schedule').split(' ')[0]}<span className="text-orange-500">.</span>
           </h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-16 h-16 bg-orange-500/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 shadow-2xl shadow-orange-500/10 hover:bg-orange-600 hover:text-white transition-all duration-500 active:scale-95"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden"
          >
             <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full" />
             <button type="button" onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
             </button>
             
             <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-1 space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('session_task_label')}</label>
                   <input name="label" required placeholder="..." className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-display font-black text-xl outline-none focus:border-orange-500/30 focus:bg-white/[0.08]" />
                </div>
                <div className="md:w-48 space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('local_time')}</label>
                   <input name="time" type="time" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold text-xl outline-none focus:border-orange-500/30" />
                </div>
                <div className="md:pt-9">
                   <button type="submit" className="w-full md:w-auto h-16 px-10 bg-orange-600 text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all">
                     {language === 'fa' ? 'افزودن' : 'ADD'}
                   </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-6 relative before:absolute before:left-10 before:top-4 before:bottom-4 rtl:before:left-auto rtl:before:right-10 before:w-[2px] before:bg-white/5 before:z-0">
         {tasks.map((task) => (
           <motion.div 
             layout
             key={task.id} 
             className="relative z-10 flex gap-8 items-center bg-white/[0.02] backdrop-blur-md p-3 pr-8 rtl:pr-3 rtl:pl-8 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.05] transition-all"
           >
              <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border shadow-2xl transition-all duration-500 ${task.done ? 'bg-orange-500 text-slate-950 border-orange-400 scale-90' : 'bg-slate-900 border-white/10 text-slate-400'}`}>
                 <span className="text-xl font-mono font-black leading-none">{task.time.split(':')[0]}</span>
                 <span className="text-[10px] font-mono font-black opacity-60">{task.time.split(':')[1]}</span>
              </div>
              <div className="flex-1">
                 <h4 className={`text-2xl font-display font-black uppercase tracking-tight transition-all duration-500 ${task.done ? 'text-slate-600 line-through' : 'text-white'}`}>
                   {task.label}
                 </h4>
                 <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-slate-700" />
                    <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest">{t('status_active')}</span>
                 </div>
              </div>
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${task.done ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-slate-700 border border-white/5 hover:border-orange-500/30 hover:text-orange-500'}`}
              >
                 {task.done ? <CheckCircle2 size={28} strokeWidth={3} /> : <div className="w-8 h-8 border-4 border-current rounded-xl opacity-20" />}
              </button>
           </motion.div>
         ))}

         {tasks.length === 0 && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="py-32 text-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]"
           >
              <CalendarDays size={64} strokeWidth={1} className="mx-auto mb-8 text-slate-800" />
              <p className="text-[12px] font-mono font-black text-slate-600 uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                 {t('partition_time')} <br /> Partition Node Time For Execution
              </p>
           </motion.div>
         )}
      </section>

      <footer className="grid grid-cols-2 gap-6">
         <div className="p-10 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full group-hover:bg-orange-500/20 transition-all" />
            <Hash className="text-orange-500 mb-6" size={32} />
            <h5 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{t('active_segments')}</h5>
            <p className="text-4xl font-display font-black text-white leading-none uppercase">{tasks.length} <span className="text-sm font-mono text-slate-700">NODES</span></p>
         </div>
         <div className="p-10 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
            <Timer className="text-emerald-500 mb-6" size={32} />
            <h5 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{t('completion_load')}</h5>
            <p className="text-4xl font-display font-black text-white leading-none uppercase">{tasks.filter(t => t.done).length} <span className="text-sm font-mono text-slate-700">PULSES</span></p>
         </div>
      </footer>
    </div>
  );
}

