import React from 'react';
import { JournalEntry } from '../../../core/types';
import { ChevronRight, Zap, Star, Layout } from 'lucide-react';
import { useI18n } from '../../../core/store/useI18n';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
}

export default function JournalListItem({ entry, onClick }: Props) {
  const { dir } = useI18n();
  const dateObj = new Date(entry.entry_date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleDateString(dir === 'rtl' ? 'fa-IR' : 'en-US', { month: 'short' }).toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="command-card cursor-pointer group hover:bg-slate-900/80 active:scale-[0.98] flex items-center gap-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 group-hover:bg-brand-primary/20 transition-colors" />
      
      {/* Date Identity - Industrial Style */}
      <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-white/5 pr-10 h-20">
         <span className="text-5xl font-display font-black text-white leading-none tracking-tighter shadow-sm">{day}</span>
         <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-[0.4em] mt-2">{month}</span>
      </div>

      {/* Content Preview */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-5">
             <h3 className="text-3xl font-display font-black text-white tracking-tighter line-clamp-1 group-hover:text-brand-primary transition-colors">
               {entry.title || 'ARCHIVE_NUL_TITLE'}
             </h3>
             <span className="text-[9px] font-mono font-black text-slate-800 uppercase tracking-widest hidden md:inline bg-slate-950 px-2 py-0.5 rounded-sm">NODE_{entry.id.slice(0, 4)}</span>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_#10b981]" />
                <span className="text-xl font-mono font-black text-white">M_{entry.mood}</span>
             </div>
             <ChevronRight size={24} className="text-slate-900 group-hover:text-white group-hover:translate-x-2 transition-all duration-500" />
          </div>
        </div>
        
        <p className="text-slate-500 text-base font-medium line-clamp-1 mb-6 leading-relaxed font-sans opacity-80 group-hover:text-slate-400 transition-colors">
          {entry.content}
        </p>

        <div className="flex items-center gap-5">
           {entry.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest bg-slate-950 px-4 py-1.5 rounded-lg border border-white/5 hover:text-white transition-colors cursor-default shadow-lg">#{tag}</span>
           ))}
           <div className="flex-1" />
           <div className="h-[1px] w-24 bg-white/[0.03] group-hover:w-32 transition-all duration-700" />
        </div>
      </div>
    </div>
  );
}
