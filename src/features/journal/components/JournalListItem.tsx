import React from 'react';
import { JournalEntry } from '../../../core/types';
import { ChevronLeft } from 'lucide-react';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
  key?: string;
}

export default function JournalListItem({ entry, onClick }: Props) {
  const dateStr = new Date(entry.entry_date).toLocaleDateString('fa-IR');

  return (
    <div 
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 p-5 rounded-2xl mb-4 cursor-pointer hover:bg-slate-750 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {entry.mood_emoji && <span className="text-2xl">{entry.mood_emoji}</span>}
          <h3 className="text-xl font-bold text-white line-clamp-1">{entry.title || 'بدون عنوان'}</h3>
        </div>
        <ChevronLeft size={20} className="text-slate-500" />
      </div>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {entry.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs">{dateStr}</span>
        {entry.energy_level !== undefined && (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(lvl => (
              <div 
                key={lvl} 
                className={`w-2 h-2 rounded-full ${lvl <= entry.energy_level! ? 'bg-emerald-500' : 'bg-slate-700'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
