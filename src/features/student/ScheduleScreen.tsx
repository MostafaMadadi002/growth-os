import React, { useState } from 'react';
import { 
  CalendarDays, Clock, CheckCircle2, 
  Plus, Timer, Hash, X, Trash2
} from 'lucide-react';
import { useAppStore, StudentActivity } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function ScheduleScreen() {
  const { t, dir, language } = useI18n();
  const { studentData, addTask, toggleTask, deleteTask, recordActivity, addHabit, deleteActivity } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedGoalIdAdd, setSelectedGoalIdAdd] = useState<string>('');
  const [selectedSubGoalsAdd, setSelectedSubGoalsAdd] = useState<string[]>([]);
  const [selectedGoalIdRecord, setSelectedGoalIdRecord] = useState<string>('');
  const [selectedSubGoalsRecord, setSelectedSubGoalsRecord] = useState<string[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DONE'>('ALL');

  const tasks = studentData.tasks || [];
  const goals = studentData.goals || [];
  const activities = (studentData.activities || []);
  const todayActivities = activities.filter(a => a.date === new Date().toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

  // Merge tasks and activities for the timeline
  const unfinishedTasks = tasks.filter(t => !t.done);
  const showPrompt = !isAdding && !isRecording && unfinishedTasks.length > 0;

  const timelineItems = [
    ...tasks.filter(t => !t.done).map(t => ({ ...t, type: 'TASK' as const })),
    ...todayActivities.map(a => ({
      id: a.id,
      label: a.title,
      time: a.time || '00:00',
      done: true,
      goalId: a.goalId,
      type: 'ACTIVITY' as const,
      activityType: a.type
    }))
  ]
  .filter(item => {
    if (filter === 'ACTIVE') return !item.done;
    if (filter === 'DONE') return item.done;
    return true;
  })
  .sort((a, b) => a.time.localeCompare(b.time));

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      time: formData.get('time') as string,
      label: formData.get('label') as string,
      dueDate: (formData.get('dueDate') as string) || undefined,
      goalId: selectedGoalIdAdd || undefined,
      subGoalIds: selectedSubGoalsAdd,
      done: false
    };
    addTask(newTask);
    setIsAdding(false);
    setSelectedGoalIdAdd('');
    setSelectedSubGoalsAdd([]);
  };

  const handleRecordActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selection = selectedGoalIdRecord;
    const isHabit = selection.startsWith('habit:');
    const todayStr = new Date().toISOString().split('T')[0];

    // Identify if it's a goal or negative session
    const goalId = isHabit ? undefined : (selection || undefined);
    let title = isHabit ? selection.replace('habit:', '') : (formData.get('title') as string);
    
    // Fallback for title if empty
    if (!title && goalId) {
      title = goals.find(g => g.id === goalId)?.title || '';
    }
    if (!title) {
      title = t('unplanned_activity');
    }

    const type = goalId ? 'POSITIVE' : 'NEGATIVE';

    const activity: StudentActivity = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      duration: Number(formData.get('duration')),
      sessions: Number(formData.get('sessions')),
      date: todayStr,
      time: formData.get('time') as string,
      type: type as 'POSITIVE' | 'NEGATIVE',
      goalId,
      subGoalIds: selectedSubGoalsRecord
    };

    recordActivity(activity);
    
    // If goal had subgoals, we might want to toggle them done in the store if they were checked here.
    // However, store actions might need update to support this.
    // For now, we fulfill the UI requirement of showing and collecting them.
    
    setIsRecording(false);
    setSelectedGoalIdRecord('');
    setSelectedSubGoalsRecord([]);
  };

  const calculateDailyTarget = (goal: any) => {
    const isPlannedForToday = goal.selectedDays ? goal.selectedDays.includes(dayOfWeek) : true;
    if (!isPlannedForToday) return 0;
    
    // Calculate total weeks in duration
    let totalWeeks = 1;
    if (goal.durationUnit === 'MONTHS') totalWeeks = goal.duration * 4; // User prefers exact 4 weeks
    else if (goal.durationUnit === 'WEEKS') totalWeeks = goal.duration;
    else if (goal.durationUnit === 'DAYS') totalWeeks = goal.duration / 7;

    const plannedDaysPerWeek = goal.selectedDays?.length || 7;
    const totalPlannedDays = Math.max(1, Math.round(totalWeeks * plannedDaysPerWeek));
    
    if (goal.totalSessions && goal.totalSessions > 0) {
      // Logic: 30 sessions / 12 planned days = 2.5
      return Number((goal.totalSessions / totalPlannedDays).toFixed(1));
    }

    // Fallback to frequency per week if totalSessions not provided
    return Number((goal.frequencyPerWeek / plannedDaysPerWeek).toFixed(1));
  };

  const getTodayProgress = (goalId: string) => {
    return todayActivities
      .filter(a => a.goalId === goalId)
      .reduce((sum, a) => sum + a.sessions, 0);
  };

  return (
    <div className="space-y-8 md:space-y-12 w-full max-w-5xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex justify-between items-center md:items-end px-2">
        <div>
           <div className="flex items-center gap-2 md:gap-3">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-orange-500" />
              <span className={`text-[8px] md:text-[10px] font-mono font-bold text-text-secondary uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-[0.1em] md:tracking-[0.2em]'}`}>{t('schedule')}</span>
           </div>
           <h1 className={`text-2xl md:text-6xl font-display font-black text-text-primary ${language === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase mt-1 md:mt-2`}>
             {t('schedule').split(' ')[0]}<span className="text-orange-500">.</span>
           </h1>
        </div>
         <div className="flex gap-2">
           <button 
             onClick={() => setIsRecording(true)}
             className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary text-slate-950 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all active:scale-95"
           >
             <Timer size={24} md:size={28} strokeWidth={3} />
           </button>
         </div>
      </header>
      
      {goals.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.slice(0, 3).map(goal => {
            const dailyTarget = calculateDailyTarget(goal);
            const todayDone = getTodayProgress(goal.id);
            const progress = dailyTarget > 0 ? Math.min(100, (todayDone / dailyTarget) * 100) : (todayDone > 0 ? 100 : 0);
            
            return (
              <motion.div 
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2.5rem] space-y-4 shadow-xl hover:border-brand-primary/20 transition-all duration-500"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-[10px] font-mono font-black text-text-primary uppercase tracking-widest truncate max-w-[120px]">{goal.title}</h4>
                  <div className="flex items-center gap-1.5 bg-brand-primary/10 px-2 py-0.5 rounded-lg border border-brand-primary/20">
                    <span className="text-[10px] font-mono font-black text-brand-primary">
                      {todayDone}/{dailyTarget > 0 ? dailyTarget : (t('off_day') || 'OFF')}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface-base rounded-full overflow-hidden border border-surface-border/30">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-brand-primary shadow-[0_0_10px_#10b981]"
                  />
                </div>
                <p className="text-[9px] font-mono font-black text-text-secondary opacity-40 uppercase tracking-widest">
                  {dailyTarget > 0 
                    ? (progress >= 100 ? t('target_achieved') || 'NODE SATURATED' : `${t('remaining_sessions') || 'SESSIONS REMAINING'}: ${Math.max(0, Number((dailyTarget - todayDone).toFixed(1)))}`)
                    : (t('extra_growth') || 'EXTRA SESSIONS CARRIED')}
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-surface-base/80 backdrop-blur-xl"
            dir={dir}
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-surface-card border border-surface-border p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide space-y-8 md:space-y-10 shadow-2xl relative"
             >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <button 
                  type="button" 
                  onClick={() => setIsRecording(false)} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-text-secondary hover:text-text-primary transition-colors bg-surface-base p-2 rounded-full z-20"
                >
                   <X size={18} md:size={20} />
                </button>

                <h2 className="text-3xl font-display font-black text-text-primary mb-8">{t('record_activity')}</h2>
                
                <form onSubmit={handleRecordActivity} className="space-y-8 relative z-10 text-left rtl:text-right">
                    <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('activity_title')}</label>
                      <div className="relative group">
                        <input 
                          name="title" 
                          list="negative-habits"
                          placeholder={t('unplanned_activity')} 
                          className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-display font-black text-lg md:text-xl outline-none focus:border-brand-primary/30" 
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
                        <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('linked_objective')}</label>
                        <select 
                          name="goalId" 
                          value={selectedGoalIdRecord}
                          onChange={(e) => {
                            setSelectedGoalIdRecord(e.target.value);
                            setSelectedSubGoalsRecord([]);
                          }}
                          className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-sans font-black text-lg outline-none focus:border-brand-primary/30 appearance-none"
                        >
                            <option value="">{t('unplanned_activity')}</option>
                            <optgroup label={t('active_goals')} className="bg-surface-card border-none">
                                {goals.map(goal => (
                                    <option key={goal.id} value={goal.id} className="text-text-primary">{goal.title}</option>
                                ))}
                            </optgroup>
                            <optgroup label={t('bad_habits')} className="bg-surface-card border-none">
                                {(studentData.habits || [])
                                    .filter(h => h.type === 'NEGATIVE')
                                    .map(habit => (
                                        <option key={habit.id} value={`habit:${habit.title}`} className="text-rose-500">{habit.title}</option>
                                    ))
                                }
                            </optgroup>
                        </select>
                        </div>
                        
                        {/* Record Sub-goals checklist */}
                        {selectedGoalIdRecord && !selectedGoalIdRecord.startsWith('habit:') && goals.find(g => g.id === selectedGoalIdRecord)?.subGoals?.length! > 0 && (
                          <div className="md:col-span-2 space-y-4 bg-surface-base/50 p-6 rounded-3xl border border-surface-border">
                            <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-[0.3em]">{t('checklist') || 'CHECKLIST'}</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {goals.find(g => g.id === selectedGoalIdRecord)?.subGoals?.map(sg => (
                                 <label key={sg.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-base cursor-pointer group transition-all">
                                   <input 
                                     type="checkbox" 
                                     checked={selectedSubGoalsRecord.includes(sg.id)}
                                     onChange={(e) => {
                                       if (e.target.checked) setSelectedSubGoalsRecord(prev => [...prev, sg.id]);
                                       else setSelectedSubGoalsRecord(prev => prev.filter(id => id !== sg.id));
                                     }}
                                     className="w-5 h-5 rounded-md border-2 border-surface-border text-brand-primary focus:ring-brand-primary bg-transparent"
                                   />
                                   <span className={`text-sm font-black uppercase transition-all ${selectedSubGoalsRecord.includes(sg.id) ? 'text-brand-primary' : 'text-text-secondary opacity-60'}`}>
                                     {sg.title}
                                   </span>
                                 </label>
                               ))}
                            </div>
                          </div>
                        )}
                        <div className="space-y-3">
                          <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('local_time')}</label>
                          <input 
                            name="time" 
                            type="time" 
                            required 
                            defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold text-lg md:text-xl outline-none focus:border-brand-primary/30" 
                          />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                        <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('session_duration')}</label>
                        <input name="duration" type="number" defaultValue={60} required className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold text-lg md:text-xl outline-none focus:border-brand-primary/30" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('sessions_done')}</label>
                          <input name="sessions" type="number" defaultValue={1} required className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold text-lg md:text-xl outline-none focus:border-brand-primary/30" />
                        </div>
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
                <h3 className="text-2xl font-display font-black text-text-primary">{t('unknown_activity_prompt')}</h3>
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-surface-base/80 backdrop-blur-xl"
            dir={dir}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-card border border-surface-border p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl space-y-8 md:space-y-10 relative"
            >
               <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
               <button 
                 type="button" 
                 onClick={() => setIsAdding(false)} 
                 className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-text-secondary hover:text-text-primary transition-colors z-20 bg-surface-base p-2 rounded-full"
               >
                  <X size={18} md:size={20} />
               </button>
             
             <form onSubmit={handleAddTask} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('session_task_label')}</label>
                    <input name="label" required placeholder="..." className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-display font-black text-lg md:text-xl outline-none focus:border-orange-500/30" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('local_time')}</label>
                    <input 
                      name="time" 
                      type="time" 
                      required 
                      defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold text-lg md:text-xl outline-none focus:border-orange-500/30" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('linked_objective')}</label>
                    <select 
                      name="goalId" 
                      value={selectedGoalIdAdd}
                      onChange={(e) => {
                        setSelectedGoalIdAdd(e.target.value);
                        setSelectedSubGoalsAdd([]);
                      }}
                      className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-display font-black text-lg outline-none focus:border-orange-500/30 appearance-none"
                    >
                      <option value="">{language === 'fa' ? 'بدون هدف' : 'No Goal'}</option>
                      {goals.map(goal => (
                        <option key={goal.id} value={goal.id} className="text-text-primary bg-surface-card">{goal.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Task Sub-goals checklist */}
                  {selectedGoalIdAdd && goals.find(g => g.id === selectedGoalIdAdd)?.subGoals?.length! > 0 && (
                    <div className="md:col-span-2 space-y-4 bg-surface-base/50 p-6 rounded-3xl border border-surface-border">
                      <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-[0.3em]">{t('target_subflows') || 'TARGET SUB-FLOWS'}</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {goals.find(g => g.id === selectedGoalIdAdd)?.subGoals?.map(sg => (
                           <label key={sg.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-base cursor-pointer group transition-all">
                             <input 
                               type="checkbox" 
                               checked={selectedSubGoalsAdd.includes(sg.id)}
                               onChange={(e) => {
                                 if (e.target.checked) setSelectedSubGoalsAdd(prev => [...prev, sg.id]);
                                 else setSelectedSubGoalsAdd(prev => prev.filter(id => id !== sg.id));
                               }}
                               className="w-5 h-5 rounded-md border-2 border-surface-border text-orange-500 focus:ring-orange-500 bg-transparent"
                             />
                             <span className={`text-sm font-black uppercase transition-all ${selectedSubGoalsAdd.includes(sg.id) ? 'text-orange-500' : 'text-text-secondary opacity-60'}`}>
                               {sg.title}
                             </span>
                           </label>
                         ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('target_date')}</label>
                    <input 
                      name="dueDate" 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold text-lg outline-none focus:border-orange-500/30" 
                    />
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

      <section className="space-y-4 relative before:absolute before:left-10 md:before:left-14 before:top-4 before:bottom-4 rtl:before:left-auto rtl:before:right-10 md:rtl:before:right-14 before:w-[1px] before:bg-surface-border before:z-0 pb-20">
         {timelineItems.map((item) => {
           const linkedGoal = goals.find(g => g.id === item.goalId);
           const isTask = item.type === 'TASK';
           return (
            <motion.div 
              layout
              key={item.id} 
              className="relative z-10 flex gap-4 md:gap-8 items-center bg-surface-card backdrop-blur-xl p-4 md:p-6 rounded-[2rem] md:rounded-[3.5rem] border border-surface-border hover:border-brand-primary/20 transition-all shadow-sm group"
            >
                <div className={`w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center border shadow-lg transition-all duration-300 ${item.done ? (isTask ? 'bg-orange-500 text-slate-950' : 'bg-emerald-500 text-slate-950') : 'bg-surface-base border-surface-border text-text-secondary'} shrink-0`}>
                  <span className="text-lg md:text-2xl font-mono font-black leading-none">{item.time.split(':')[0]}</span>
                  <span className="text-[9px] md:text-[11px] font-mono font-black opacity-60">{item.time.split(':')[1]}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-base md:text-3xl font-display font-black uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-tight'} transition-all ${item.done ? 'text-text-secondary line-through opacity-30' : 'text-text-primary'}`}>
                    {item.label}
                  </h4>
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {isTask ? <Clock size={10} className="text-orange-500" /> : <CheckCircle2 size={10} className="text-emerald-500" />}
                        <span className="text-[8px] md:text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest opacity-60">{isTask ? t('status_active') : t('status_completed')}</span>
                      </div>
                      {linkedGoal && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-brand-primary/10">
                          <Plus size={8} className="text-brand-primary" />
                          <span className="text-[8px] md:text-[10px] font-mono font-bold text-brand-primary uppercase">{linkedGoal.title}</span>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isTask ? (
                    <>
                      <button 
                        onClick={() => toggleTask(item.id)}
                        className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.8rem] flex items-center justify-center transition-all active:scale-95 ${item.done ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-surface-base text-text-secondary border border-surface-border'}`}
                      >
                        {item.done ? <CheckCircle2 size={20} md:size={28} strokeWidth={3} /> : <div className="w-5 h-5 border-2 border-current rounded-lg opacity-20" />}
                      </button>
                      
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              deleteTask(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="bg-rose-500 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-rose-500/20"
                          >
                            {language === 'fa' ? 'تایید' : 'CONFIRM'}
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-2 text-text-secondary"
                          >
                             <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 text-text-secondary/40 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={16} md:size={20} />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              deleteActivity(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="bg-rose-500 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-rose-500/20"
                          >
                            {language === 'fa' ? 'تایید' : 'CONFIRM'}
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-2 text-text-secondary"
                          >
                             <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 text-text-secondary/40 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={16} md:size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>
            </motion.div>
           );
         })}

         {timelineItems.length === 0 && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="py-32 text-center border-4 border-dashed border-surface-border rounded-[4rem] bg-surface-card/20 backdrop-blur-md"
           >
              <CalendarDays size={64} strokeWidth={1} className="mx-auto mb-8 text-text-secondary opacity-40" />
              <p className="text-[12px] font-mono font-black text-text-secondary opacity-60 uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                 {t('partition_time')} <br /> Partition Node Time For Execution
              </p>
           </motion.div>
         )}
      </section>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <button 
           onClick={() => setFilter(filter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
           className={`p-10 border rounded-[3rem] relative overflow-hidden group transition-all flex flex-col items-start active:scale-[0.98] ${filter === 'ACTIVE' ? 'bg-orange-500/10 border-orange-500 shadow-xl' : 'bg-surface-card backdrop-blur-xl border-surface-border'}`}
         >
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] rounded-full transition-all ${filter === 'ACTIVE' ? 'bg-orange-500/40' : 'bg-orange-500/10 group-hover:bg-orange-500/20'}`} />
            <Hash className={`${filter === 'ACTIVE' ? 'text-orange-500' : 'text-orange-500/40'} mb-6 group-hover:scale-110 transition-transform self-start`} size={32} />
            <div className="relative z-10 w-full text-left rtl:text-right">
              <h5 className={`text-[10px] font-mono font-black text-text-secondary uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-[0.3em]'} mb-2`}>{t('active_segments')}</h5>
              <p className="text-2xl md:text-4xl font-display font-black text-text-primary leading-none uppercase">{tasks.length} <span className="text-[10px] md:text-sm font-mono text-text-secondary opacity-60">NODES</span></p>
              {filter === 'ACTIVE' && (
                 <span className={`absolute -top-12 ${language === 'fa' ? 'left-0' : 'right-0'} bg-orange-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-widest'}`}>
                   {t('filtered') || 'FILTERED'}
                 </span>
               )}
            </div>
         </button>
         <button 
           onClick={() => setFilter(filter === 'DONE' ? 'ALL' : 'DONE')}
           className={`p-10 border rounded-[3rem] relative overflow-hidden group transition-all flex flex-col items-start active:scale-[0.98] ${filter === 'DONE' ? 'bg-emerald-500/10 border-emerald-500 shadow-xl' : 'bg-surface-card backdrop-blur-xl border-surface-border'}`}
         >
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] rounded-full transition-all ${filter === 'DONE' ? 'bg-emerald-500/40' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'}`} />
            <Timer className={`${filter === 'DONE' ? 'text-emerald-500' : 'text-emerald-500/40'} mb-6 group-hover:scale-110 transition-transform self-start`} size={32} />
            <div className="relative z-10 w-full text-left rtl:text-right">
              <h5 className={`text-[10px] font-mono font-black text-text-secondary uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-[0.3em]'} mb-2`}>{t('completion_load')}</h5>
              <p className="text-2xl md:text-4xl font-display font-black text-text-primary leading-none uppercase">{tasks.filter(t => t.done).length} <span className="text-[10px] md:text-sm font-mono text-text-secondary opacity-60">PULSES</span></p>
              {filter === 'DONE' && (
                 <span className={`absolute -top-12 ${language === 'fa' ? 'left-0' : 'right-0'} bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase ${language === 'fa' ? 'tracking-normal' : 'tracking-widest'}`}>
                   {t('filtered') || 'FILTERED'}
                 </span>
               )}
            </div>
         </button>
      </footer>
    </div>
  );
}

