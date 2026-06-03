import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Target, Trophy, Star, Book, Activity, Briefcase, X, Calendar, MoreHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useGoalStore } from './stores/goalStore';
import { BigGoal, GoalLevel, Milestone } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressRing } from '../../components/ProgressRing';

export default function GoalsScreen() {
  const { goals, isLoading, fetchGoals, addGoal, toggleMilestone } = useGoalStore();
  const { t } = useI18n();
  const [selectedGoal, setSelectedGoal] = useState<BigGoal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [level, setLevel] = useState<GoalLevel>(GoalLevel.WEEKLY);
  const [category, setCategory] = useState<BigGoal['category']>('PERSONAL');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [tempMilestones, setTempMilestones] = useState<string[]>([]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAdd = async () => {
    if (!newTitle) return;
    const milestones: Milestone[] = tempMilestones.map(title => ({
      id: Math.random().toString(36).substring(2, 9),
      title,
      is_completed: false
    }));

    await addGoal({
      title: newTitle,
      level,
      category,
      milestones,
      start_date: new Date().toISOString()
    });
    setNewTitle('');
    setTempMilestones([]);
    setShowAdd(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'EDUCATION': return <Book size={20} />;
      case 'FITNESS': return <Activity size={20} />;
      case 'TRADING': return <Star size={20} />;
      case 'PROJECT': return <Briefcase size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'EDUCATION': return 'bg-purple-500';
      case 'FITNESS': return 'bg-orange-500';
      case 'TRADING': return 'bg-yellow-500';
      case 'PROJECT': return 'bg-blue-500';
      default: return 'bg-emerald-500';
    }
  };

  if (selectedGoal) {
    const completedCount = (selectedGoal.milestones || []).filter(m => m.is_completed).length;
    const totalCount = selectedGoal.milestones?.length || 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden data-grid"
      >
        <header className="flex items-center justify-between mb-10">
           <button 
             onClick={() => setSelectedGoal(null)} 
             className="flex items-center text-slate-500 gap-3 hover:text-white transition-colors"
           >
             <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                <ChevronLeft size={20} />
             </div>
             <span className="text-[10px] font-mono font-black uppercase tracking-widest">EXIT_NODE // {t('dashboard')}</span>
           </button>
           <button className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-500">
             <MoreHorizontal size={20} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-32">
          {/* Hero Objective Card */}
          <div className="command-card !p-12 mb-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-12 opacity-5 scale-150 ${getCategoryColor(selectedGoal.category)} rounded-full blur-[80px]`} />
            
            <div className="flex flex-col items-center text-center relative z-10">
               <div className={`w-24 h-24 ${getCategoryColor(selectedGoal.category)} rounded-3xl flex items-center justify-center text-slate-950 mb-10 shadow-2xl relative`}>
                  {getCategoryIcon(selectedGoal.category)}
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-30" />
               </div>
               <h1 className="text-5xl font-display font-black text-white mb-4 tracking-tighter">{selectedGoal.title}</h1>
               <div className="flex items-center gap-4 text-slate-500 mb-12 text-[10px] font-mono font-black uppercase tracking-widest">
                  <span className="bg-slate-950 px-5 py-2 rounded-lg border border-white/5">{selectedGoal.level}_HORIZON</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-primary" />
                    ACTIVATED: {new Date(selectedGoal.start_date || '').toLocaleDateString()}
                  </span>
               </div>
               
               <div className="w-full space-y-5">
                  <div className="flex justify-between items-end px-2">
                     <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Objective_Saturation</span>
                     <span className="text-3xl font-mono font-black text-brand-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${getCategoryColor(selectedGoal.category)} rounded-full shadow-[0_0_20px_#10b981]`} 
                    />
                  </div>
               </div>
            </div>
          </div>

          <h3 className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-8 mb-8">Strategic_Roadmap // Milestones</h3>
          <div className="space-y-6">
             {(selectedGoal.milestones || []).map((m, idx) => (
               <motion.button 
                 key={m.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 onClick={() => toggleMilestone(selectedGoal.id, m.id)}
                 className={`w-full p-10 rounded-[2.5rem] border flex items-center justify-between transition-all group relative overflow-hidden ${m.is_completed ? 'bg-slate-900 border-white/10' : 'bg-slate-900/30 border-white/5 border-dashed hover:bg-slate-900/50'}`}
               >
                 <div className="flex items-center gap-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${m.is_completed ? 'bg-brand-primary text-slate-950 shadow-2xl shadow-brand-primary/20' : 'bg-slate-950 text-slate-700 border border-white/5'}`}>
                      {m.is_completed ? <Trophy size={24} /> : <div className="text-sm font-mono font-black">{idx + 1}</div>}
                    </div>
                    <span className={`text-2xl font-display font-black tracking-tighter text-left ${m.is_completed ? 'text-white' : 'text-slate-500'}`}>{m.title}</span>
                 </div>
                 {m.is_completed && <div className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.3em] relative z-10">{t('secured')}</div>}
               </motion.button>
             ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-base p-8 md:p-12 overflow-hidden data-grid">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_10px_#3b82f6]" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Strategic Operations // Focus Hub</span>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">{t('goals')}.</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-brand-primary p-6 rounded-2xl text-slate-950 shadow-2xl shadow-brand-primary/20 active:scale-95 transition-all hover:bg-emerald-400 group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto space-y-8 pb-40 scrollbar-hide">
        {goals.map((g, idx) => {
           const completed = (g.milestones || []).filter(m => m.is_completed).length;
           const total = g.milestones?.length || 0;
           const prog = total > 0 ? (completed / total) * 100 : 0;
           
           return (
             <motion.div 
               key={g.id}
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => setSelectedGoal(g)}
               className="command-card cursor-pointer group relative overflow-hidden flex flex-col md:flex-row gap-12 items-center"
             >
               <div className="relative">
                  <div className={`w-32 h-32 ${getCategoryColor(g.category)} rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl group-hover:scale-105 transition-transform duration-500`}>
                    {React.cloneElement(getCategoryIcon(g.category) as React.ReactElement, { size: 36, strokeWidth: 2.5 })}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 flex items-center gap-2 shadow-2xl">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                     <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest">{Math.round(prog)}%</span>
                  </div>
               </div>

               <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <span className="text-[10px] font-mono font-black text-brand-secondary uppercase tracking-[0.3em] bg-brand-secondary/10 px-4 py-1 rounded-sm border border-brand-secondary/20">{g.level}</span>
                    <div className="w-1 h-3 bg-slate-800 rounded-full" />
                    <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">{g.category}</span>
                  </div>
                  <h2 className="text-5xl font-display font-black text-white mb-3 tracking-tighter group-hover:text-brand-primary transition-colors">{g.title}</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">Tactical objective tracking growth through consistent milestone execution and automated performance logs.</p>
               </div>

               <div className="flex flex-col items-end gap-6 pt-4 md:pt-0">
                  <div className="flex -space-x-3">
                     {(g.milestones?.slice(0, 4) || []).map((m, i) => (
                       <div key={i} className={`w-12 h-12 rounded-xl border-2 border-slate-950 flex items-center justify-center text-white transition-all shadow-xl ${m.is_completed ? 'bg-brand-primary' : 'bg-slate-900 border-white/5 opacity-50 shadow-inner'}`}>
                         {m.is_completed ? <CheckCircle2 size={18} strokeWidth={3} /> : <div className="text-[10px] font-mono font-black">{i+1}</div>}
                       </div>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                     MANIFEST_LINK <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
               </div>
               
               {/* Progress Scan Bar */}
               <div className="absolute bottom-0 left-0 h-[1px] w-full bg-white/[0.02] overflow-hidden">
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: `${-100 + prog}%` }}
                    className="absolute inset-y-0 w-full bg-brand-primary shadow-[0_0_15px_#10b981]" 
                  />
               </div>
             </motion.div>
           );
        })}
        
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-slate-850">
             <Trophy size={140} strokeWidth={0.5} className="mb-12 opacity-10" />
             <p className="text-[11px] font-mono font-black uppercase tracking-[0.6em] opacity-30">Strategic Hub Empty // No Active Missions Found</p>
          </div>
        )}
      </main>

      {/* Creation Overlay */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/[0.05] w-full max-w-2xl rounded-[3rem] p-16 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAdd(false)} 
                className="absolute top-12 right-12 w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              
              <div className="mb-12">
                 <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em] mb-4 block">Strategic Initiative Initialization</span>
                 <h3 className="text-5xl font-display font-black text-white tracking-tighter">Initiate Mission.</h3>
              </div>
              
              <div className="space-y-10 mb-16 overflow-y-auto max-h-[45vh] scrollbar-hide pr-2">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">The Strategic Objective</label>
                  <input 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Full-Stack Mastery"
                    className="w-full bg-slate-950 border border-white/[0.03] rounded-3xl p-8 text-white text-2xl font-black outline-none focus:border-brand-primary/30 transition-all placeholder:text-slate-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">Domain Category</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white font-mono font-black text-xs outline-none appearance-none cursor-pointer hover:bg-slate-900"
                    >
                      <option value="EDUCATION">Education_Stream</option>
                      <option value="FITNESS">Fitness_Stream</option>
                      <option value="TRADING">Trading_Stream</option>
                      <option value="PROJECT">Project_Stream</option>
                      <option value="PERSONAL">Personal_Stream</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">Strategic Horizon</label>
                    <select 
                      value={level} 
                      onChange={e => setLevel(e.target.value as GoalLevel)}
                      className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white font-mono font-black text-xs outline-none appearance-none cursor-pointer hover:bg-slate-900"
                    >
                      {Object.values(GoalLevel).map(l => <option key={l} value={l}>{l}_TERM_STRATEGY</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">Tactical Milestones</label>
                  <div className="flex gap-4">
                    <input 
                      value={milestoneInput}
                      onChange={e => setMilestoneInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && milestoneInput && (setTempMilestones([...tempMilestones, milestoneInput]), setMilestoneInput(''))}
                      placeholder="Define tactical step..."
                      className="flex-1 bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white text-sm font-bold outline-none focus:border-brand-primary/30 placeholder:text-slate-800"
                    />
                    <button 
                      onClick={() => { if(milestoneInput) { setTempMilestones([...tempMilestones, milestoneInput]); setMilestoneInput(''); } }}
                      className="bg-brand-primary p-6 rounded-2xl text-slate-950 shadow-xl"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {tempMilestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950/30 p-6 rounded-2xl border border-white/[0.05] group">
                        <span className="text-slate-300 font-mono font-bold text-xs">{m}</span>
                        <button onClick={() => setTempMilestones(tempMilestones.filter((_, idx) => idx !== i))} className="text-slate-700 hover:text-rose-500 transition-colors">
                           <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={handleAdd}
                  disabled={!newTitle}
                  className="flex-[2] bg-brand-primary hover:bg-emerald-400 py-8 rounded-[2rem] font-mono font-black text-slate-950 uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 active:scale-95 transition-all disabled:opacity-30"
                >
                  Initiate Mission_Protocol
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-800 py-8 rounded-[2rem] font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
