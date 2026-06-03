import React, { useState } from 'react';
import { JournalEntry } from '../../../core/types';
import { Tag, Sparkles, AlertTriangle, Lightbulb, Heart, X } from 'lucide-react';

interface Props {
  initialData?: Partial<JournalEntry>;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'visibility'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function JournalForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState(initialData?.mood || 7);
  const [energy, setEnergy] = useState(initialData?.energy || 5);
  const [date, setDate] = useState(initialData?.entry_date || new Date().toISOString().split('T')[0]);
  const [gratitude, setGratitude] = useState(initialData?.gratitude || '');
  const [achievement, setAchievement] = useState(initialData?.achievement || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [lesson, setLesson] = useState(initialData?.lesson || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ 
      title, 
      content, 
      entry_date: date, 
      mood, 
      energy, 
      gratitude,
      achievement,
      challenge,
      lesson,
      tags
    });
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-950 overflow-hidden" dir="rtl">
      <div className="p-8 space-y-10 flex-1 overflow-y-auto pb-40 scrollbar-hide">
        
        {/* Date & Title */}
        <div className="space-y-6">
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-900/50 border border-white/5 rounded-2xl p-3 text-slate-400 font-bold text-xs uppercase tracking-widest outline-none"
          />
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Today's Theme..."
            className="w-full bg-transparent text-4xl font-black text-white placeholder:text-slate-800 outline-none border-b border-white/5 pb-4"
          />
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mood Level</label>
                 <span className="text-emerald-500 font-black">{mood}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Energy Level</label>
                 <span className="text-blue-500 font-black">{energy}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
           </div>
        </div>

        {/* Rich Fields */}
        <div className="space-y-6">
          <RichInput icon={<Heart className="text-rose-500" size={18} />} label="Gratitude" value={gratitude} onChange={setGratitude} placeholder="What are you thankful for?" />
          <RichInput icon={<Sparkles className="text-yellow-500" size={18} />} label="Today's Win" value={achievement} onChange={setAchievement} placeholder="Your biggest victory today..." />
          <RichInput icon={<AlertTriangle className="text-orange-500" size={18} />} label="Growth Edge" value={challenge} onChange={setChallenge} placeholder="The hardest part of your day..." />
          <RichInput icon={<Lightbulb className="text-emerald-500" size={18} />} label="Lesson Learned" value={lesson} onChange={setLesson} placeholder="A takeaway for the future..." />
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Deep Reflection</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Let your thoughts flow onto the canvas..."
            className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 text-white text-lg leading-relaxed focus:border-emerald-500 outline-none resize-none min-h-[400px] shadow-2xl"
          />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Classification Tags</label>
          <div className="flex gap-3">
             <input 
               value={tagInput}
               onChange={e => setTagInput(e.target.value)}
               onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
               placeholder="Add tag..."
               className="flex-1 bg-slate-900 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-sm"
             />
             <button type="button" onClick={addTag} className="bg-slate-900 p-4 rounded-2xl text-slate-400 group hover:text-white transition-colors"><Tag size={20} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                {t} <button type="button" onClick={() => setTags(tags.filter(tg => tg !== t))}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex gap-4 z-50">
        <button 
          type="submit"
          disabled={loading || !title || !content}
          className="flex-[3] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-5 rounded-[2rem] transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          {loading ? 'ARCHIVING...' : 'STORE ENTRY'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-500 font-black uppercase tracking-widest py-5 rounded-[2rem] transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

function RichInput({ icon, label, value, onChange, placeholder }: { icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-2 px-1">
          {icon}
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       </div>
       <input 
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={placeholder}
         className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-emerald-500 transition-colors text-right"
       />
    </div>
  );
}
