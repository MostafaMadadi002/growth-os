import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Check, Minus, Hash, Flame, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { useHabitStore } from './stores/habitStore';
import { HabitStatus, HabitType, Habit } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';

export default function HabitsScreen() {
  const { habits, todayLogs, fetchHabits, addHabit, logHabit, deleteHabit } = useHabitStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isGood, setIsGood] = useState(true);
  const [type, setType] = useState<HabitType>(HabitType.BINARY);
  const [targetValue, setTargetValue] = useState<number>(1);
  const [unit, setUnit] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAdd = async () => {
    if (!newTitle) return;
    await addHabit({ 
      title: newTitle, 
      is_good: isGood, 
      frequency: 'DAILY',
      type,
      target_value: type === HabitType.QUANTITATIVE ? targetValue : undefined,
      unit: type === HabitType.QUANTITATIVE ? unit : undefined
    });
    setNewTitle('');
    setUnit('');
    setShowAdd(false);
  };

  const getLog = (habitId: string) => {
    return todayLogs[habitId];
  };

  const goodHabits = habits.filter(h => h.is_good);
  const badHabits = habits.filter(h => !h.is_good);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Patterns</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter">Rituals</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-5 rounded-[2rem] text-slate-950 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-400"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto space-y-12 pb-32 scrollbar-hide">
        {/* Positive Growth Section */}
        <section>
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Sparkles size={18} />
               </div>
               <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Ascending Patterns</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{goodHabits.length} ACTIVE</span>
          </div>
          
          <div className="space-y-4">
            {goodHabits.map((h, i) => (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <HabitItem 
                  habit={h} 
                  log={getLog(h.id)} 
                  onLog={(s, v) => logHabit(h.id, s, today, v)} 
                  onDelete={() => deleteHabit(h.id)}
                />
              </motion.div>
            ))}
            {goodHabits.length === 0 && (
              <div className="p-10 bg-slate-900/30 border border-white/5 border-dashed rounded-[2.5rem] text-center">
                 <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No primary rituals established</p>
              </div>
            )}
          </div>
        </section>

        {/* Breaking Patterns Section */}
        <section>
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                  <Flame size={18} />
               </div>
               <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Descending Patterns</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{badHabits.length} ACTIVE</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {badHabits.map((h, i) => (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                <HabitItem 
                  habit={h} 
                  log={getLog(h.id)} 
                  onLog={(s, v) => logHabit(h.id, s, today, v)} 
                  onDelete={() => deleteHabit(h.id)}
                />
              </motion.div>
            ))}
            {badHabits.length === 0 && (
              <div className="p-10 bg-slate-900/30 border border-white/5 border-dashed rounded-[2.5rem] text-center">
                 <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">System clean of negative loops</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Creation Overlay */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/5 w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative"
            >
              <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <h3 className="text-4xl font-display font-black text-white mb-2 tracking-tighter">Define Ritual</h3>
              <p className="text-slate-500 text-sm mb-12">Establish a new neural circuit through consistent repetition.</p>
              
              <div className="space-y-8 mb-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">The Action</label>
                  <input 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Deep Meditation"
                    className="w-full bg-slate-950 border border-white/5 rounded-3xl p-6 text-white text-xl font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Intent</label>
                    <div className="flex gap-2 p-2 bg-slate-950 rounded-[2rem] border border-white/5">
                      <button 
                        onClick={() => setIsGood(true)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isGood ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
                      >
                        Ascend
                      </button>
                      <button 
                        onClick={() => setIsGood(false)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!isGood ? 'bg-rose-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
                      >
                        Descend
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Measurement</label>
                    <div className="flex gap-2 p-2 bg-slate-950 rounded-[2rem] border border-white/5">
                      <button 
                        onClick={() => setType(HabitType.BINARY)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${type === HabitType.BINARY ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                      >
                        Toggle
                      </button>
                      <button 
                        onClick={() => setType(HabitType.QUANTITATIVE)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${type === HabitType.QUANTITATIVE ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                      >
                        Value
                      </button>
                    </div>
                  </div>
                </div>

                {type === HabitType.QUANTITATIVE && (
                  <div className="flex gap-4 p-6 bg-slate-950 rounded-3xl border border-white/5">
                    <div className="flex-1 space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-2">Target Quantity</label>
                       <input 
                         type="number"
                         value={targetValue}
                         onChange={e => setTargetValue(Number(e.target.value))}
                         className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white text-center font-bold"
                       />
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-2">Metric Unit</label>
                       <input 
                         value={unit}
                         onChange={e => setUnit(e.target.value)}
                         placeholder="min, reps, L"
                         className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white text-center font-bold"
                       />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAdd}
                  disabled={!newTitle}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-400 py-6 rounded-3xl font-black text-slate-950 uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Establish Ritual
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-800 py-6 rounded-3xl font-black text-slate-500 uppercase tracking-widest"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HabitItem({ habit, log, onLog, onDelete }: { habit: Habit, log?: any, onLog: (s: HabitStatus, v?: number) => void, onDelete: () => void }) {
  const status = log?.status;
  const isDone = status === HabitStatus.DONE;

  return (
    <div className={`bg-slate-900 border border-white/5 p-8 rounded-[3rem] flex items-center justify-between group transition-all relative overflow-hidden ${isDone ? 'border-emerald-500/10' : ''}`}>
      {isDone && (
        <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
      )}
      
      <div className="flex items-center gap-6 relative z-10">
         <button 
           onClick={() => {
             if (habit.type === HabitType.BINARY) {
               onLog(isDone ? HabitStatus.MISSED : HabitStatus.DONE);
             }
           }}
           className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center transition-all duration-700 ${isDone ? (habit.is_good ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20' : 'bg-rose-500 text-slate-950 shadow-xl shadow-rose-500/20') : 'bg-slate-950 text-slate-700 border border-white/5 hover:border-white/10'}`}
         >
           {habit.type === HabitType.QUANTITATIVE ? (
             <Hash size={24} />
           ) : (
             isDone ? <Check size={32} strokeWidth={3} /> : <Minus size={24} />
           )}
         </button>
         
         <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-2xl font-display font-black tracking-tight transition-all ${isDone ? 'text-white' : 'text-slate-500'}`}>
                {habit.title}
              </h3>
              {isDone && <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Secured</div>}
            </div>
            
            {habit.type === HabitType.QUANTITATIVE ? (
               <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-4 py-2 border border-white/5">
                    <input 
                      type="number"
                      value={log?.value || 0}
                      onChange={e => onLog(HabitStatus.DONE, Number(e.target.value))}
                      className="w-10 bg-transparent text-emerald-500 font-black outline-none text-center"
                    />
                    <span className="text-[10px] font-black text-slate-600">/ {habit.target_value} {habit.unit}</span>
                  </div>
                  <div className="h-1 flex-1 min-w-[60px] bg-slate-950 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min(((log?.value || 0) / habit.target_value!) * 100, 100)}%` }}
                       className="h-full bg-emerald-500"
                     />
                  </div>
               </div>
            ) : (
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-1.5 text-orange-500">
                    <Flame size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">12 Streak</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-blue-500">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">+4% Intensity</span>
                 </div>
              </div>
            )}
         </div>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={onDelete} 
          className="p-4 opacity-0 group-hover:opacity-100 text-slate-800 hover:text-rose-500 transition-all hover:bg-rose-500/5 rounded-3xl"
        >
          <Trash2 size={20} />
        </button>
        <ChevronRight size={20} className="text-slate-800" />
      </div>
    </div>
  );
}
