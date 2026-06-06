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
  const { studentData, addTask, toggleTask, deleteTask, recordActivity, addHabit } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const tasks = studentData.tasks || [];
  const goals = studentData.goals || [];
  const activities = studentData.activities || [];

  const unfinishedTasks = tasks.filter(t => !t.done);
  const showPrompt = !isAdding && !isRecording && unfinishedTasks.length > 0;

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      time: formData.get('time') as string,
      label: formData.get('label') as string,
      dueDate: (formData.get('dueDate') as string) || undefined,
      goalId: (formData.get('goalId') as string) || undefined,
      done: false
    };
    addTask(newTask);
    setIsAdding(false);
  };

  const handleRecordActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goalId = formData.get('goalId') as string;
    const isUnplanned = !goalId;
    const today = new Date().toISOString().split('T')[0];

    const activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      duration: Number(formData.get('duration')),
      sessions: Number(formData.get('sessions')),
      date: today,
      type: (isUnplanned ? 'NEGATIVE' : 'POSITIVE') as 'POSITIVE' | 'NEGATIVE',
      goalId: goalId || undefined
    };

    recordActivity(activity);
    setIsRecording(false);
  };

  const calculateWeeklyTarget = (goal: any) => {
    const totalWeeks = goal.durationMonths * 4;
    return Math.ceil(goal.totalSessions / totalWeeks);
  };

  const getWeeklyProgress = (goalId: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return activities
      .filter(a => a.goalId === goalId && new Date(a.date) >= oneWeekAgo)
      .reduce((sum, a) => sum + a.sessions, 0);
  };

  return (
    <div className="p-4 md:p-12 space-y-8 md:space-y-12 max-w-4xl mx-auto w-full rtl:font-farsi">
      <header className="flex justify-between items-center md:items-end">
        <div>
           <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316]" />
              <span className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">{t('chronos_sequencing')}</span>
           </div>
           <h1 className="text-3xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
             {t('schedule').split(' ')[0]}<span className="text-orange-500">.</span>
           </h1>
        </div>
         <div className="flex gap-2 md:gap-4">
           <button 
             onClick={() => setIsRecording(true)}
             className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/10 backdrop-blur-xl border border-brand-primary/30 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary shadow-2xl shadow-brand-primary/10 hover:bg-brand-primary hover:text-slate-950 transition-all duration-500 active:scale-95"
           >
             <Timer size={24} md:size={28} strokeWidth={3} />
           </button>
           <button 
             onClick={() => setIsAdding(true)}
             className="w-12 h-12 md:w-16 md:h-16 bg-orange-500/10 backdrop-blur-xl border border-orange-500/30 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-400 shadow-2xl shadow-orange-500/10 hover:bg-orange-600 hover:text-white transition-all duration-500 active:scale-95"
           >
             <Plus size={24} md:size={28} strokeWidth={3} />
           </button>
         </div>
      </header>
      
      {goals.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.slice(0, 3).map(goal => {
            const weeklyTarget = calculateWeeklyTarget(goal);
            const weeklyDone = getWeeklyProgress(goal.id);
            const progress = Math.min(100, (weeklyDone / weeklyTarget) * 100);
            
            return (
              <motion.div 
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest truncate max-w-[100px]">{goal.title}</h4>
                  <span className="text-[10px] font-mono text-brand-primary">{weeklyDone}/{weeklyTarget}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-primary shadow-[0_0_8px_#10b981]"
                  />
                </div>
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
                  {progress >= 100 ? t('target_achieved') || 'NODE SATURATED' : `${t('remaining_sessions') || 'SESSIONS REMAINING'}: ${Math.max(0, weeklyTarget - weeklyDone)}`}
                </p>
              </motion.div>
            );
          })}
        </section>
      )}

      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl"
            dir={dir}
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide space-y-8 md:space-y-10 shadow-2xl relative"
             >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <button 
                  type="button" 
                  onClick={() => setIsRecording(false)} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-20"
                >
                   <X size={18} md:size={20} />
                </button>

                <h2 className="text-3xl font-display font-black text-white mb-8">{t('record_activity')}</h2>
                
                <form onSubmit={handleRecordActivity} className="space-y-8 relative z-10 text-left rtl:text-right">
                    <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('activity_title')}</label>
                      <div className="relative group">
                        <input 
                          name="title" 
                          list="negative-habits"
                          required 
                          placeholder="..." 
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-display font-black text-xl outline-none focus:border-brand-primary/30" 
                        />
                        <datalist id="negative-habits">
                          {(studentData.habits || [])
                            .filter(h => h.type === 'NEGATIVE')
                            .map(h => <option key={h.id} value={h.title} />)
                          }
                        </datalist>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                        <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('linked_objective')}</label>
                        <select name="goalId" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-sans font-black text-lg outline-none focus:border-brand-primary/30 appearance-none">
                            <option value="">{t('unplanned_activity')}</option>
                            {goals.map(goal => (
                            <option key={goal.id} value={goal.id} className="text-slate-900">{goal.title}</option>
                            ))}
                        </select>
                        </div>
                        <div className="space-y-3">
                        <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('session_duration')}</label>
                        <input name="duration" type="number" defaultValue={60} required className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold text-xl outline-none focus:border-brand-primary/30" />
                        </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('sessions_done')}</label>
                      <input name="sessions" type="number" defaultValue={1} required className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold text-xl outline-none focus:border-brand-primary/30" />
                    </div>

                    <button type="submit" className="w-full h-20 bg-brand-primary text-slate-950 rounded-3xl font-display font-black text-lg uppercase tracking-widest shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        {t('commit_snapshot')}
                    </button>
                </form>
             </motion.div>
          </motion.div>
        )}

        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 group mb-12"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 animate-pulse">
                <Clock size={32} />
              </div>
              <div className="text-left rtl:text-right">
                <h3 className="text-2xl font-display font-black text-white">{t('unknown_activity_prompt')}</h3>
                <p className="text-[11px] font-mono font-black text-rose-500/60 uppercase tracking-widest mt-1">
                  {unfinishedTasks.length} {t('active_segments')} {t('remaining')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsRecording(true)}
              className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all w-full md:w-auto"
            >
              {t('record_activity')}
            </button>
          </motion.div>
        )}

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl"
            dir={dir}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl space-y-8 md:space-y-10 relative"
            >
               <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
               <button 
                 type="button" 
                 onClick={() => setIsAdding(false)} 
                 className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-slate-500 hover:text-white transition-colors z-20 bg-white/5 p-2 rounded-full"
               >
                  <X size={18} md:size={20} />
               </button>
             
             <form onSubmit={handleAddTask} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('session_task_label')}</label>
                    <input name="label" required placeholder="..." className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-display font-black text-xl outline-none focus:border-orange-500/30 focus:bg-white/[0.08]" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('local_time')}</label>
                    <input name="time" type="time" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold text-xl outline-none focus:border-orange-500/30" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('linked_objective')}</label>
                    <select name="goalId" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-display font-black text-lg outline-none focus:border-orange-500/30 appearance-none">
                      <option value="">{language === 'fa' ? 'بدون هدف' : 'No Goal'}</option>
                      {goals.map(goal => (
                        <option key={goal.id} value={goal.id} className="text-slate-900">{goal.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('target_date')}</label>
                    <input name="dueDate" type="date" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-mono font-bold text-lg outline-none focus:border-orange-500/30" />
                  </div>
                </div>

                <div className="pt-4">
                   <button type="submit" className="w-full h-20 bg-orange-600 text-white rounded-3xl font-display font-black text-lg uppercase tracking-widest shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                     {t('add_task')}
                   </button>
                </div>
             </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-6 relative before:absolute before:left-10 before:top-4 before:bottom-4 rtl:before:left-auto rtl:before:right-10 before:w-[2px] before:bg-white/5 before:z-0">
         {[...tasks].sort((a, b) => a.time.localeCompare(b.time)).map((task) => {
           const linkedGoal = goals.find(g => g.id === task.goalId);
           return (
            <motion.div 
              layout
              key={task.id} 
              className="relative z-10 flex gap-8 items-center bg-white/[0.02] backdrop-blur-md p-4 pr-8 rtl:pr-4 rtl:pl-8 rounded-[3rem] border border-white/5 hover:bg-white/[0.05] transition-all group"
            >
                <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border shadow-2xl transition-all duration-500 ${task.done ? 'bg-orange-500 text-slate-950 border-orange-400 scale-90' : 'bg-slate-900 border-white/10 text-slate-400'}`}>
                  <span className="text-xl font-mono font-black leading-none">{task.time.split(':')[0]}</span>
                  <span className="text-[10px] font-mono font-black opacity-60">{task.time.split(':')[1]}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className={`text-2xl font-display font-black uppercase tracking-tight transition-all duration-500 ${task.done ? 'text-slate-600 line-through' : 'text-white'}`}>
                    {task.label}
                  </h4>
                  <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-700" />
                        <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest">{t('status_active')}</span>
                      </div>
                      {linkedGoal && (
                        <div className="flex items-center gap-2 bg-brand-primary/10 px-2 py-0.5 rounded-lg border border-brand-primary/20">
                          <Plus size={10} className="text-brand-primary" />
                          <span className="text-[9px] font-mono font-black text-brand-primary uppercase">{linkedGoal.title}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl border border-white/10 shadow-lg">
                          <CalendarDays size={14} className="text-orange-500" />
                          <span className="text-[11px] font-mono font-black text-white uppercase tracking-tighter">
                            {language === 'fa' ? 'مهلت:' : 'DUE:'} {task.dueDate}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${task.done ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-slate-700 border border-white/5 hover:border-orange-500/30 hover:text-orange-500'}`}
                  >
                    {task.done ? <CheckCircle2 size={28} strokeWidth={3} /> : <div className="w-8 h-8 border-4 border-current rounded-xl opacity-20" />}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="w-10 h-10 rounded-xl bg-slate-950/40 flex items-center justify-center text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <X size={16} />
                  </button>
                </div>
            </motion.div>
           );
         })}

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

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

