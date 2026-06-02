import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Target, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { useGoalStore } from './store/useGoalStore';
import { BigGoal } from '../../core/types';

export default function GoalsScreen() {
  const { goals, sessions, isLoading, fetchGoals, fetchSessions, addGoal, toggleSession } = useGoalStore();
  const [selectedGoal, setSelectedGoal] = useState<BigGoal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [sessionCount, setSessionCount] = useState(100);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSelectGoal = (goal: BigGoal) => {
    setSelectedGoal(goal);
    fetchSessions(goal.id);
  };

  const handleAdd = async () => {
    if (!newTitle) return;
    await addGoal({
      title: newTitle,
      total_expected_sessions: sessionCount,
      category: 'PERSONAL',
      start_date: new Date().toISOString()
    });
    setNewTitle('');
    setShowAdd(false);
  };

  if (selectedGoal) {
    const goalSessions = sessions[selectedGoal.id] || [];
    const completedCount = goalSessions.filter(s => s.is_completed).length;
    const progress = (completedCount / selectedGoal.total_expected_sessions) * 100;

    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 animate-in slide-in-from-left duration-300" dir="rtl">
        <header className="flex items-center justify-between mb-8">
           <button onClick={() => setSelectedGoal(null)} className="flex items-center text-slate-400 gap-1">
             <ChevronLeft size={20} className="rotate-180" />
             <span>بازگشت</span>
           </button>
           <h2 className="text-xl font-bold text-white">جزییات هدف</h2>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 text-center shadow-xl">
           <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-emerald-500" size={40} />
           </div>
           <h1 className="text-3xl font-black text-white mb-2">{selectedGoal.title}</h1>
           <div className="flex items-center justify-center gap-2 text-slate-500 mb-6">
             <span>{completedCount} جلسه از {selectedGoal.total_expected_sessions}</span>
             <span className="text-emerald-500 font-bold">{Math.round(progress)}%</span>
           </div>
           <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-3 pb-10">
           {goalSessions.map((s, idx) => (
             <button 
               key={s.id}
               onClick={() => toggleSession(selectedGoal.id, s.id, !s.is_completed)}
               className={`aspect-square rounded-xl flex items-center justify-center border font-bold transition-all ${s.is_completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-600'}`}
             >
               {s.session_number}
             </button>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 bg-slate-950" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white">اهداف بلند</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="space-y-6 flex-1 overflow-y-auto pb-24">
        {goals.map(g => (
          <div 
            key={g.id}
            onClick={() => handleSelectGoal(g)}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl cursor-pointer hover:bg-slate-800 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                <Target size={24} />
              </div>
              <ChevronLeft className="text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{g.title}</h2>
            <p className="text-slate-500 mb-4">{g.total_expected_sessions} جلسه تمرین</p>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
             <Trophy size={64} className="mb-4" />
             <p className="text-xl font-bold">هدفی ثبت نشده</p>
          </div>
        )}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">هدف جدید</h3>
            
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm text-slate-500">موضوع هدف</label>
                <input 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: یادگیری پایتون"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-500">تعداد جلسات ({sessionCount})</label>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={sessionCount}
                  onChange={e => setSessionCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAdd}
                className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-bold text-white shadow-xl shadow-emerald-500/20"
              >
                ایجاد هدف
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
