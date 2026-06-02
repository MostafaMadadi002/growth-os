import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Target, CheckCircle2, Circle, Trophy, Star, Book, Activity, Briefcase } from 'lucide-react';
import { useGoalStore } from './store/useGoalStore';
import { BigGoal, GoalLevel, Milestone } from '../../core/types';

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
      case 'EDUCATION': return <Book size={24} />;
      case 'FITNESS': return <Activity size={24} />;
      case 'TRADING': return <Star size={24} />;
      case 'PROJECT': return <Briefcase size={24} />;
      default: return <Target size={24} />;
    }
  };

  if (selectedGoal) {
    const completedCount = selectedGoal.milestones.filter(m => m.is_completed).length;
    const totalCount = selectedGoal.milestones.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 animate-in slide-in-from-left duration-500" dir="rtl">
        <header className="flex items-center justify-between mb-8">
           <button onClick={() => setSelectedGoal(null)} className="flex items-center text-slate-500 gap-2 font-black uppercase tracking-widest text-xs">
             <ChevronLeft size={20} className="rotate-180" />
             <span>BACK</span>
           </button>
           <h2 className="text-xl font-black text-white tracking-tight">Mission Matrix</h2>
        </header>

        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 mb-8 text-center shadow-2xl relative overflow-hidden">
           <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group hover:scale-110 transition-transform">
              <Trophy className="text-emerald-500" size={48} strokeWidth={2.5} />
           </div>
           <h1 className="text-3xl font-black text-white mb-3 tracking-tight">{selectedGoal.title}</h1>
           <div className="flex items-center justify-center gap-3 text-slate-500 mb-8">
             <span className="text-xs font-black uppercase tracking-widest bg-slate-850 px-3 py-1 rounded-full">{selectedGoal.level}</span>
             <span className="text-sm font-black text-emerald-500">{Math.round(progress)}% ARCHIVED</span>
           </div>
           <div className="w-full h-4 bg-slate-850 rounded-full overflow-hidden p-1">
             <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-24 scrollbar-hide">
           {selectedGoal.milestones.map((m) => (
             <button 
               key={m.id}
               onClick={() => toggleMilestone(selectedGoal.id, m.id)}
               className={`w-full p-6 rounded-[2rem] border flex items-center justify-between transition-all duration-300 ${m.is_completed ? 'bg-slate-900 border-white/10' : 'bg-slate-900/50 border-white/5 opacity-60'}`}
             >
               <div className="flex items-center gap-5">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${m.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>
                    {m.is_completed && <CheckCircle2 size={18} className="text-white" />}
                  </div>
                  <span className={`text-lg font-black tracking-tight ${m.is_completed ? 'text-white' : 'text-slate-400'}`}>{m.title}</span>
               </div>
             </button>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 bg-slate-950" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white tracking-tight">اهداف بلند</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="space-y-6 flex-1 overflow-y-auto pb-32 scrollbar-hide">
        {goals.map(g => (
          <div 
            key={g.id}
            onClick={() => setSelectedGoal(g)}
            className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:bg-slate-850 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 shadow-xl transition-all">
                {getCategoryIcon(g.category)}
              </div>
              <ChevronLeft className="text-slate-700 group-hover:translate-x-[-10px] transition-transform" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{g.title}</h2>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{g.level}</span>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                 {g.milestones.length} MILESTONES
               </span>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <Trophy size={80} className="mb-6" />
             <p className="text-xl font-black uppercase tracking-widest">No Missions Logged</p>
          </div>
        )}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/5 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8 text-center tracking-tight">Initiate New Goal</h3>
            
            <div className="space-y-6 mb-10 overflow-y-auto max-h-[60vh] scrollbar-hide pr-2">
              <div className="space-y-2">
                <input 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Core objective name..."
                  className="w-full bg-slate-850 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-emerald-500 transition-colors text-right font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <select 
                   value={category} 
                   onChange={e => setCategory(e.target.value as any)}
                   className="bg-slate-850 border border-white/5 rounded-2xl p-4 text-white outline-none font-bold text-xs appearance-none text-center"
                 >
                   <option value="EDUCATION">Education</option>
                   <option value="FITNESS">Fitness</option>
                   <option value="TRADING">Trading</option>
                   <option value="PROJECT">Project</option>
                   <option value="PERSONAL">Personal</option>
                 </select>
                 <select 
                   value={level} 
                   onChange={e => setLevel(e.target.value as GoalLevel)}
                   className="bg-slate-850 border border-white/5 rounded-2xl p-4 text-white outline-none font-bold text-xs appearance-none text-center"
                 >
                   {Object.values(GoalLevel).map(l => <option key={l} value={l}>{l}</option>)}
                 </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Milestones</label>
                <div className="flex gap-2">
                  <input 
                    value={milestoneInput}
                    onChange={e => setMilestoneInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && milestoneInput && (setTempMilestones([...tempMilestones, milestoneInput]), setMilestoneInput(''))}
                    placeholder="Add a milestone..."
                    className="flex-1 bg-slate-850 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right text-sm"
                  />
                  <button 
                    onClick={() => { if(milestoneInput) { setTempMilestones([...tempMilestones, milestoneInput]); setMilestoneInput(''); } }}
                    className="bg-slate-800 p-4 rounded-2xl text-white"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {tempMilestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-850 p-4 rounded-xl border border-white/5">
                      <button onClick={() => setTempMilestones(tempMilestones.filter((_, idx) => idx !== i))}><X size={16} className="text-rose-500" /></button>
                      <span className="text-slate-300 font-bold text-sm">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAdd}
                className="flex-[2] bg-emerald-500 py-5 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                Assemble Goal
              </button>
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-slate-850 py-5 rounded-2xl font-black text-slate-500 uppercase tracking-widest"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
