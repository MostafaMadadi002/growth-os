import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronRight, Trash2, Edit3, X, Calendar, Book } from 'lucide-react';
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
      <div className="flex flex-col h-full bg-slate-950 animate-in slide-in-from-bottom duration-700 overflow-y-auto" dir="rtl">
        <header className="sticky top-0 p-6 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between z-50">
          <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-500 gap-2 font-black uppercase tracking-widest text-[10px]">
            <ChevronRight size={18} className="rotate-180" />
            <span>BACK TO ARCHIVE</span>
          </button>
          <div className="flex gap-3">
            <button onClick={() => setViewMode('EDIT')} className="p-3 bg-slate-900 border border-white/5 text-emerald-500 rounded-2xl hover:bg-slate-800">
              <Edit3 size={18} />
            </button>
            <button onClick={handleDelete} className="p-3 bg-slate-900 border border-white/5 text-rose-500 rounded-2xl hover:bg-slate-800">
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <main className="p-8 pb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center text-slate-500 gap-2 text-[10px] font-black uppercase tracking-widest mb-4">
                 <Calendar size={14} />
                 <span>{d}</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">{selectedEntry.title || 'Untitled Entry'}</h1>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mood</span>
                 <span className="text-2xl font-black text-emerald-500">{selectedEntry.mood}/10</span>
              </div>
              <div className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Energy</span>
                 <span className="text-2xl font-black text-blue-500">{selectedEntry.energy}/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
             {selectedEntry.gratitude && <DetailCard label="Gratitude" value={selectedEntry.gratitude} color="rose" />}
             {selectedEntry.achievement && <DetailCard label="Achievement" value={selectedEntry.achievement} color="yellow" />}
             {selectedEntry.challenge && <DetailCard label="Challenge" value={selectedEntry.challenge} color="orange" />}
             {selectedEntry.lesson && <DetailCard label="Lesson Learned" value={selectedEntry.lesson} color="emerald" />}
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
            <div className="absolute top-6 right-8 opacity-5">
               <Book size={100} />
            </div>
            <p className="text-slate-300 text-xl leading-relaxed whitespace-pre-wrap font-medium relative z-10">
              {selectedEntry.content}
            </p>
          </div>

          {selectedEntry.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {selectedEntry.tags.map(t => (
                <span key={t} className="bg-white/5 border border-white/5 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 bg-slate-950" dir="rtl">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-8">Growth Journal</h1>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search through archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-[2rem] py-5 pl-14 pr-7 text-white font-bold outline-none focus:border-emerald-500 transition-all shadow-2xl text-right placeholder:text-slate-700"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading && entries.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="pb-32">
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
          <div className="flex flex-col items-center justify-center py-20 text-slate-700">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 mb-8 shadow-2xl">
              <Book size={64} strokeWidth={1} />
            </div>
            <p className="text-xl font-black uppercase tracking-widest mb-2">Void State</p>
            <p className="text-sm font-bold opacity-40">Capture your first step into growth.</p>
          </div>
        )}
      </main>

      <button 
        onClick={() => setViewMode('CREATE')}
        className="fixed bottom-24 left-8 bg-emerald-500 hover:bg-emerald-600 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 text-white transition-all hover:scale-110 hover:-rotate-12 active:scale-95 z-50"
      >
        <Plus size={36} strokeWidth={4} />
      </button>
    </div>
  );
}

function DetailCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colors: any = {
    rose: 'text-rose-500 bg-rose-500/5 border-rose-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/5 border-yellow-500/10',
    orange: 'text-orange-500 bg-orange-500/5 border-orange-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10',
  };
  
  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]}`}>
       <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60">{label}</span>
       <p className="text-white font-bold leading-relaxed">{value}</p>
    </div>
  );
}
