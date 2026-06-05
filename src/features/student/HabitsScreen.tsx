import React, { useState } from 'react';
import { 
  Plus, Activity, X, Zap, 
  TrendingUp, TrendingDown, Trash2
} from 'lucide-react';
import { useAppStore, Habit } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function HabitsScreen() {
  const { t, dir, language } = useI18n();
  const { studentData, addHabit, toggleHabit, deleteHabit } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as any,
      streak: 0,
    };
    addHabit(habit);
    setIsAdding(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full rtl:font-farsi">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">{t('neural_pathways')}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
             {t('branch_habits').split(' ')[0]}<span className="text-blue-500">.</span>
           </h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-16 h-16 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shadow-2xl shadow-blue-500/10 hover:bg-blue-600 hover:text-white transition-all duration-500 active:scale-95"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl"
            dir={dir}
          >
             <motion.form 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onSubmit={handleAddHabit} 
                className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] w-full max-w-xl space-y-10 shadow-2xl relative overflow-hidden"
             >
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="absolute top-8 right-8 rtl:right-auto rtl:left-8 text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-20"
                >
                   <X size={20} />
                </button>
                
                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('pathway_identity')}</label>
                   <input 
                     name="title" 
                     required 
                     placeholder={language === 'fa' ? 'مثلاً: مطالعه عمیق صبحگاهی' : 'e.g. Early Morning Focus'} 
                     className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white font-display font-black text-2xl placeholder:text-slate-800 outline-none focus:border-blue-500/30 focus:bg-white/[0.08] transition-all" 
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('description')}</label>
                   <textarea 
                     name="description" 
                     placeholder="..." 
                     className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white font-sans text-lg placeholder:text-slate-800 outline-none focus:border-blue-500/30 focus:bg-white/[0.08] transition-all min-h-[100px] resize-none" 
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('polarity_selection')}</label>
                   <div className="grid grid-cols-2 gap-6">
                      {[
                        { val: 'POSITIVE', label: t('habits_good'), icon: <TrendingUp size={24} />, color: 'text-emerald-500' },
                        { val: 'NEGATIVE', label: t('habits_bad'), icon: <TrendingDown size={24} />, color: 'text-rose-500' }
                      ].map(type => (
                        <label key={type.val} className="flex flex-col items-center gap-6 p-8 rounded-[2.5rem] border border-white/5 bg-white/5 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 transition-all group">
                           <input type="radio" name="type" value={type.val} className="hidden" defaultChecked={type.val === 'POSITIVE'} />
                           <div className={`${type.color} group-has-[:checked]:scale-125 transition-transform duration-500`}>
                              {type.icon}
                           </div>
                           <span className="text-[10px] font-black uppercase text-slate-600 transition-colors group-has-[:checked]:text-blue-400">{type.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <button type="submit" className="w-full py-7 bg-blue-600 text-white rounded-3xl font-display font-black text-xl uppercase shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                   {t('map_pathway')}
                </button>
             </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {(studentData.habits || []).map((habit) => {
           const isDone = habit.lastCheck === today;
           return (
             <motion.div 
               layout
               key={habit.id} 
               className={`p-8 bg-white/[0.02] backdrop-blur-md border rounded-[3rem] transition-all flex items-center justify-between group hover:bg-white/[0.04] ${isDone ? 'border-brand-primary/40 bg-brand-primary/[0.03]' : 'border-white/5'}`}
             >
                <div className="flex items-center gap-6">
                   <button 
                     onClick={() => toggleHabit(habit.id)}
                     className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${isDone ? 'bg-brand-primary text-slate-950 shadow-2xl shadow-brand-primary/30 scale-110' : 'bg-slate-950 border border-white/5 text-slate-700 hover:text-white hover:border-blue-500/30'}`}
                   >
                     <Zap size={28} className={isDone ? 'fill-current' : ''} />
                   </button>
                   <div>
                      <h4 className={`text-xl font-display font-black uppercase tracking-tight leading-none mb-2 transition-colors duration-500 ${isDone ? 'text-brand-primary' : 'text-white'}`}>
                        {habit.title}
                      </h4>
                      {habit.description && (
                        <p className="text-[11px] text-slate-500 mb-3 line-clamp-2 max-w-[200px]">
                          {habit.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                         <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 ${habit.type === 'POSITIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {habit.type}_PATH
                         </span>
                         <span className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-tighter">{t('streak')}: {habit.streak}d</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="w-12 h-12 rounded-xl bg-slate-950/40 flex items-center justify-center text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                   <Trash2 size={18} />
                </button>
             </motion.div>
           );
         })}

         {(studentData.habits || []).length === 0 && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="col-span-full py-32 text-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]"
           >
              <Activity size={64} strokeWidth={1} className="mx-auto mb-8 text-slate-800" />
              <p className="text-[12px] font-mono font-black text-slate-600 uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                 No Behavioral Threads Maped // <br />Initialize Neural Pathway Synthesis
              </p>
           </motion.div>
         )}
      </section>
    </div>
  );
}

