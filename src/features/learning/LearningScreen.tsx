import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Clock, GraduationCap, Target, Layers, Calendar, ChevronRight, X, Layout, Book, Activity, CheckCircle2, Zap } from 'lucide-react';
import { useLearningStore } from './store/useLearningStore';
import { useI18n } from '../../core/store/useI18n';
import { Course, LearningSession } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';

export default function LearningScreen() {
  const { sessions, courses, fetchData, addSession, addCourse } = useLearningStore();
  const { t, dir } = useI18n();
  const [view, setView] = useState<'OVERVIEW' | 'COURSE_ADD' | 'SESSION_ADD'>('OVERVIEW');
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    units: 2,
    total_sessions: 24,
    sessions_per_week: 3,
    start_date: new Date().toISOString().split('T')[0]
  });

  const [newSession, setNewSession] = useState<Partial<LearningSession>>({
    title: '',
    duration_minutes: 45,
    category: 'STUDY',
    course_id: ''
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCourse = async () => {
    if (!newCourse.title) return;
    await addCourse(newCourse as any);
    setView('OVERVIEW');
    setNewCourse({
        title: '',
        units: 2,
        total_sessions: 24,
        sessions_per_week: 3,
        start_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddSession = async () => {
    if (!newSession.title) return;
    await addSession({
        ...newSession,
        date: new Date().toISOString()
    } as any);
    setView('OVERVIEW');
    setNewSession({
        title: '',
        duration_minutes: 45,
        category: 'STUDY',
        course_id: ''
    });
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 md:p-12 overflow-hidden data-grid" dir={dir}>
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">{t('knowledge_repository')}</span>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">{t('learning')}.</h1>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setView('COURSE_ADD')}
             className="command-card !p-5 bg-slate-900/50 hover:bg-slate-800 border-white/5 text-slate-400 hover:text-white transition-all flex items-center gap-3"
           >
             <GraduationCap size={20} />
             <span className="text-[10px] font-mono font-black uppercase tracking-widest">{t('new_course')}</span>
           </button>
           <button 
             onClick={() => setView('SESSION_ADD')}
             className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
           >
             <Plus size={32} />
           </button>
        </div>
      </header>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <StatBlock 
            label={t('study_time_matrix')} 
            value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} 
            icon={<Clock size={24} />} 
            color="text-brand-primary" 
         />
         <StatBlock 
            label={t('active_course_nodes')} 
            value={courses.length.toString()} 
            icon={<Layers size={24} />} 
            color="text-brand-secondary" 
         />
         <StatBlock 
            label={t('weekly_throughput')} 
            value={`${sessions.filter(s => new Date(s.date) > new Date(Date.now() - 7 * 86400000)).length} ${t('session_count')}`} 
            icon={<Activity size={24} />} 
            color="text-orange-500" 
         />
         <StatBlock 
            label={t('synaptic_integrity')} 
            value="92%" 
            icon={<Zap size={24} />} 
            color="text-purple-500" 
         />
      </div>

      <main className="flex-1 overflow-y-auto mb-32 pr-2 scrollbar-hide space-y-12">
        {/* Active Curriculum */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-white/[0.03]" />
             <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-[0.4em]">{t('active_curriculum')}</span>
             <div className="h-px flex-1 bg-white/[0.03]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {courses.map(course => (
               <motion.div 
                 key={course.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="command-card group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all">
                    <GraduationCap size={80} />
                  </div>
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h3 className="text-3xl font-display font-black text-white tracking-tighter mb-2 group-hover:text-brand-primary transition-colors">{course.title}</h3>
                        <div className="flex gap-4">
                           <span className="text-[9px] font-mono font-black text-slate-700 bg-slate-950 px-2 py-1 rounded-sm">{course.units} {t('units_label')}</span>
                           <span className="text-[9px] font-mono font-black text-slate-700 bg-slate-950 px-2 py-1 rounded-sm">{course.sessions_per_week} {t('ses_week')}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-2xl font-mono font-black text-white">12/32</span>
                        <span className="text-[8px] font-mono font-bold text-slate-600 block uppercase tracking-widest">{t('sessions_complete')}</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">
                        <span>{t('course_progress')}</span>
                        <span>37.5%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-950 rounded-full border border-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '37.5%' }}
                          className="h-full bg-brand-primary"
                        />
                     </div>
                  </div>
               </motion.div>
             ))}
             {courses.length === 0 && (
               <button 
                 onClick={() => setView('COURSE_ADD')}
                 className="command-card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center py-20 text-slate-800 hover:text-slate-400 hover:shadow-2xl hover:border-brand-primary/20 transition-all group"
               >
                  <Plus size={48} className="mb-6 opacity-40 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">{t('init_curriculum')}</span>
               </button>
             )}
          </div>
        </section>

        {/* Temporal Logs */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-white/[0.03]" />
             <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-[0.4em]">{t('temporal_buffer')}</span>
             <div className="h-px flex-1 bg-white/[0.03]" />
          </div>

          <div className="space-y-4">
             {sessions.map(s => (
               <div key={s.id} className="command-card group hover:bg-slate-900/80 flex items-center gap-8 py-5">
                  <div className="w-14 h-14 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-brand-primary shadow-xl group-hover:scale-105 transition-all">
                     <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-xl font-display font-black text-white tracking-tighter group-hover:text-brand-primary transition-colors">{s.title}</h4>
                     <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">{new Date(s.date).toLocaleDateString(dir === 'rtl' ? 'fa-IR' : 'en-US', { day: 'numeric', month: 'long' })} // {s.category}</p>
                  </div>
                  <div className="flex items-center gap-3 px-6 h-10 bg-slate-950 border border-white/5 rounded-xl">
                     <Clock size={12} className="text-slate-700" />
                     <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">{s.duration_minutes}m</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-900 group-hover:text-white transition-all">
                     <ChevronRight size={18} />
                  </div>
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {view === 'COURSE_ADD' && (
          <Modal title={t('deploy_node')} onClose={() => setView('OVERVIEW')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
               <div className="space-y-8">
                  <InputField label={t('course_id')} value={newCourse.title!} onChange={v => setNewCourse({...newCourse, title: v})} placeholder="e.g. ADVANCED_REACT_SYSTEMS" />
                  <div className="grid grid-cols-2 gap-6">
                    <InputField label={t('units_credit')} value={newCourse.units?.toString() || ''} type="number" onChange={v => setNewCourse({...newCourse, units: parseInt(v)})} />
                    <InputField label={t('ses_week')} value={newCourse.sessions_per_week?.toString() || ''} type="number" onChange={v => setNewCourse({...newCourse, sessions_per_week: parseInt(v)})} />
                  </div>
               </div>
               <div className="space-y-8">
                  <InputField label={t('sessions_vol')} value={newCourse.total_sessions?.toString() || ''} type="number" onChange={v => setNewCourse({...newCourse, total_sessions: parseInt(v)})} />
                  <InputField label={t('init_date')} value={newCourse.start_date!} type="date" onChange={v => setNewCourse({...newCourse, start_date: v})} />
               </div>
            </div>
            <FormActions onSubmit={handleAddCourse} onAbort={() => setView('OVERVIEW')} submitLabel={t('deploy_node')} />
          </Modal>
        )}

        {view === 'SESSION_ADD' && (
          <Modal title={t('commit_snapshot')} onClose={() => setView('OVERVIEW')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
               <div className="space-y-8">
                  <InputField label={t('session_context')} value={newSession.title!} onChange={v => setNewSession({...newSession, title: v})} placeholder="Topic of focus..." />
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('linked_course')}</label>
                    <select 
                      value={newSession.course_id}
                      onChange={e => setNewSession({...newSession, course_id: e.target.value})}
                      className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white text-sm font-black outline-none focus:border-brand-primary/30 transition-all appearance-none"
                    >
                      <option value="">{t('independent_res')}</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
               </div>
               <div className="space-y-8">
                  <InputField label={t('duration_min')} value={newSession.duration_minutes?.toString() || ''} type="number" onChange={v => setNewSession({...newSession, duration_minutes: parseInt(v)})} />
               </div>
            </div>
            <FormActions onSubmit={handleAddSession} onAbort={() => setView('OVERVIEW')} submitLabel={t('commit_snapshot')} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBlock({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="command-card relative overflow-hidden group">
       <div className={`absolute -right-4 -top-4 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all ${color}`}>
          {icon}
       </div>
       <span className="text-[9px] font-mono font-black text-slate-650 uppercase tracking-widest mb-4 block group-hover:text-slate-500 transition-colors">{label}</span>
       <div className="text-4xl font-mono font-black text-white tracking-tighter">{value}</div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  const { t } = useI18n();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-50 flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-white/[0.05] w-full max-w-4xl rounded-[3rem] p-16 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-12 right-12 w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
          <X size={24} />
        </button>
        <div className="mb-12">
            <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em] mb-4 block">{t('input_protocol')}</span>
            <h3 className="text-5xl font-display font-black text-white tracking-tighter">{title}</h3>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white text-xl font-black outline-none focus:border-brand-primary/30 transition-all placeholder:text-slate-850"
      />
    </div>
  );
}

function FormActions({ onSubmit, onAbort, submitLabel }: { onSubmit: () => void, onAbort: () => void, submitLabel: string }) {
  const { t } = useI18n();
  return (
    <div className="flex gap-6">
      <button 
        onClick={onSubmit}
        className="flex-[2] bg-brand-primary hover:bg-emerald-400 text-slate-950 font-mono font-black uppercase tracking-[0.2em] py-8 rounded-[2rem] transition-all shadow-2xl shadow-brand-primary/20 active:scale-95"
      >
        {submitLabel}
      </button>
      <button 
        onClick={onAbort}
        className="flex-1 bg-slate-800 py-8 rounded-[2rem] font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
      >
        {t('abort_action')}
      </button>
    </div>
  );
}
