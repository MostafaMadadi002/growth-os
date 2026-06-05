import React, { useState } from 'react';
import { 
  CalendarDays, Clock, CheckCircle2, 
  Plus, Timer, LayoutGrid, Hash
} from 'lucide-react';
import { useAppStore } from '../../core/stores/appStore';
import { motion } from 'motion/react';

export default function ScheduleScreen() {
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
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Chronos_Sequencing</span>
           </div>
           <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">Schedule.</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl"
        >
           <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                 <input name="label" required placeholder="Session / Task Label" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono text-sm outline-none focus:border-orange-500/30" />
              </div>
              <div className="flex gap-4">
                 <input name="time" type="time" required className="flex-1 bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono text-sm outline-none" />
                 <button type="submit" className="px-6 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Add</button>
              </div>
           </form>
        </motion.div>
      )}

      <section className="space-y-6 relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-900 before:z-0">
         {tasks.map((task) => (
           <div key={task.id} className="relative z-10 flex gap-8 items-center bg-slate-950/20 p-2 pr-6 rounded-[2rem]">
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-xl transition-all ${task.done ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                 <span className="text-[10px] font-mono font-black">{task.time.split(':')[0]}</span>
                 <span className="text-[10px] font-mono font-black opacity-40">{task.time.split(':')[1]}</span>
              </div>
              <div className="flex-1">
                 <h4 className={`text-base font-display font-black uppercase tracking-tight transition-all ${task.done ? 'text-slate-600 line-through' : 'text-white'}`}>
                   {task.label}
                 </h4>
                 <div className="flex items-center gap-2 mt-1">
                    <Clock size={10} className="text-slate-700" />
                    <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">Scheduled_Transmission</span>
                 </div>
              </div>
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${task.done ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-900 text-slate-700 hover:text-orange-500 hover:border-orange-500/30 border border-transparent'}`}
              >
                 {task.done ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 border-2 border-current rounded-lg opacity-20" />}
              </button>
           </div>
         ))}

         {tasks.length === 0 && (
           <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
              <CalendarDays size={48} strokeWidth={1} className="mx-auto mb-6 text-slate-800" />
              <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest leading-loose text-center">
                 Chronology Bank Empty // <br />Partition Node Time For Execution
              </p>
           </div>
         )}
      </section>

      <footer className="grid grid-cols-2 gap-4">
         <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem]">
            <Hash className="text-orange-500 mb-4" size={24} />
            <h5 className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active_Segments</h5>
            <p className="text-2xl font-display font-black text-white leading-none uppercase">{tasks.length} Nodes</p>
         </div>
         <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem]">
            <Timer className="text-emerald-500 mb-4" size={24} />
            <h5 className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Completion_Load</h5>
            <p className="text-2xl font-display font-black text-white leading-none uppercase">{tasks.filter(t => t.done).length} Pulses</p>
         </div>
      </footer>
    </div>
  );
}
