import React, { useState } from 'react';
import { 
  Plus, Target, X, ChevronRight, CheckCircle2, 
  BookOpen, Briefcase, Rocket, Calendar
} from 'lucide-react';
import { useAppStore, Goal } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function GoalsScreen() {
  const { t } = useI18n();
  const { studentData, addGoal, completeSession, deleteGoal } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      totalSessions: Number(formData.get('totalSessions')),
      completedSessions: 0,
      frequencyPerWeek: Number(formData.get('frequencyPerWeek')),
      category: formData.get('category') as any,
    };
    addGoal(goal);
    setIsAdding(false);
  };

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Strategic_Objectives</span>
           </div>
           <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">Goals.</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
             <form onSubmit={handleAddGoal} className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-lg space-y-8 shadow-2xl relative">
                <button type="button" onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                   <X size={24} />
                </button>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Objective_Header</label>
                   <input 
                     name="title" 
                     required 
                     placeholder="e.g. Master Neural Networks" 
                     className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white font-display font-black text-xl placeholder:text-slate-800 outline-none focus:border-brand-primary/30 transition-all uppercase" 
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Total_Sessions</label>
                      <input 
                        name="totalSessions" 
                        type="number" 
                        required 
                        defaultValue={10}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono outline-none" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Weekly_Freq</label>
                      <input 
                        name="frequencyPerWeek" 
                        type="number" 
                        required 
                        defaultValue={3}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono outline-none" 
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Core_Domain</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['STUDY', 'WORK', 'PROJECT'].map(cat => (
                        <label key={cat} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/5 bg-slate-950 cursor-pointer has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5 transition-all">
                           <input type="radio" name="category" value={cat} className="hidden" defaultChecked={cat === 'STUDY'} />
                           <div className="text-slate-500 group-checked:text-brand-primary">
                              {cat === 'STUDY' && <BookOpen size={20} />}
                              {cat === 'WORK' && <Briefcase size={20} />}
                              {cat === 'PROJECT' && <Rocket size={20} />}
                           </div>
                           <span className="text-[8px] font-mono font-black uppercase text-slate-600">{cat}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <button type="submit" className="w-full py-6 bg-brand-primary text-slate-950 rounded-2xl font-display font-black text-xl uppercase shadow-xl shadow-brand-primary/20">
                   Establish Objective
                </button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 gap-6">
         {studentData.goals.map((goal) => (
           <div key={goal.id} className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] group hover:border-brand-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-brand-primary border border-white/5">
                       {goal.category === 'STUDY' ? <BookOpen size={20} /> : goal.category === 'WORK' ? <Briefcase size={20} /> : <Rocket size={20} />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none mb-1 group-hover:text-brand-primary transition-colors">{goal.title}</h3>
                       <p className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">{goal.frequencyPerWeek} Sessions Required / Week</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-[10px] font-mono font-black text-slate-500 uppercase">Synchronicity: {Math.round((goal.completedSessions / goal.totalSessions) * 100)}%</span>
                       <span className="text-[10px] font-mono font-black text-white">{goal.completedSessions} / {goal.totalSessions}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(goal.completedSessions / goal.totalSessions) * 100}%` }}
                         className="h-full bg-brand-primary rounded-full"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex md:flex-col gap-3">
                 <button 
                   onClick={() => completeSession(goal.id)}
                   disabled={goal.completedSessions >= goal.totalSessions}
                   className={`flex-1 md:flex-none px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-mono font-black text-[10px] uppercase tracking-widest transition-all ${goal.completedSessions >= goal.totalSessions ? 'bg-slate-950 text-slate-800' : 'bg-brand-primary text-slate-950 hover:scale-105 shadow-lg shadow-brand-primary/10'}`}
                 >
                    {goal.completedSessions >= goal.totalSessions ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                    {goal.completedSessions >= goal.totalSessions ? 'Objective_Met' : 'Commit_Session'}
                 </button>
                 <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="px-6 py-4 rounded-2xl bg-slate-950 border border-white/5 text-slate-700 hover:text-rose-500 transition-colors"
                 >
                    <X size={16} />
                 </button>
              </div>
           </div>
         ))}

         {studentData.goals.length === 0 && (
           <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
              <Target size={48} strokeWidth={1} className="mx-auto mb-6 text-slate-800" />
              <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest leading-loose">
                 Nexus Archive Empty // <br />Establish New Strategic Growth Objective
              </p>
           </div>
         )}
      </section>
    </div>
  );
}
