import React, { useState } from 'react';
import { 
  Plus, Activity, X, Zap, 
  TrendingUp, TrendingDown, Trash2
} from 'lucide-react';
import { useAppStore, Habit } from '../../core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

export default function HabitsScreen() {
  const { studentData, addHabit, toggleHabit, deleteHabit } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      type: formData.get('type') as any,
      streak: 0,
    };
    addHabit(habit);
    setIsAdding(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Neural_Pathways</span>
           </div>
           <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">Habits.</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
             <form onSubmit={handleAddHabit} className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-lg space-y-8 shadow-2xl relative">
                <button type="button" onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                   <X size={24} />
                </button>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Pathway_Identity</label>
                   <input 
                     name="title" 
                     required 
                     placeholder="e.g. Early Morning Deep Work" 
                     className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white font-display font-black text-xl placeholder:text-slate-800 outline-none focus:border-blue-500/30 transition-all uppercase" 
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Polarity_Selection</label>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: 'POSITIVE', label: 'Positive_Link', icon: <TrendingUp size={18} />, color: 'text-emerald-500' },
                        { val: 'NEGATIVE', label: 'Negative_Link', icon: <TrendingDown size={18} />, color: 'text-rose-500' }
                      ].map(type => (
                        <label key={type.val} className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-white/5 bg-slate-950 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/5 transition-all group">
                           <input type="radio" name="type" value={type.val} className="hidden" defaultChecked={type.val === 'POSITIVE'} />
                           <div className={`${type.color} group-checked:scale-110 transition-transform`}>
                              {type.icon}
                           </div>
                           <span className="text-[8px] font-mono font-black uppercase text-slate-600">{type.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-2xl font-display font-black text-xl uppercase shadow-xl shadow-blue-600/20">
                   Map Pathway
                </button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {studentData.habits.map((habit) => {
           const isDone = habit.lastCheck === today;
           return (
             <div 
               key={habit.id} 
               className={`p-6 bg-slate-900 border rounded-[2.5rem] transition-all flex items-center justify-between group ${isDone ? 'border-brand-primary/20 bg-brand-primary/[0.02]' : 'border-white/5'}`}
             >
                <div className="flex items-center gap-5">
                   <button 
                     onClick={() => toggleHabit(habit.id)}
                     className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDone ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-slate-950 border border-white/5 text-slate-700 hover:text-white'}`}
                   >
                     <Zap size={24} className={isDone ? 'fill-current' : ''} />
                   </button>
                   <div>
                      <h4 className={`text-lg font-display font-black uppercase tracking-tight leading-none mb-1 transition-colors ${isDone ? 'text-brand-primary' : 'text-white'}`}>
                        {habit.title}
                      </h4>
                      <div className="flex items-center gap-3">
                         <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${habit.type === 'POSITIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {habit.type}_PATH
                         </span>
                         <span className="text-[8px] font-mono font-bold text-slate-700 uppercase">Streak: {habit.streak}d</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                   <Trash2 size={16} />
                </button>
             </div>
           );
         })}

         {studentData.habits.length === 0 && (
           <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
              <Activity size={48} strokeWidth={1} className="mx-auto mb-6 text-slate-800" />
              <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest leading-loose">
                 No Behavioral Threads Maped // <br />Initialize Neural Pathway Synthesis
              </p>
           </div>
         )}
      </section>
    </div>
  );
}
