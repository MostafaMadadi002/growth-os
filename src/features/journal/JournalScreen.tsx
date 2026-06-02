import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronRight, Trash2, Edit3, X, Calendar } from 'lucide-react';
import { useJournalStore } from './store/useJournalStore';
import JournalListItem from './components/JournalListItem';
import JournalForm from './components/JournalForm';
import { JournalEntry } from '../../core/types';

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL' | 'EDIT';

export default function JournalScreen() {
  const { entries, isLoading, error, fetchEntries, addEntry, updateEntry, deleteEntry } = useJournalStore();
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await addEntry(data);
    setViewMode('LIST');
  };

  const handleEdit = async (data: any) => {
    if (selectedEntry) {
      await updateEntry(selectedEntry.id, data);
      setSelectedEntry({ ...selectedEntry, ...data });
      setViewMode('DETAIL');
    }
  };

  const handleDelete = async () => {
    if (selectedEntry) {
      await deleteEntry(selectedEntry.id);
      setSelectedEntry(null);
      setViewMode('LIST');
    }
  };

  if (viewMode === 'CREATE') {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
        <header className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">ژورنال جدید</h2>
          <button onClick={() => setViewMode('LIST')} className="p-2 bg-slate-800 rounded-xl"><X size={20}/></button>
        </header>
        <JournalForm onSubmit={handleCreate} onCancel={() => setViewMode('LIST')} loading={isLoading} />
      </div>
    );
  }

  if (viewMode === 'EDIT' && selectedEntry) {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
        <header className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">ویرایش ژورنال</h2>
          <button onClick={() => setViewMode('DETAIL')} className="p-2 bg-slate-800 rounded-xl"><X size={20}/></button>
        </header>
        <JournalForm 
          initialData={selectedEntry} 
          onSubmit={handleEdit} 
          onCancel={() => setViewMode('DETAIL')} 
          loading={isLoading} 
        />
      </div>
    );
  }

  if (viewMode === 'DETAIL' && selectedEntry) {
    const d = new Date(selectedEntry.entry_date).toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <div className="flex flex-col h-full bg-slate-950 animate-in slide-in-from-bottom duration-300">
        <header className="fixed top-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
          <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 gap-1">
            <ChevronRight size={20} />
            <span>بازگشت</span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('EDIT')} className="p-3 bg-slate-800 text-emerald-500 rounded-2xl">
              <Edit3 size={20} />
            </button>
            <button onClick={handleDelete} className="p-3 bg-slate-800 text-red-500 rounded-2xl">
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <main className="p-6 pt-28 pb-10">
          <div className="flex items-center gap-3 mb-4">
            {selectedEntry.mood_emoji && <span className="text-4xl">{selectedEntry.mood_emoji}</span>}
            <div className="flex items-center text-slate-500 gap-1 text-sm bg-slate-900 px-3 py-1 rounded-full">
               <Calendar size={14} />
               <span>{d}</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight">{selectedEntry.title}</h1>
          
          {selectedEntry.energy_level && (
            <div className="mb-6 flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-sm font-medium text-slate-400">سطح انرژی:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div key={lvl} className={`w-3 h-3 rounded-full ${lvl <= selectedEntry.energy_level! ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-700'}`} />
                ))}
              </div>
            </div>
          )}

          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6" dir="rtl">
      <header className="mb-8 text-right">
        <h1 className="text-4xl font-black text-white mb-6">ژورنال رشد</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="جستجو در ژورنال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all shadow-lg text-right"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {isLoading && entries.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="pb-24">
            {filteredEntries.map(entry => (
              <JournalListItem 
                key={entry.id} 
                entry={entry} 
                onClick={() => {
                  setSelectedEntry(entry);
                  setViewMode('DETAIL');
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-60">
            <div className="bg-slate-800 p-8 rounded-full mb-6">
              <Book className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium">نوشته‌ای پیدا نشد</p>
            <p className="text-sm mt-2">روز خود را ثبت کنید</p>
          </div>
        )}
      </main>

      <button 
        onClick={() => setViewMode('CREATE')}
        className="fixed bottom-24 left-6 bg-emerald-500 hover:bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 text-white transition-all hover:scale-105 active:scale-95 z-20"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
}

import { Book } from 'lucide-react';
