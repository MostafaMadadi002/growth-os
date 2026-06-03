import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Target, Trophy, Star, Book, Activity, Briefcase, X, Calendar, MoreHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGoalStore } from './stores/goalStore';
import { BigGoal, GoalLevel, Milestone } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressRing } from '../../components/ProgressRing';

export default function GoalsScreen() {
  const { goals, isLoading, fetchGoals, addGoal, toggleMilestone } = useGoalStore();
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
        className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden"
      >
        <header className="flex items-center justify-between mb-10">
           <button 
             onClick={() => setSelectedGoal(null)} 
             className="flex items-center text-slate-500 gap-3 hover:text-white transition-colors"
           >
             <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                <ChevronLeft size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
           </button>
           <button className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-500">
             <MoreHorizontal size={20} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-32">
          {/* Hero Objective Card */}
          <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-10 mb-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-12 opacity-5 scale-150 ${getCategoryColor(selectedGoal.category)} rounded-full blur-[80px]`} />
            
            <div className="flex flex-col items-center text-center relative z-10">
               <div className={`w-20 h-20 ${getCategoryColor(selectedGoal.category)} rounded-3xl flex items-center justify-center text-slate-950 mb-8 shadow-2xl`}>
                  {getCategoryIcon(selectedGoal.category)}
               </div>
               <h1 className="text-4xl font-display font-black text-white mb-3 tracking-tighter">{selectedGoal.title}</h1>
               <div className="flex items-center gap-3 text-slate-500 mb-10 text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-slate-850 px-4 py-1.5 rounded-full border border-white/5">{selectedGoal.level}</span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    Started {new Date(selectedGoal.start_date || '').toLocaleDateString()}
                  </span>
               </div>
               
               <div className="w-full space-y-4">
                  <div className="flex justify-between items-end px-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Progress</span>
                     <span className="text-2xl font-display font-black text-emerald-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-850 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${getCategoryColor(selectedGoal.category)} rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]`} 
                    />
                  </div>
               </div>
            </div>
          </div>

          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6 mb-6">Execution Roadmap</h3>
          <div className="space-y-4">
             {(selectedGoal.milestones || []).map((m, idx) => (
               <motion.button 
                 key={m.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 onClick={() => {
                   toggleMilestone(selectedGoal.id, m.id);
                   // Dynamic update for the local state if needed
                 }}
                 className={`w-full p-8 rounded-[2.5rem] border flex items-center justify-between transition-all group ${m.is_completed ? 'bg-slate-900 border-white/10' : 'bg-slate-900/30 border-white/5 border-dashed hover:bg-slate-900/50'}`}
               >
                 <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${m.is_completed ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-950 text-slate-700'}`}>
                      {m.is_completed ? <Trophy size={20} /> : <div className="text-xs font-black">{idx + 1}</div>}
                    </div>
                    <span className={`text-xl font-display font-bold tracking-tight text-left ${m.is_completed ? 'text-white' : 'text-slate-500'}`}>{m.title}</span>
                 </div>
                 {m.is_completed && <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Completed</div>}
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
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">Objectives.</h1>
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
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => setSelectedGoal(g)}
               className="command-card cursor-pointer group relative overflow-hidden flex flex-col md:flex-row gap-10 items-center"
             >
               <div className="relative">
                  <div className={`w-28 h-28 ${getCategoryColor(g.category)} rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl group-hover:scale-105 transition-transform duration-500`}>
                    {React.cloneElement(getCategoryIcon(g.category) as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1 shadow-2xl">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                     <span className="text-[8px] font-mono font-bold text-white uppercase tracking-widest">{Math.round(prog)}%</span>
                  </div>
               </div>

               <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                    <span className="text-[9px] font-mono font-black text-brand-secondary uppercase tracking-[0.3em]">{g.level}</span>
                    <div className="w-1 h-3 bg-slate-800 rounded-full" />
                    <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">{g.category}</span>
                  </div>
                  <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tighter group-hover:text-brand-primary transition-colors">{g.title}</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">Tactical objective targeting growth through consistent milestone execution and performance monitoring.</p>
               </div>

               <div className="flex flex-col items-end gap-6 pt-4 md:pt-0">
                  <div className="flex -space-x-3">
                     {(g.milestones?.slice(0, 4) || []).map((m, i) => (
                       <div key={i} className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center text-white transition-all ${m.is_completed ? 'bg-brand-primary' : 'bg-slate-800 opacity-30 shadow-inner'}`}>
                         {m.is_completed ? <CheckCircle2 size={16} strokeWidth={3} /> : <div className="text-[10px] font-mono font-black">{i+1}</div>}
                       </div>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                     Operational_Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
               
               {/* Progress Scan Bar */}
               <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-800 overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: `${-100 + prog}%` }}
                    className="h-full bg-brand-primary shadow-[0_0_10px_#10b981]" 
                  />
               </div>
             </motion.div>
           );
        })}
        
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-850">
             <Trophy size={100} strokeWidth={1} className="mb-8 opacity-20" />
             <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] opacity-40">Strategic Hub Empty // No Active Missions</p>
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
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/5 w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative"
            >
              <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <h3 className="text-4xl font-display font-black text-white mb-2 tracking-tighter">Initiate Objective</h3>
              <p className="text-slate-500 text-sm mb-10">Define your core mission and break it down into tactical milestones.</p>
              
              <div className="space-y-8 mb-12 overflow-y-auto max-h-[50vh] scrollbar-hide pr-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Primary Goal</label>
                  <input 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Full-Stack Mastery"
                    className="w-full bg-slate-950 border border-white/5 rounded-3xl p-6 text-white text-xl font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Category</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/5 rounded-3xl p-5 text-white font-bold text-sm outline-none appearance-none"
                    >
                      <option value="EDUCATION">Education</option>
                      <option value="FITNESS">Fitness</option>
                      <option value="TRADING">Trading</option>
                      <option value="PROJECT">Project</option>
                      <option value="PERSONAL">Personal</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Horizon</label>
                    <select 
                      value={level} 
                      onChange={e => setLevel(e.target.value as GoalLevel)}
                      className="w-full bg-slate-950 border border-white/5 rounded-3xl p-5 text-white font-bold text-sm outline-none appearance-none"
                    >
                      {Object.values(GoalLevel).map(l => <option key={l} value={l}>{l.toLowerCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Strategic Milestones</label>
                  <div className="flex gap-3">
                    <input 
                      value={milestoneInput}
                      onChange={e => setMilestoneInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && milestoneInput && (setTempMilestones([...tempMilestones, milestoneInput]), setMilestoneInput(''))}
                      placeholder="Add tactical step..."
                      className="flex-1 bg-slate-950 border border-white/5 rounded-3xl p-5 text-white text-sm outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={() => { if(milestoneInput) { setTempMilestones([...tempMilestones, milestoneInput]); setMilestoneInput(''); } }}
                      className="bg-slate-800 p-5 rounded-3xl text-white"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {tempMilestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950/50 p-5 rounded-2xl border border-white/5 group">
                        <span className="text-slate-300 font-bold text-sm">{m}</span>
                        <button onClick={() => setTempMilestones(tempMilestones.filter((_, idx) => idx !== i))} className="text-slate-700 hover:text-rose-500 transition-colors">
                           <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAdd}
                  disabled={!newTitle}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-400 py-6 rounded-3xl font-black text-slate-950 uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  Initiate Mission
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-800 py-6 rounded-3xl font-black text-slate-500 uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
