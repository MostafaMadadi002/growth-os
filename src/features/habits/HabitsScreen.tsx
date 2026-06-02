import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Check, Minus, Hash } from 'lucide-react';
import { useHabitStore } from './store/useHabitStore';
import { HabitStatus, HabitType, Habit } from '../../core/types';

export default function HabitsScreen() {
  const { habits, logs, fetchHabits, fetchLogs, addHabit, logHabit, removeHabit } = useHabitStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isGood, setIsGood] = useState(true);
  const [type, setType] = useState<HabitType>(HabitType.BINARY);
  const [targetValue, setTargetValue] = useState<number>(1);
  const [unit, setUnit] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
    fetchLogs(today);
  }, [fetchHabits, fetchLogs, today]);

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
    return logs[today]?.find(l => l.habit_id === habitId);
  };

  const goodHabits = habits.filter(h => h.is_good);
  const badHabits = habits.filter(h => !h.is_good);

  return (
    <div className="flex flex-col h-full p-6 bg-slate-950" dir="rtl">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-white tracking-tight">عادت‌ها</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="space-y-10 flex-1 overflow-y-auto pb-32 scrollbar-hide">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-xl font-black text-white tracking-wide uppercase">Positive Growth</h2>
          </div>
          <div className="space-y-4">
            {goodHabits.map(h => (
              <HabitItem 
                habit={h} 
                log={getLog(h.id)} 
                onLog={(s, v) => logHabit(h.id, s, today, v)} 
                onDelete={() => removeHabit(h.id)}
              />
            ))}
            {goodHabits.length === 0 && <p className="text-slate-600 text-center py-4 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 italic">No positive habits registered yet.</p>}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
            <h2 className="text-xl font-black text-white tracking-wide uppercase">Breaking Patterns</h2>
          </div>
          <div className="space-y-4">
            {badHabits.map(h => (
              <HabitItem 
                habit={h} 
                log={getLog(h.id)} 
                onLog={(s, v) => logHabit(h.id, s, today, v)} 
                onDelete={() => removeHabit(h.id)}
              />
            ))}
            {badHabits.length === 0 && <p className="text-slate-600 text-center py-4 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 italic">Clean as water!</p>}
          </div>
        </section>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/5 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8 text-center tracking-tight">Construct New Pattern</h3>
            
            <div className="space-y-5 mb-8">
              <input 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Name your habit..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors text-right font-medium"
              />

              <div className="flex gap-2 p-1 bg-slate-850 rounded-2xl">
                <button 
                  onClick={() => setIsGood(true)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isGood ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Positive
                </button>
                <button 
                  onClick={() => setIsGood(false)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isGood ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Negative
                </button>
              </div>

              <div className="flex gap-2 p-1 bg-slate-850 rounded-2xl">
                <button 
                  onClick={() => setType(HabitType.BINARY)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === HabitType.BINARY ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
                >
                  Binary
                </button>
                <button 
                  onClick={() => setType(HabitType.QUANTITATIVE)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === HabitType.QUANTITATIVE ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
                >
                  Quantitative
                </button>
              </div>

              {type === HabitType.QUANTITATIVE && (
                <div className="flex gap-3">
                  <input 
                    type="number"
                    value={targetValue}
                    onChange={e => setTargetValue(Number(e.target.value))}
                    placeholder="Value"
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
                  />
                  <input 
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="Unit (min, L, km)"
                    className="w-1/3 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAdd}
                className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                Assemble
              </button>
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-slate-850 py-4 rounded-2xl font-black text-slate-500 uppercase tracking-widest"
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

function HabitItem({ habit, log, onLog, onDelete }: { habit: Habit, log?: any, onLog: (s: HabitStatus, v?: number) => void, onDelete: () => void }) {
  const status = log?.status;
  const isDone = status === HabitStatus.DONE;

  return (
    <div className="bg-slate-900 border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-slate-850 transition-colors">
      <div className="flex items-center gap-5">
         <button 
           onClick={() => {
             if (habit.type === HabitType.BINARY) {
               onLog(isDone ? HabitStatus.MISSED : HabitStatus.DONE);
             }
           }}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDone ? (habit.is_good ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-rose-500 shadow-lg shadow-rose-500/20') : 'bg-slate-800 text-slate-600 hover:text-slate-400'}`}
         >
           {habit.type === HabitType.QUANTITATIVE ? (
             <Hash size={24} />
           ) : (
             isDone ? <Check size={28} className="text-white" strokeWidth={3} /> : <Minus size={24} />
           )}
         </button>
         
         <div>
            <h3 className={`text-lg font-black tracking-tight leading-none mb-1 transition-all ${isDone ? 'text-white' : 'text-slate-400'}`}>
              {habit.title}
            </h3>
            {habit.type === HabitType.QUANTITATIVE && (
               <div className="flex items-center gap-1.5">
                  <input 
                    type="number"
                    value={log?.value || 0}
                    onChange={e => onLog(HabitStatus.DONE, Number(e.target.value))}
                    className="w-12 bg-transparent text-emerald-400 font-bold border-b border-white/10 outline-none text-center"
                  />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    / {habit.target_value} {habit.unit}
                  </span>
               </div>
            )}
         </div>
      </div>
      
      <button 
        onClick={onDelete} 
        className="p-3 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-all active:scale-90"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
