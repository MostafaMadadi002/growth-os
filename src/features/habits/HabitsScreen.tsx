import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Check, Minus, Hash, Flame, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
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
  
  const { t } = useI18n();
  
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
    <div className="flex flex-col h-full bg-surface-base p-8 md:p-12 overflow-hidden data-grid">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Neural Mapping // Rituals</span>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">{t('habits')}.</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-brand-primary p-6 rounded-2xl text-slate-950 shadow-2xl shadow-brand-primary/20 active:scale-95 transition-all hover:bg-emerald-400 group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto space-y-16 pb-32 scrollbar-hide">
        {/* Positive Growth Section */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <Sparkles size={20} />
               </div>
               <div>
                  <h2 className="text-xs font-mono font-black text-white uppercase tracking-[0.2em]">{t('habits_good')}</h2>
                  <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest block mt-0.5">{t('daily_habits')} // Growth</span>
               </div>
            </div>
            <div className="text-[10px] font-mono text-slate-600 tracking-tighter">{goodHabits.length} ACTIVE_NODES</div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {goodHabits.map((h, i) => (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <HabitItem 
                  habit={h} 
                  log={getLog(h.id)} 
                  onLog={(s, v) => logHabit(h.id, s, today, v)} 
                  onDelete={() => deleteHabit(h.id)}
                  t={t}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Breaking Patterns Section */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                  <Flame size={20} />
               </div>
               <div>
                  <h2 className="text-xs font-mono font-black text-white uppercase tracking-[0.2em]">{t('habits_bad')}</h2>
                  <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest block mt-0.5">Pattern Friction // Mitigation</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {badHabits.map((h, i) => (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                <HabitItem 
                  habit={h} 
                  log={getLog(h.id)} 
                  onLog={(s, v) => logHabit(h.id, s, today, v)} 
                  onDelete={() => deleteHabit(h.id)}
                  t={t}
                />
              </motion.div>
            ))}
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
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/[0.05] w-full max-w-2xl rounded-[2rem] p-12 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAdd(false)} 
                className="absolute top-10 right-10 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-12">
                <span className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.4em] block mb-4">Protocol Initialization</span>
                <h3 className="text-5xl font-display font-black text-white tracking-tighter">{t('define_ritual') || 'Define Ritual'}.</h3>
              </div>
              
              <div className="space-y-10 mb-16">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest ml-1">The Objective Narrative</span>
                  <input 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Neural Focus Session"
                    className="w-full bg-slate-950/50 border border-white/[0.03] rounded-2xl p-6 text-white text-2xl font-bold outline-none focus:border-brand-primary/30 transition-all placeholder:text-slate-850"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest ml-1">Polarity Intent</span>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-white/[0.03]">
                      <button 
                        onClick={() => setIsGood(true)}
                        className={`py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${isGood ? 'bg-brand-primary text-slate-950 shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        Ascend
                      </button>
                      <button 
                        onClick={() => setIsGood(false)}
                        className={`py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${!isGood ? 'bg-rose-500 text-slate-950 shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        Descend
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest ml-1">Metric Logic</span>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-white/[0.03]">
                      <button 
                        onClick={() => setType(HabitType.BINARY)}
                        className={`py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${type === HabitType.BINARY ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        Toggle
                      </button>
                      <button 
                        onClick={() => setType(HabitType.QUANTITATIVE)}
                        className={`py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${type === HabitType.QUANTITATIVE ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        Value
                      </button>
                    </div>
                  </div>
                </div>

                {type === HabitType.QUANTITATIVE && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-6 p-8 bg-slate-950 rounded-3xl border border-white/[0.03]"
                  >
                    <div className="space-y-3">
                       <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest ml-1">Target Magnitude</span>
                       <input 
                         type="number"
                         value={targetValue}
                         onChange={e => setTargetValue(Number(e.target.value))}
                         className="w-full bg-slate-900 border border-white/[0.03] rounded-xl p-4 text-white text-center font-mono font-bold text-xl outline-none focus:border-brand-primary/20"
                       />
                    </div>
                    <div className="space-y-3">
                       <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest ml-1">SI Unit</span>
                       <input 
                         value={unit}
                         onChange={e => setUnit(e.target.value)}
                         placeholder="min, cycles, L"
                         className="w-full bg-slate-900 border border-white/[0.03] rounded-xl p-4 text-white text-center font-mono font-bold text-xl outline-none focus:border-brand-primary/20"
                       />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={handleAdd}
                  disabled={!newTitle}
                  className="flex-[2] bg-brand-primary hover:bg-emerald-400 py-6 rounded-2xl font-mono font-black text-slate-950 uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/10 active:scale-95 transition-all disabled:opacity-30"
                >
                  {t('commit_data')}
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-800 py-6 rounded-2xl font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                >
                  {t('abort_action')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HabitItem({ habit, log, onLog, onDelete, t }: { habit: Habit, log?: any, onLog: (s: HabitStatus, v?: number) => void, onDelete: () => void, t: any }) {
  const status = log?.status;
  const isDone = status === HabitStatus.DONE;

  return (
    <div className={`command-card flex items-center justify-between group transition-all relative overflow-hidden ${isDone ? 'border-brand-primary/20 bg-brand-primary/[0.02]' : ''}`}>
      {isDone && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full pointer-events-none" />
      )}
      
      <div className="flex items-center gap-8 relative z-10 w-full">
         <button 
           onClick={() => {
             if (habit.type === HabitType.BINARY) {
               onLog(isDone ? HabitStatus.MISSED : HabitStatus.DONE);
             }
           }}
           className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-700 ${isDone ? (habit.is_good ? 'bg-brand-primary text-slate-950 shadow-2xl shadow-brand-primary/20 scale-105' : 'bg-rose-500 text-slate-950 shadow-2xl shadow-rose-500/20 scale-105') : 'bg-slate-950 text-slate-700 border border-white/[0.04] hover:border-white/10 hover:bg-slate-900'}`}
         >
           {habit.type === HabitType.QUANTITATIVE ? (
             <Hash size={24} />
           ) : (
             isDone ? <Check size={36} strokeWidth={3} /> : <Minus size={24} />
           )}
         </button>
         
         <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className={`text-3xl font-display font-black tracking-tighter transition-all ${isDone ? 'text-white' : 'text-slate-500'}`}>
                {habit.title}
              </h3>
              {isDone && <span className="text-[9px] font-mono font-black text-brand-primary uppercase tracking-[0.3em] bg-brand-primary/10 px-3 py-1 rounded-sm border border-brand-primary/20">{t('logged')}</span>}
            </div>
            
            {habit.type === HabitType.QUANTITATIVE ? (
               <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-5 py-2.5 border border-white/[0.03]">
                    <input 
                      type="number"
                      value={log?.value || 0}
                      onChange={e => onLog(HabitStatus.DONE, Number(e.target.value))}
                      className="w-12 bg-transparent text-brand-primary font-mono font-black outline-none text-center text-lg"
                    />
                    <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest pt-1">/ {habit.target_value} {habit.unit}</span>
                  </div>
                  <div className="h-1 flex-1 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min(((log?.value || 0) / habit.target_value!) * 100, 100)}%` }}
                       className="h-full bg-brand-primary shadow-[0_0_10px_#10b981]"
                     />
                  </div>
               </div>
            ) : (
              <div className="flex items-center gap-8 mt-3">
                 <div className="flex items-center gap-2 text-orange-500">
                    <Flame size={14} fill="currentColor" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] pt-0.5">12_{t('streak')}</span>
                 </div>
                 <div className="flex items-center gap-2 text-brand-secondary">
                    <TrendingUp size={14} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] pt-0.5">+4.2%_{t('momentum')}</span>
                 </div>
              </div>
            )}
         </div>
      </div>
      
      <div className="flex items-center gap-4 relative z-10 ml-6">
        <button 
          onClick={onDelete} 
          className="p-4 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-rose-500 transition-all hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/10"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
