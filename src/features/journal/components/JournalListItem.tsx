import React from 'react';
import { JournalEntry } from '../../../core/types';
import { ChevronRight, Zap, Star, Layout } from 'lucide-react';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
}

export default function JournalListItem({ entry, onClick }: Props) {
  const dateObj = new Date(entry.entry_date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="command-card cursor-pointer group hover:bg-slate-900/80 active:scale-[0.98] flex items-center gap-10"
    >
      {/* Date Identity - Industrial Style */}
      <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-white/5 pr-10 h-16">
         <span className="text-4xl font-display font-black text-white leading-none tracking-tighter">{day}</span>
         <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.3em] mt-1">{month}</span>
      </div>

      {/* Content Preview */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
             <h3 className="text-2xl font-display font-black text-white tracking-tighter line-clamp-1 group-hover:text-brand-primary transition-colors">
               {entry.title || 'ARCHIVE_EMPTY_TITLE'}
             </h3>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest hidden md:inline">ID_LOG_{entry.id.slice(0, 4)}</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                <span className="text-[10px] font-mono font-black text-white">M_{entry.mood}</span>
             </div>
             <ChevronRight size={18} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
        
        <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-4 leading-relaxed font-sans opacity-80">
          {entry.content}
        </p>

        <div className="flex items-center gap-4">
           {entry.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-sm border border-white/5 hover:text-white transition-colors cursor-default">#{tag}</span>
           ))}
           <div className="flex-1" />
           <div className="h-[1px] w-20 bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}
