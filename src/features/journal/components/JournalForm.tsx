import React, { useState } from 'react';
import { JournalEntry } from '../../../core/types';
import { Tag, Sparkles, AlertTriangle, Lightbulb, Heart, X, Moon, Sunrise, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';

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
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-40 scrollbar-hide">
        <div className="max-w-4xl mx-auto p-10 space-y-20">
          
          {/* Header Metadata */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">Archive Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-emerald-500 font-bold text-sm outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>
            
            <div className="flex gap-4">
               <RangeInput icon={<Star size={14} />} label="Vibe" value={mood} min={1} max={10} onChange={setMood} color="emerald" />
               <RangeInput icon={<Zap size={14} />} label="NRG" value={energy} min={1} max={10} onChange={setEnergy} color="blue" />
            </div>
          </section>

          {/* Primary Subject */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">Subject Narrative</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The core theme of your day..."
              className="w-full bg-transparent text-6xl font-display font-black text-white placeholder:text-slate-900 outline-none border-b border-white/5 pb-8 focus:border-emerald-500/20 transition-all tracking-tighter"
            />
          </section>

          {/* Qualitative Features */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <EditorialField icon={<Heart className="text-rose-500" size={16} />} label="Gratitude" value={gratitude} onChange={setGratitude} placeholder="Recalling appreciation..." />
             <EditorialField icon={<Sparkles className="text-yellow-500" size={16} />} label="Breakthrough" value={achievement} onChange={setAchievement} placeholder="Marking a local victory..." />
             <EditorialField icon={<AlertTriangle className="text-orange-500" size={16} />} label="Resistance" value={challenge} onChange={setChallenge} placeholder="Naming the friction..." />
             <EditorialField icon={<Lightbulb className="text-emerald-500" size={16} />} label="Synthesis" value={lesson} onChange={setLesson} placeholder="The consolidated lesson..." />
          </section>

          {/* Main Thought Space */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Extended Reflection</label>
               <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{content.length} CHARS</span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write without judgment. Let the cognitive stream settle on the page..."
              className="w-full bg-slate-900/30 border border-white/5 rounded-[3rem] p-12 text-slate-200 text-2xl font-medium leading-[1.6] focus:border-white/10 outline-none resize-none min-h-[500px] transition-all selection:bg-emerald-500/20"
            />
          </section>

          {/* Classification */}
          <section className="space-y-6">
             <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">Pattern Tags</label>
             <div className="flex flex-wrap gap-4">
                {tags.map(t => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={t} 
                    className="bg-slate-900 border border-white/5 text-[10px] font-black text-slate-400 px-4 py-2 rounded-full flex items-center gap-3 uppercase tracking-widest"
                  >
                    {t}
                    <button type="button" onClick={() => setTags(tags.filter(tg => tg !== t))} className="hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
                <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-emerald-500/30 transition-all">
                  <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Classify..."
                    className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none w-24"
                  />
                  <button type="button" onClick={addTag} className="text-slate-800 hover:text-white transition-colors">
                    <Tag size={14} />
                  </button>
                </div>
             </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-slate-950/80 backdrop-blur-3xl border-t border-white/5 flex gap-6 z-50">
        <button 
          type="submit"
          disabled={loading || !title || !content}
          className="flex-[3] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-black uppercase tracking-[0.2em] py-6 rounded-[2.5rem] transition-all shadow-2xl shadow-emerald-500/10"
        >
          {loading ? 'Committing...' : 'Commit to Archive'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-500 font-black uppercase tracking-widest py-6 rounded-[2.5rem] transition-colors"
        >
          Discard
        </button>
      </div>
    </form>
  );
}

function RangeInput({ icon, label, value, min, max, onChange, color }: { icon: any, label: string, value: number, min: number, max: number, onChange: (v: number) => void, color: string }) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  }
  return (
    <div className="bg-slate-900 border border-white/5 p-4 rounded-3xl min-w-[120px]">
       <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
          <span className="text-xl font-display font-black text-white">{value}</span>
       </div>
       <input 
         type="range" min={min} max={max} value={value}
         onChange={(e) => onChange(parseInt(e.target.value))}
         className="w-full h-1 bg-slate-950 rounded-full appearance-none cursor-pointer accent-white"
       />
       <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest block mt-2">{label} INDEX</span>
    </div>
  )
}

function EditorialField({ icon, label, value, onChange, placeholder }: { icon: any, label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">{icon}</div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       </div>
       <input 
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={placeholder}
         className="w-full bg-slate-900/30 border border-white/5 rounded-[2rem] p-6 text-white font-bold outline-none focus:border-white/10 transition-colors placeholder:text-slate-800"
       />
    </div>
  );
}
