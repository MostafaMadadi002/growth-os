import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { useLearningStore } from './store/useLearningStore';

export default function LearningScreen() {
  const { sessions, fetchSessions, addSession } = useLearningStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleAdd = async () => {
    if (!title) return;
    await addSession({
        title,
        category: 'Course',
        duration_minutes: duration,
        date: new Date().toISOString()
    });
    setTitle('');
    setShowAdd(false);
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white">یادگیری</h1>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </button>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex items-center justify-between">
         <div className="text-right">
            <span className="text-slate-500 text-sm block mb-1">زمان کل مطالعه</span>
            <span className="text-3xl font-black text-white">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
         </div>
         <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <GraduationCap size={30} />
         </div>
      </div>

      <main className="space-y-4 flex-1 overflow-y-auto pb-24">
        {sessions.map(s => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500">
                   <BookOpen size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-500">{new Date(s.date).toLocaleDateString('fa-IR')}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-slate-400">
                <Clock size={16} />
                <span className="font-bold">{s.duration_minutes}m</span>
             </div>
          </div>
        ))}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">جلسه یادگیری جدید</h3>
            <div className="space-y-4 mb-8">
              <input 
                placeholder="عنوان (دوره، کتاب، ...)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
              />
              <div className="space-y-2">
                <label className="text-sm text-slate-500">مدت زمان ({duration} دقیقه)</label>
                <input 
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleAdd} className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-bold text-white">ثبت</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold text-slate-400">لغو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
