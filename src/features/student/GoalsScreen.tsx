import React, { useState } from 'react';
import { 
  Plus, Target, X, CheckCircle2, 
  BookOpen, Briefcase, Rocket, Edit3,
  ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { useAppStore, Goal } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function GoalsScreen() {
  const { t, dir, language } = useI18n();
  const { studentData, addGoal, deleteGoal, updateGoal, toggleSubGoal } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [newSubGoals, setNewSubGoals] = useState<{id: string, title: string, done: boolean}[]>([]);
  const [tempSubGoal, setTempSubGoal] = useState('');

  const handleAddSubGoal = () => {
    if (!tempSubGoal.trim()) return;
    setNewSubGoals([...newSubGoals, { id: Math.random().toString(36).substr(2, 9), title: tempSubGoal, done: false }]);
    setTempSubGoal('');
  };

  const removeSubGoal = (id: string) => {
    setNewSubGoals(newSubGoals.filter(sg => sg.id !== id));
  };

  const getGoalStats = (goalId: string) => {
    const activities = (studentData.activities || []).filter(a => a.goalId === goalId);
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
    return {
      activities,
      totalDuration
    };
  };

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
      duration: Number(formData.get('duration')),
      durationUnit: formData.get('durationUnit') as any,
      startDate: (formData.get('startDate') as string) || new Date().toISOString().split('T')[0],
      selectedDays,
      subGoals: newSubGoals
    };
    addGoal(goal);
    setIsAdding(false);
    setNewSubGoals([]);
  };

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGoal) return;
    
    const formData = new FormData(e.currentTarget);
    const selectedDays = Array.from(formData.getAll('days')).map(Number);
    
    const updatedGoal: Goal = {
      ...editingGoal,
      title: formData.get('title') as string,
      totalSessions: Number(formData.get('totalSessions')),
      frequencyPerWeek: Number(formData.get('frequencyPerWeek')) || selectedDays.length,
      category: formData.get('category') as any,
      duration: Number(formData.get('duration')),
      durationUnit: formData.get('durationUnit') as any,
      startDate: formData.get('startDate') as string,
      selectedDays,
      subGoals: newSubGoals
    };
    
    updateGoal(updatedGoal);
    setEditingGoal(null);
    setNewSubGoals([]);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setNewSubGoals(goal.subGoals || []);
  };

  return (
    <div className="p-4 md:p-12 space-y-8 md:space-y-12 max-w-4xl mx-auto w-full rtl:font-farsi">
      <header className="flex justify-between items-center md:items-end">
        <div>
           <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_12px_#10b981]" />
              <span className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">{t('strategic_objectives')}</span>
           </div>
           <h1 className="text-3xl md:text-6xl font-display font-black text-text-primary tracking-tighter uppercase leading-none">
             {t('branch_goals').split(' ')[0]}<span className="text-brand-primary">.</span>
           </h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/10 backdrop-blur-xl border border-brand-primary/30 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary shadow-2xl shadow-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all duration-500 active:scale-95"
        >
          <Plus size={24} md:size={28} strokeWidth={3} />
        </button>
      </header>

      <AnimatePresence>
        {(isAdding || editingGoal) && (
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
                onSubmit={isAdding ? handleAddGoal : handleUpdateGoal} 
                className="bg-surface-card border border-surface-border p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide space-y-8 md:space-y-10 shadow-2xl relative"
             >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingGoal(null); }} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8 text-text-secondary hover:text-text-primary transition-colors bg-surface-base p-2 rounded-full z-20"
                >
                   <X size={18} md:size={20} />
                </button>
                
                <h2 className="text-3xl font-display font-black text-text-primary">{isAdding ? t('establish_objective') : t('edit_goal') || 'EDIT_GOAL'}</h2>

                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('objective_header')}</label>
                   <input 
                     name="title" 
                     required 
                     defaultValue={editingGoal?.title || ''}
                     placeholder={language === 'fa' ? 'مثلاً: تسلط بر هوش مصنوعی' : 'e.g. Master AI Fundamentals'} 
                     className="w-full bg-surface-base border border-surface-border rounded-2xl p-6 text-text-primary font-display font-black text-2xl placeholder:text-text-secondary/30 outline-none focus:border-brand-primary/30 transition-all" 
                   />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('total_required_sessions')}</label>
                      <input 
                        name="totalSessions" 
                        type="number" 
                        required 
                        defaultValue={editingGoal?.totalSessions || 30}
                        className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold outline-none focus:border-brand-primary/20" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('sessions_per_week') || 'SESSIONS PER WEEK'}</label>
                      <input 
                        name="frequencyPerWeek" 
                        type="number" 
                        required 
                        defaultValue={editingGoal?.frequencyPerWeek || 3}
                        className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold outline-none focus:border-brand-primary/20" 
                      />
                   </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('duration') || 'DURATION'}</label>
                    <div className="flex gap-4">
                      <input 
                        name="duration" 
                        type="number" 
                        required 
                        defaultValue={editingGoal?.duration || 1}
                        className="flex-1 bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold outline-none focus:border-brand-primary/20" 
                      />
                      <select 
                        name="durationUnit"
                        defaultValue={editingGoal?.durationUnit || 'MONTHS'}
                        className="w-32 bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold outline-none focus:border-brand-primary/20 appearance-none"
                      >
                         <option value="DAYS">{t('days')}</option>
                         <option value="WEEKS">{t('weeks')}</option>
                         <option value="MONTHS">{t('months')}</option>
                      </select>
                    </div>
                 </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('scheduled_days')}</label>
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
                        <input 
                          type="checkbox" 
                          name="days" 
                          value={day.id} 
                          className="hidden peer" 
                          defaultChecked={editingGoal ? editingGoal.selectedDays?.includes(day.id) : day.id !== 5} 
                        />
                        <div className="px-4 py-2 rounded-xl bg-surface-base border border-surface-border text-[10px] font-black text-text-secondary peer-checked:bg-brand-primary/10 peer-checked:text-brand-primary peer-checked:border-brand-primary/30 transition-all">
                          {day.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('start_date')}</label>
                   <input 
                     name="startDate" 
                     type="date" 
                     defaultValue={editingGoal?.startDate || new Date().toISOString().split('T')[0]}
                     className="w-full bg-surface-base border border-surface-border rounded-2xl p-5 text-text-primary font-mono font-bold outline-none focus:border-brand-primary/20" 
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('core_domain')}</label>
                   <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'STUDY', icon: <BookOpen size={22} />, label: t('education') },
                        { id: 'WORK', icon: <Briefcase size={22} />, label: t('trading_cat') },
                        { id: 'PROJECT', icon: <Rocket size={22} />, label: t('project') }
                      ].map(cat => (
                        <label key={cat.id} className="flex flex-col items-center gap-4 p-5 rounded-3xl border border-surface-border bg-surface-base cursor-pointer has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/10 group transition-all duration-300">
                           <input type="radio" name="category" value={cat.id} className="hidden" defaultChecked={editingGoal ? editingGoal.category === cat.id : cat.id === 'STUDY'} />
                           <div className="text-text-secondary group-has-[:checked]:text-brand-primary group-has-[:checked]:scale-110 transition-all">
                              {cat.icon}
                           </div>
                           <span className="text-[10px] font-black uppercase text-text-secondary group-has-[:checked]:text-brand-primary opacity-60 group-has-[:checked]:opacity-100">{cat.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('checklist') || 'CHECKLIST'}</label>
                    <div className="flex gap-4">
                      <input 
                        value={tempSubGoal}
                        onChange={(e) => setTempSubGoal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubGoal())}
                        placeholder={t('add_item') || 'Add task...'}
                        className="flex-1 bg-surface-base border border-surface-border rounded-2xl p-4 text-text-primary font-sans text-sm focus:border-brand-primary/20 outline-none"
                      />
                      <button 
                         type="button"
                         onClick={handleAddSubGoal}
                         className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center hover:bg-brand-primary hover:text-slate-950 transition-all"
                      >
                         <Plus size={20} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                       {newSubGoals.map(sg => (
                         <div key={sg.id} className="flex items-center justify-between p-4 bg-surface-base rounded-2xl border border-surface-border">
                            <span className="text-sm font-sans text-text-secondary">{sg.title}</span>
                            <button type="button" onClick={() => removeSubGoal(sg.id)} className="text-text-secondary hover:text-rose-500 transition-colors">
                               <X size={16} />
                            </button>
                         </div>
                       ))}
                    </div>
                </div>

                <button type="submit" className="w-full py-7 bg-brand-primary text-slate-950 rounded-3xl font-display font-black text-xl uppercase shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                   {isAdding ? t('establish_objective') : t('save_changes') || 'SAVE CHANGES'}
                </button>
             </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 gap-8">
         {(studentData.goals || []).map((goal) => {
           const { activities, totalDuration } = getGoalStats(goal.id);
           const isExpanded = expandedGoalId === goal.id;

           return (
            <motion.div 
              layout
              key={goal.id} 
              className="group"
            >
              <div className="bg-surface-card border border-surface-border p-8 md:p-10 rounded-[3rem] group-hover:bg-surface-card group-hover:border-brand-primary/20 transition-all duration-500 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-surface-base rounded-2xl flex items-center justify-center text-brand-primary border border-surface-border shadow-inner cursor-pointer transition-transform hover:scale-110 active:scale-95" onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}>
                         {goal.category === 'STUDY' ? <BookOpen size={24} /> : goal.category === 'WORK' ? <Briefcase size={24} /> : <Rocket size={24} />}
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-3">
                           <h3 className="text-3xl font-display font-black text-text-primary uppercase tracking-tight leading-none mb-2 group-hover:text-brand-primary transition-colors cursor-pointer" onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}>{goal.title}</h3>
                           <button 
                             onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                             className="text-text-secondary hover:text-brand-primary transition-colors"
                           >
                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                           </button>
                         </div>
                         <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest bg-surface-base px-3 py-1 rounded-lg opacity-60">
                              {goal.selectedDays?.length || goal.frequencyPerWeek} {t('ses_week')}
                            </span>
                            <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest bg-surface-base px-3 py-1 rounded-lg opacity-60">
                              {goal.duration} {t(goal.durationUnit?.toLowerCase() || 'months')}
                            </span>
                            <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest bg-surface-base px-3 py-1 rounded-lg flex items-center gap-2 opacity-80">
                              <Clock size={10} />
                              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                            </span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-end px-2">
                         <span className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-wider opacity-60">{t('progress_rate')}: {Math.round((goal.completedSessions / goal.totalSessions) * 100)}%</span>
                         <span className="text-[11px] font-mono font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">{goal.completedSessions} / {goal.totalSessions}</span>
                      </div>
                      <div className="h-3 w-full bg-surface-base rounded-full overflow-hidden p-[2px] border border-surface-border">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(goal.completedSessions / goal.totalSessions) * 100}%` }}
                           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                           className="h-full bg-gradient-to-r from-brand-primary/50 to-brand-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                         />
                      </div>
                   </div>
                </div>
  
                <div className="flex md:flex-col gap-4">
                   <button 
                     onClick={() => openEdit(goal)}
                     className="flex-1 md:flex-none h-16 md:w-48 rounded-[1.5rem] bg-brand-primary shadow-xl shadow-brand-primary/10 flex items-center justify-center gap-4 font-black text-[12px] uppercase tracking-widest text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                   >
                      <Edit3 size={18} strokeWidth={3} />
                      {t('edit_goal') || 'EDIT'}
                   </button>
                   <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="w-16 h-16 md:w-48 md:h-12 rounded-[1.25rem] bg-surface-base border border-surface-border text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center justify-center px-4 gap-2"
                   >
                      <X size={18} />
                      <span className="hidden md:block text-[10px] uppercase font-black">{language === 'fa' ? 'حذف' : 'DELETE'}</span>
                   </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-surface-card/30 rounded-[2.5rem] border border-surface-border mt-4"
                  >
                    <div className="p-8 space-y-8">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-[11px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">{t('session_history') || 'SESSION LOG'}</h4>
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] font-mono text-text-secondary opacity-60">{t('total_duration') || 'TOTAL'}: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                          <span className="text-[10px] font-mono text-text-secondary opacity-60">{t('total_sessions') || 'SESSIONS'}: {activities.length}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {goal.subGoals && goal.subGoals.length > 0 && (
                          <div className="mb-8 space-y-4">
                            <h5 className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest">{t('milestones') || 'MILESTONES'}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {goal.subGoals.map(sg => (
                                 <button 
                                   key={sg.id}
                                   onClick={() => toggleSubGoal(goal.id, sg.id)}
                                   className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${sg.done ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                                 >
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${sg.done ? 'bg-brand-primary border-brand-primary text-slate-900' : 'border-white/10'}`}>
                                       {sg.done && <CheckCircle2 size={12} strokeWidth={4} />}
                                    </div>
                                    <span className={`text-xs font-sans font-bold flex-1 text-left rtl:text-right ${sg.done ? 'line-through opacity-60' : ''}`}>{sg.title}</span>
                                 </button>
                               ))}
                            </div>
                          </div>
                        )}

                        {activities.length > 0 ? activities.sort((a, b) => b.date.localeCompare(a.date)).map(activity => (
                          <div key={activity.id} className="flex items-center justify-between p-5 bg-surface-base/50 rounded-2xl border border-surface-border group/session hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_#10b981]" />
                              <div>
                                <p className="text-sm font-display font-black text-text-primary uppercase tracking-tight">{activity.title}</p>
                                <p className="text-[10px] font-mono text-text-secondary opacity-60">{activity.date} • {activity.time || '00:00'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-mono font-black text-brand-primary">{activity.duration}m</p>
                              <p className="text-[9px] font-mono text-text-secondary uppercase opacity-40">{activity.sessions} {t('sessions')}</p>
                            </div>
                          </div>
                        )) : (
                          <div className="py-20 text-center bg-surface-base/20 rounded-3xl border border-dashed border-surface-border">
                            <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em] opacity-40">{t('no_sessions') || 'NO SESSIONS RECORDED'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
           );
         })}

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

