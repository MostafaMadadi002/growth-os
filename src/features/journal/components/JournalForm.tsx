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
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-surface-base overflow-hidden data-grid">
      <div className="flex-1 overflow-y-auto pb-40 scrollbar-hide">
        <div className="max-w-4xl mx-auto p-12 space-y-24">
          
          {/* Header Metadata - Industrial Style */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-12 pt-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em] block ml-1">Archive_Timestamp</span>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-950/50 border border-white/[0.04] rounded-xl p-4 text-brand-primary font-mono font-bold text-sm outline-none focus:border-brand-primary/20 transition-all uppercase tracking-widest"
              />
            </div>
            
            <div className="flex gap-8 border-l border-white/[0.03] pl-12">
               <RangeInput icon={<Star size={14} />} label="Vibe" value={mood} min={1} max={10} onChange={setMood} color="emerald" />
               <RangeInput icon={<Zap size={14} />} label="NRG" value={energy} min={1} max={10} onChange={setEnergy} color="blue" />
            </div>
          </section>

          {/* Primary Subject */}
          <section className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em] block ml-1">Subject_Narrative</span>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="THE_CORE_THEME_INITIALIZATION..."
              className="w-full bg-transparent text-7xl font-display font-black text-white placeholder:text-slate-900 outline-none border-b border-white/[0.03] pb-10 focus:border-brand-primary/20 transition-all tracking-tighter uppercase"
            />
          </section>

          {/* Qualitative Features */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <EditorialField icon={<Heart className="text-rose-500" size={16} />} label="Gratitude" value={gratitude} onChange={setGratitude} placeholder="APPRECIATION_LOG..." />
             <EditorialField icon={<Sparkles className="text-brand-primary" size={16} />} label="Breakthrough" value={achievement} onChange={setAchievement} placeholder="LOCAL_VICTORY_CAPTURED..." />
             <EditorialField icon={<AlertTriangle className="text-orange-500" size={16} />} label="Resistance" value={challenge} onChange={setChallenge} placeholder="FRICTION_POINT_IDENTIFIED..." />
             <EditorialField icon={<Lightbulb className="text-brand-secondary" size={16} />} label="Synthesis" value={lesson} onChange={setLesson} placeholder="CONSOLIDATED_INTELLIGENCE..." />
          </section>

          {/* Main Thought Space */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em]">Extended_Reflection_Space</span>
               <span className="text-[9px] font-mono font-black text-slate-850 uppercase tracking-widest">{content.length} BYTES_WRITTEN</span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="COMMIT YOUR COGNITIVE STREAM TO THE ARCHIVE..."
              className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-12 text-slate-300 text-2xl font-medium leading-[1.8] focus:border-brand-primary/10 outline-none resize-none min-h-[600px] transition-all selection:bg-brand-primary/20 font-sans"
            />
          </section>

          {/* Classification */}
          <section className="space-y-8">
             <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em] block ml-1">Log_Classification_Tags</span>
             <div className="flex flex-wrap gap-4">
                {tags.map(t => (
                   <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={t} 
                    className="bg-slate-900 border border-white/[0.04] text-[9px] font-mono font-black text-slate-500 px-5 py-2.5 rounded-sm flex items-center gap-4 uppercase tracking-[0.2em] group"
                  >
                    #{t}
                    <button type="button" onClick={() => setTags(tags.filter(tg => tg !== t))} className="hover:text-rose-500 transition-colors">
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
                <div className="flex items-center gap-3 bg-slate-950 border border-white/[0.04] rounded-sm px-6 py-2 focus-within:border-brand-primary/30 transition-all">
                  <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="TAG_INPUT..."
                    className="bg-transparent text-[9px] font-mono font-black text-white uppercase tracking-widest outline-none w-32 placeholder:text-slate-900"
                  />
                  <button type="button" onClick={addTag} className="text-slate-800 hover:text-white transition-colors">
                    <Tag size={12} />
                  </button>
                </div>
             </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-10 bg-slate-950/90 backdrop-blur-3xl border-t border-white/[0.03] flex gap-8 z-50">
        <button 
          type="submit"
          disabled={loading || !title || !content}
          className="flex-[3] bg-brand-primary hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-mono font-black uppercase tracking-[0.3em] py-8 rounded-2xl transition-all shadow-2xl shadow-brand-primary/10 active:scale-95"
        >
          {loading ? 'COMMITTING_DATA...' : 'COMMIT_LOG_TO_HUB'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-900 border border-white/[0.03] hover:bg-slate-850 text-slate-600 hover:text-white font-mono font-black uppercase tracking-[0.2em] py-8 rounded-2xl transition-all"
        >
          DISCARD
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
