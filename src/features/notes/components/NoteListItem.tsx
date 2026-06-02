import React from 'react';
import { Note } from '../../../core/types';
import { ChevronLeft, Calendar } from 'lucide-react';

interface Props {
  note: Note;
  onClick: () => void;
  key?: string;
}

export default function NoteListItem({ note, onClick }: Props) {
  const dateStr = new Date(note.last_edited_at).toLocaleDateString('fa-IR');

  return (
    <div 
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 p-5 rounded-2xl mb-4 cursor-pointer hover:bg-slate-750 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white line-clamp-1">{note.title || 'بدون عنوان'}</h3>
        <ChevronLeft size={20} className="text-slate-500" />
      </div>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {note.content}
      </p>
      <div className="flex items-center text-slate-500 text-xs gap-1">
        <Calendar size={14} />
        <span>آخرین ویرایش: {dateStr}</span>
      </div>
    </div>
  );
}
