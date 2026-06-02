import React, { useState } from 'react';
import { JournalEntry } from '../../../core/types';

interface Props {
  initialData?: Partial<JournalEntry>;
  onSubmit: (data: { title: string; content: string; entry_date: string; mood_emoji?: string; energy_level?: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MOODS = ['😊', '🤩', '😐', '😔', '😫', '😡'];

export default function JournalForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState(initialData?.mood_emoji || '😊');
  const [energy, setEnergy] = useState(initialData?.energy_level || 3);
  const [date, setDate] = useState(initialData?.entry_date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ title, content, entry_date: date, mood_emoji: mood, energy_level: energy });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-900">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 mr-1">تاریخ</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 mr-1">مود</label>
            <div className="flex bg-slate-800 border border-slate-700 rounded-2xl p-2 justify-between">
              {MOODS.map(m => (
                <button 
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`text-xl p-1 rounded-lg transition-all ${mood === m ? 'bg-emerald-500/20 scale-110' : 'opacity-40'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 mr-1">عنوان ژورنال</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="امروز چطور بود؟"
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-lg focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 mr-1">سطح انرژی ({energy}/5)</label>
          <input 
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-sm font-medium text-slate-400 mr-1">جزییات روز</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="شرح حال امروز..."
            className="w-full flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-base focus:border-emerald-500 outline-none resize-none min-h-[250px]"
          />
        </div>
      </div>

      <div className="p-6 bg-slate-800 border-t border-slate-700 flex gap-4">
        <button 
          type="submit"
          disabled={loading || !title || !content}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره ژورنال'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
