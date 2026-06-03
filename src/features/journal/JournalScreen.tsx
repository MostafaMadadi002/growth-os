import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronRight, Trash2, Edit3, X, Calendar, Book, ArrowLeft, Filter, Star, Zap } from 'lucide-react';
import { useJournalStore } from './stores/journalStore';
import JournalListItem from './components/JournalListItem';
import JournalForm from './components/JournalForm';
import { JournalEntry } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL' | 'EDIT';

export default function JournalScreen() {
  const { entries, isLoading, fetchEntries, addEntry, updateEntry, deleteEntry } = useJournalStore();
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
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-slate-950"
      >
        <header className="p-8 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tighter">New Archival</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Capture this moment in time</p>
          </div>
          <button onClick={() => setViewMode('LIST')} className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
            <X size={20}/>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">
          <JournalForm onSubmit={handleCreate} onCancel={() => setViewMode('LIST')} loading={isLoading} />
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'EDIT' && selectedEntry) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-full bg-slate-950"
      >
        <header className="p-8 flex items-center justify-between border-b border-white/5">
           <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tighter">Refine Memory</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Adjusting the narrative</p>
          </div>
          <button onClick={() => setViewMode('DETAIL')} className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
            <X size={20}/>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">
          <JournalForm 
            initialData={selectedEntry} 
            onSubmit={handleEdit} 
            onCancel={() => setViewMode('DETAIL')} 
            loading={isLoading} 
          />
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'DETAIL' && selectedEntry) {
    const formattedDate = new Date(selectedEntry.entry_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full bg-slate-950 overflow-y-auto"
      >
        <header className="sticky top-0 p-8 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between z-50">
          <button 
            onClick={() => setViewMode('LIST')} 
            className="flex items-center text-slate-500 gap-3 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center">
               <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Archive</span>
          </button>
          <div className="flex gap-4">
            <button onClick={() => setViewMode('EDIT')} className="w-12 h-12 bg-slate-900 border border-white/5 text-emerald-500 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all">
              <Edit3 size={18} />
            </button>
            <button onClick={handleDelete} className="w-12 h-12 bg-slate-900 border border-white/5 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto w-full p-10 pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center text-slate-600 gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
               <Calendar size={14} className="text-emerald-500" />
               <span>{formattedDate}</span>
            </div>
            <h1 className="text-6xl font-display font-black text-white leading-[1.1] tracking-tighter mb-10">{selectedEntry.title || 'Untitled Archive'}</h1>
            
            <div className="flex flex-wrap gap-6 p-8 bg-slate-900/50 border border-white/5 rounded-[3.5rem]">
              <StatInsight icon={<Star className="text-emerald-500" />} label="Mood Index" value={`${selectedEntry.mood}/10`} />
              <StatInsight icon={<Zap className="text-blue-500" />} label="Energy Level" value={`${selectedEntry.energy}/10`} />
              <div className="flex-1" />
              {selectedEntry.tags?.map(t => (
                <span key={t} className="bg-slate-950 px-4 py-2 rounded-full border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">#{t}</span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
             {selectedEntry.gratitude && <EditorialFeature label="Gratitude Reflection" value={selectedEntry.gratitude} icon="🙏" />}
             {selectedEntry.achievement && <EditorialFeature label="Growth Spike" value={selectedEntry.achievement} icon="🏆" />}
             {selectedEntry.challenge && <EditorialFeature label="Adversity Encounter" value={selectedEntry.challenge} icon="⚔️" />}
             {selectedEntry.lesson && <EditorialFeature label="Synthesis Lesson" value={selectedEntry.lesson} icon="💡" />}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            <div className="text-slate-300 text-2xl font-medium leading-[1.6] whitespace-pre-wrap font-sans selection:bg-emerald-500/30">
              {selectedEntry.content}
            </div>
          </motion.div>
        </main>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Archive Management</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter">Journals</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500">
             <Filter size={18} />
           </button>
           <button 
             onClick={() => setViewMode('CREATE')}
             className="bg-emerald-500 p-5 rounded-[2rem] text-slate-950 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
           >
             <Plus size={24} strokeWidth={3} />
           </button>
        </div>
      </header>

      <div className="mb-10 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Query archives by title, content or intent..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-[2.5rem] py-6 pl-16 pr-8 text-white font-bold outline-none focus:border-white/10 transition-all placeholder:text-slate-800"
        />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <JournalListItem 
                entry={entry} 
                onClick={() => {
                  setSelectedEntry(entry);
                  setViewMode('DETAIL');
                }} 
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEntries.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-800">
            <Book size={80} strokeWidth={1} className="mb-6 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-10">Archive Empty</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatInsight({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center">
          {icon}
       </div>
       <div>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">{label}</span>
          <span className="text-xl font-display font-black text-white">{value}</span>
       </div>
    </div>
  );
}

function EditorialFeature({ label, value, icon }: { label: string, value: string, icon: string }) {
  return (
    <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-6 text-2xl opacity-20 group-hover:scale-125 transition-transform">{icon}</div>
       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">{label}</span>
       <p className="text-white font-bold text-lg leading-relaxed">{value}</p>
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
