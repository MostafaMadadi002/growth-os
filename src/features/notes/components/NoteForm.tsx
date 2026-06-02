import React, { useState } from 'react';
import { Note } from '../../../core/types';

interface Props {
  initialData?: Partial<Note>;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function NoteForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-900">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 mr-1">عنوان یادداشت</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: ایده‌های جدید..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-lg focus:border-emerald-500 outline-none transition-colors"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-sm font-medium text-slate-400 mr-1">محتوا</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="هر چه در ذهن دارید بنویسید..."
            className="w-full flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-base focus:border-emerald-500 outline-none transition-colors resize-none min-h-[300px]"
          />
        </div>
      </div>

      <div className="p-6 bg-slate-800 border-t border-slate-700 flex gap-4">
        <button 
          type="submit"
          disabled={loading || !title || !content}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره یادداشت'}
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
