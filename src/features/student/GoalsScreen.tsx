import React, { useState } from 'react';
import { 
  Plus, Target, X, CheckCircle2, 
  BookOpen, Briefcase, Rocket
} from 'lucide-react';
import { useAppStore, Goal } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function GoalsScreen() {
  const { t, dir, language } = useI18n();
  const { studentData, addGoal, completeSession, deleteGoal } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedDays = Array.from(formData.getAll('days')).map(Number);
    
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      totalSessions: Number(formData.get('totalSessions')),
      completedSessions: 0,
      frequencyPerWeek: Number(formData.get('frequencyPerWeek')) || selectedDays.length,
      category: formData.get('category') as any,
      durationMonths: Number(formData.get('durationMonths')),
      startDate: (formData.get('startDate') as string) || new Date().toISOString().split('T')[0],
      selectedDays
    };
    addGoal(goal);
    setIsAdding(false);
  };

  return (
    <div className="p-4 md:p-12 space-y-8 md:space-y-12 max-w-4xl mx-auto w-full rtl:font-farsi">
      <header className="flex justify-between items-center md:items-end">
        <div>
           <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_12px_#10b981]" />
              <span className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">{t('strategic_objectives')}</span>
           </div>
           <h1 className="text-3xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
             {t('branch_goals').split(' ')[0]}<span className="text-brand-primary">.</span>
           </h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/10 backdrop-blur-xl border border-brand-primary/30 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary shadow-2xl shadow-brand-primary/10 hover:bg-brand-primary hover:text-slate-950 transition-all duration-500 active:scale-95"
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl"
            dir={dir}
          >
             <motion.form 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onSubmit={handleAddGoal} 
                className="bg-slate-900 border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide space-y-8 md:space-y-10 shadow-2xl relative"
             >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-20"
                >
                   <X size={18} md:size={20} />
                </button>
                
                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('objective_header')}</label>
                   <input 
                     name="title" 
                     required 
                     placeholder={language === 'fa' ? 'مثلاً: تسلط بر هوش مصنوعی' : 'e.g. Master AI Fundamentals'} 
                     className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white font-display font-black text-2xl placeholder:text-slate-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.08] transition-all" 
                   />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('total_required_sessions')}</label>
                      <input 
                        name="totalSessions" 
                        type="number" 
                        required 
                        defaultValue={30}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold outline-none focus:border-brand-primary/20" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('duration_months')}</label>
                      <input 
                        name="durationMonths" 
                        type="number" 
                        required 
                        defaultValue={1}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold outline-none focus:border-brand-primary/20" 
                      />
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('scheduled_days')}</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 6, label: t('day_sat') },
                      { id: 0, label: t('day_sun') },
                      { id: 1, label: t('day_mon') },
                      { id: 2, label: t('day_tue') },
                      { id: 3, label: t('day_wed') },
                      { id: 4, label: t('day_thu') },
                      { id: 5, label: t('day_fri') },
                    ].map(day => (
                      <label key={day.id} className="cursor-pointer">
                        <input type="checkbox" name="days" value={day.id} className="hidden peer" defaultChecked={day.id !== 5} />
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-600 peer-checked:bg-white/10 peer-checked:text-brand-primary peer-checked:border-brand-primary/30 transition-all">
                          {day.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('start_date')}</label>
                   <input 
                     name="startDate" 
                     type="date" 
                     defaultValue={new Date().toISOString().split('T')[0]}
                     className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold outline-none focus:border-brand-primary/20" 
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('core_domain')}</label>
                   <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'STUDY', icon: <BookOpen size={22} />, label: t('education') },
                        { id: 'WORK', icon: <Briefcase size={22} />, label: t('trading_cat') },
                        { id: 'PROJECT', icon: <Rocket size={22} />, label: t('project') }
                      ].map(cat => (
                        <label key={cat.id} className="flex flex-col items-center gap-4 p-5 rounded-3xl border border-white/5 bg-white/5 cursor-pointer has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/10 group transition-all duration-300">
                           <input type="radio" name="category" value={cat.id} className="hidden" defaultChecked={cat.id === 'STUDY'} />
                           <div className="text-slate-500 group-has-[:checked]:text-brand-primary group-has-[:checked]:scale-110 transition-all">
                              {cat.icon}
                           </div>
                           <span className="text-[10px] font-black uppercase text-slate-600 group-has-[:checked]:text-brand-primary opacity-60 group-has-[:checked]:opacity-100">{cat.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <button type="submit" className="w-full py-7 bg-brand-primary text-slate-950 rounded-3xl font-display font-black text-xl uppercase shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                   {t('establish_objective')}
                </button>
             </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 gap-8">
         {(studentData.goals || []).map((goal) => (
           <motion.div 
             layout
             key={goal.id} 
             className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-8 md:p-10 rounded-[3rem] group hover:bg-white/[0.04] hover:border-brand-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-10"
           >
              <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary border border-white/5 shadow-inner">
                       {goal.category === 'STUDY' ? <BookOpen size={24} /> : goal.category === 'WORK' ? <Briefcase size={24} /> : <Rocket size={24} />}
                    </div>
                    <div>
                       <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none mb-2 group-hover:text-brand-primary transition-colors">{goal.title}</h3>
                       <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                            {goal.selectedDays?.length || goal.frequencyPerWeek} {t('ses_week')}
                          </span>
                          <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                            {goal.durationMonths} {t('monthly_term')}
                          </span>
                          <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">{t(goal.category.toLowerCase())}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                       <span className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-wider">{t('progress_rate')}: {Math.round((goal.completedSessions / goal.totalSessions) * 100)}%</span>
                       <span className="text-[11px] font-mono font-black text-white bg-brand-primary/10 px-3 py-1 rounded-full">{goal.completedSessions} / {goal.totalSessions}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px] border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(goal.completedSessions / goal.totalSessions) * 100}%` }}
                         transition={{ duration: 1, ease: 'circOut' }}
                         className="h-full bg-gradient-to-r from-brand-primary/50 to-brand-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex md:flex-col gap-4">
                 <button 
                   onClick={() => completeSession(goal.id)}
                   disabled={goal.completedSessions >= goal.totalSessions}
                   className={`flex-1 md:flex-none h-16 md:w-48 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-[12px] uppercase tracking-widest transition-all duration-500 ${goal.completedSessions >= goal.totalSessions ? 'bg-slate-950 text-slate-800' : 'bg-brand-primary text-slate-950 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20 shadow-lg shadow-brand-primary/5'}`}
                 >
                    {goal.completedSessions >= goal.totalSessions ? <CheckCircle2 size={20} /> : <Plus size={20} strokeWidth={3} />}
                    {goal.completedSessions >= goal.totalSessions ? t('objective_met') : t('commit_session')}
                 </button>
                 <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="w-16 h-16 md:w-48 md:h-12 rounded-[1.25rem] bg-slate-950/40 border border-white/5 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center justify-center px-4 gap-2"
                 >
                    <X size={18} />
                    <span className="hidden md:block text-[10px] uppercase font-black">{language === 'fa' ? 'حذف' : 'DELETE'}</span>
                 </button>
              </div>
           </motion.div>
         ))}

         {(studentData.goals || []).length === 0 && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="py-32 text-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]"
           >
              <Target size={64} strokeWidth={1} className="mx-auto mb-8 text-slate-800" />
              <p className="text-[12px] font-mono font-black text-slate-600 uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                 {t('partition_time')} <br /> Establish New Tactical Objective
              </p>
           </motion.div>
         )}
      </section>
    </div>
  );
}

