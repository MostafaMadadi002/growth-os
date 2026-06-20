import React, { useState } from 'react';
import { 
  Plus, Activity, X, Zap, 
  TrendingUp, TrendingDown, Trash2, Check
} from 'lucide-react';
import { useAppStore, Habit } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function HabitsScreen() {
  const { t, dir, language } = useI18n();
  const { studentData, addHabit, toggleHabit, deleteHabit, logActivity } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleHabit = (id: string, type: 'POSITIVE' | 'NEGATIVE') => {
    toggleHabit(id);
    logActivity(today, type, 1);
  };

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
    <div className="space-y-8 md:space-y-12 w-full max-w-5xl mx-auto pb-32 px-4 md:px-0">
      <header className="flex justify-between items-center md:items-end px-2">
        <div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">{t('habits')}</span>
           </div>
           <h1 className="text-3xl md:text-6xl font-display font-black text-text-primary tracking-tighter uppercase leading-none mt-2">
             {t('habits').split(' ')[0]}<span className="text-blue-500">.</span>
           </h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 text-slate-950 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={24} md:size={28} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-surface-base/80 backdrop-blur-xl"
            dir={dir}
          >
             <motion.form 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onSubmit={handleAddHabit} 
                className="bg-surface-card border border-surface-border p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide space-y-8 md:space-y-10 shadow-2xl relative"
             >
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-text-secondary hover:text-text-primary transition-colors bg-surface-base p-2 rounded-full z-20"
                >
                   <X size={18} md:size={20} />
                </button>
                
                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('pathway_identity')}</label>
                   <input 
                     name="title" 
                     required 
                     placeholder={language === 'fa' ? 'مثلاً: مطالعه عمیق صبحگاهی' : 'e.g. Early Morning Focus'} 
                     className="w-full bg-surface-base border border-surface-border rounded-2xl p-6 text-text-primary font-display font-black text-lg md:text-xl placeholder:text-text-secondary/30 outline-none focus:border-blue-500/30 transition-all" 
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('description')}</label>
                   <textarea 
                     name="description" 
                     placeholder="..." 
                     className="w-full bg-surface-base border border-surface-border rounded-2xl p-6 text-text-primary font-sans text-lg placeholder:text-text-secondary/30 outline-none focus:border-blue-500/30 transition-all min-h-[100px] resize-none" 
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('polarity_selection')}</label>
                   <div className="grid grid-cols-2 gap-6">
                      {[
                        { val: 'POSITIVE', label: t('habits_good'), icon: <TrendingUp size={24} />, color: 'text-emerald-500' },
                        { val: 'NEGATIVE', label: t('habits_bad'), icon: <TrendingDown size={24} />, color: 'text-rose-500' }
                      ].map(type => (
                        <label key={type.val} className="flex flex-col items-center gap-6 p-8 rounded-[2.5rem] border border-surface-border bg-surface-base cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 transition-all group">
                           <input type="radio" name="type" value={type.val} className="hidden" defaultChecked={type.val === 'POSITIVE'} />
                           <div className={`${type.color} group-has-[:checked]:scale-125 transition-transform duration-500`}>
                              {type.icon}
                           </div>
                           <span className="text-[10px] font-black uppercase text-text-secondary transition-colors group-has-[:checked]:text-blue-400">{type.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <button type="submit" className="w-full py-5 md:py-7 bg-blue-600 text-white rounded-2xl md:rounded-3xl font-display font-black text-base md:text-lg uppercase shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                   {t('map_pathway')}
                </button>
             </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-1">
         {(studentData.habits || []).map((habit) => {
            const isDone = habit.lastCheck === today;
            return (
              <motion.div 
                layout
                key={habit.id} 
                className={`p-5 md:p-8 bg-surface-card border rounded-[2rem] md:rounded-[3rem] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group shadow-sm ${isDone ? 'border-brand-primary/40 bg-brand-primary/[0.03]' : 'border-surface-border'}`}
              >
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xl md:text-2xl font-display font-black uppercase tracking-tight truncate transition-colors duration-300 ${isDone ? 'text-brand-primary' : 'text-text-primary'}`}>
                        {habit.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5">
                         <div className="flex items-center gap-2 bg-surface-base px-2.5 py-1 rounded-xl border border-surface-border/50">
                            <span className="text-xs font-mono font-black text-brand-primary tabular-nums">
                              {habit.streak}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-text-secondary uppercase opacity-60 tracking-wider">
                              {t('days')} {t('streak')}
                            </span>
                         </div>
                         <div className={`px-2 py-1 rounded-xl border border-surface-border/50 bg-surface-base flex items-center gap-1.5`}>
                            {habit.type === 'POSITIVE' ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                            <span className={`text-[9px] font-mono font-black uppercase ${habit.type === 'POSITIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {habit.type === 'POSITIVE' ? t('habits_good').split(' ')[0] : t('habits_bad').split(' ')[0]}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleToggleHabit(habit.id, habit.type)}
                      className={`flex-1 md:flex-none px-6 h-14 md:h-16 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center transition-all duration-300 active:scale-95 gap-3 ${isDone ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
                    >
                      {isDone ? (
                        <>
                          <Check size={20} md:size={24} strokeWidth={3} />
                          <span className="text-[11px] md:text-sm font-display font-black uppercase tracking-wider">{t('done')}</span>
                        </>
                      ) : (
                        <>
                          <Zap size={18} md:size={20} className="opacity-30" />
                          <span className="text-[11px] md:text-sm font-mono font-black uppercase tracking-wider opacity-60">{t('mark_done')}</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => deleteHabit(habit.id)} 
                      className="p-4 text-text-secondary/20 hover:text-rose-500 transition-colors"
                    >
                       <Trash2 size={18} />
                    </button>
                </div>
              </motion.div>
            );
         })}

         {(studentData.habits || []).length === 0 && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="col-span-full py-32 text-center border-4 border-dashed border-surface-border rounded-[4rem] bg-surface-base/50"
           >
              <Activity size={64} strokeWidth={1} className="mx-auto mb-8 text-text-secondary opacity-20" />
              <p className="text-[12px] font-mono font-black text-text-secondary uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                 No Behavioral Threads Maped // <br />Initialize Neural Pathway Synthesis
              </p>
           </motion.div>
         )}
      </section>
    </div>
  );
}

