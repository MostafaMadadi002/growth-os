import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Check, Minus } from 'lucide-react';
import { useHabitStore } from './store/useHabitStore';
import { HabitStatus } from '../../core/types';

export default function HabitsScreen() {
  const { habits, logs, isLoading, fetchHabits, fetchLogs, addHabit, logHabit, removeHabit } = useHabitStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isGood, setIsGood] = useState(true);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
    fetchLogs(today);
  }, [fetchHabits, fetchLogs, today]);

  const handleAdd = async () => {
    if (!newTitle) return;
    await addHabit({ title: newTitle, is_good: isGood, frequency: 'DAILY' });
    setNewTitle('');
    setShowAdd(false);
  };

  const getStatus = (habitId: string) => {
    return logs[today]?.find(l => l.habit_id === habitId)?.status;
  };

  const goodHabits = habits.filter(h => h.is_good);
  const badHabits = habits.filter(h => !h.is_good);

  return (
    <div className="flex flex-col h-full p-6 bg-slate-950" dir="rtl">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-white">عادت‌ها</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="space-y-10 flex-1 overflow-y-auto pb-24">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-bold text-white">عادت‌های مثبت</h2>
          </div>
          <div className="space-y-4">
            {goodHabits.map(h => (
              <HabitItem 
                key={h.id} 
                habit={h} 
                status={getStatus(h.id)} 
                onLog={(s) => logHabit(h.id, s, today)} 
                onDelete={() => removeHabit(h.id)}
              />
            ))}
            {goodHabits.length === 0 && <p className="text-slate-600 text-center py-4">هنوز عادتی ثبت نشده</p>}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-bold text-white">ترک عادت</h2>
          </div>
          <div className="space-y-4">
            {badHabits.map(h => (
              <HabitItem 
                key={h.id} 
                habit={h} 
                status={getStatus(h.id)} 
                onLog={(s) => logHabit(h.id, s, today)} 
                onDelete={() => removeHabit(h.id)}
              />
            ))}
            {badHabits.length === 0 && <p className="text-slate-600 text-center py-4">تمیز و عالی!</p>}
          </div>
        </section>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">عادت جدید</h3>
            
            <input 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="نام عادت..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white mb-6 outline-none focus:border-emerald-500 text-right"
            />

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setIsGood(true)}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isGood ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                مثبت
              </button>
              <button 
                onClick={() => setIsGood(false)}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${!isGood ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                منفی
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAdd}
                className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-bold text-white"
              >
                ایجاد
              </button>
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold text-slate-400"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HabitItem({ habit, status, onLog, onDelete }: { habit: any, status?: HabitStatus, onLog: (s: HabitStatus) => void, onDelete: () => void, key?: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between group">
      <div className="flex items-center gap-4">
         <div className="flex flex-col gap-1">
           <button 
             onClick={() => onLog(status === HabitStatus.DONE ? HabitStatus.MISSED : HabitStatus.DONE)}
             className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${status === HabitStatus.DONE ? (habit.is_good ? 'bg-emerald-500' : 'bg-red-500') : 'bg-slate-700 opacity-40 hover:opacity-100'}`}
           >
             {status === HabitStatus.DONE ? <Check size={24} className="text-white" /> : <Minus size={24} className="text-white" />}
           </button>
         </div>
         <span className={`text-xl font-medium ${status === HabitStatus.DONE ? 'text-white' : 'text-slate-400'}`}>{habit.title}</span>
      </div>
      
      <button onClick={onDelete} className="p-2 opacity-0 group-hover:opacity-100 text-red-400 transition-opacity">
        <Trash2 size={20} />
      </button>
    </div>
  );
}
