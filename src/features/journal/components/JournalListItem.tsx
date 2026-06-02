import React from 'react';
import { JournalEntry } from '../../../core/types';
import { ChevronLeft, Zap, Sparkles } from 'lucide-react';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
}

export default function JournalListItem({ entry, onClick }: Props) {
  const dateStr = new Date(entry.entry_date).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' });

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] mb-6 cursor-pointer hover:bg-slate-850 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Sparkles size={80} />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{dateStr}</span>
           <h3 className="text-2xl font-black text-white tracking-tight leading-tight line-clamp-1">{entry.title || 'Untitled Archive'}</h3>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border ${entry.mood >= 7 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}>
             {entry.mood}
           </div>
           <ChevronLeft size={20} className="text-slate-700 group-hover:translate-x-[-5px] transition-transform" />
        </div>
      </div>

      <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
        {entry.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {entry.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[8px] font-black text-slate-400 border border-white/5 bg-white/5 px-2 py-1 rounded-full uppercase tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
        
        {entry.energy !== undefined && (
          <div className="flex items-center gap-2 text-blue-500/50">
             <Zap size={14} fill="currentColor" />
             <span className="text-[10px] font-black">{entry.energy}/10</span>
          </div>
        )}
      </div>
    </div>
  );
}
