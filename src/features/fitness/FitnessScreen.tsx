import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Timer, Flame, ChevronRight } from 'lucide-react';
import { useFitnessStore } from './store/useFitnessStore';

export default function FitnessScreen() {
  const { workouts, fetchWorkouts, addWorkout } = useFitnessStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(45);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleAdd = async () => {
    if (!title) return;
    await addWorkout({
        title,
        type: 'Strength',
        duration,
        calories: duration * 8, // Estimate
        date: new Date().toISOString()
    });
    setTitle('');
    setShowAdd(false);
  };

  const totalCalories = workouts.reduce((acc, w) => acc + (w.calories || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white">بدنسازی</h1>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <span className="text-slate-500 text-sm mb-1 block">تمرینات</span>
           <span className="text-3xl font-black text-white">{workouts.length}</span>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <span className="text-slate-500 text-sm mb-1 block">کالری کل</span>
           <span className="text-3xl font-black text-orange-500">{totalCalories}</span>
         </div>
      </div>

      <main className="space-y-4 flex-1 overflow-y-auto pb-24">
        {workouts.map(w => (
          <div key={w.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                   <Dumbbell size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-white">{w.title}</h3>
                  <p className="text-sm text-slate-500">{new Date(w.date).toLocaleDateString('fa-IR')}</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1">
                  <Timer size={16} />
                  <span className="font-bold text-sm">{w.duration}m</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame size={16} />
                  <span className="font-bold text-sm">{w.calories}</span>
                </div>
             </div>
          </div>
        ))}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">تمرین جدید</h3>
            <div className="space-y-4 mb-8">
              <input 
                placeholder="نام تمرین (مثلاً پا، سینه...)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
              />
              <div className="space-y-2">
                <label className="text-sm text-slate-500">مدت زمان ({duration} دقیقه)</label>
                <input 
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleAdd} className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-bold text-white">ثبت تمرین</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold text-slate-400">لغو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
