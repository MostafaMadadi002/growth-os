import React from 'react';
import { JournalEntry } from '../../../core/types';
import { ChevronRight, Zap, Star, Layout } from 'lucide-react';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
}

export default function JournalListItem({ entry, onClick }: Props) {
  const dateObj = new Date(entry.entry_date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="group relative bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 mb-6 cursor-pointer hover:bg-slate-850 transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex gap-8">
        {/* Date Identity */}
        <div className="flex flex-col items-center justify-center min-w-[60px]">
           <span className="text-3xl font-display font-black text-white leading-none">{day}</span>
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">{month}</span>
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-display font-black text-white tracking-tighter line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {entry.title || 'Untitled Archive'}
            </h3>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 text-emerald-500/40">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-black">{entry.mood}</span>
               </div>
               <ChevronRight size={18} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
          
          <p className="text-slate-500 text-base font-medium line-clamp-1 mb-6 leading-relaxed">
            {entry.content}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
             <div className="flex gap-2">
                {entry.tags?.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-white/5">#{tag}</span>
                ))}
             </div>
             
             {entry.energy !== undefined && (
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${entry.energy >= 7 ? 'bg-blue-500' : 'bg-slate-700'}`} />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">NRG {entry.energy}</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
