import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronRight, Trash2, Edit3, X, Calendar, Book, ArrowLeft, Filter, Star, Zap } from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useJournalStore } from './stores/journalStore';
import JournalListItem from './components/JournalListItem';
import JournalForm from './components/JournalForm';
import { JournalEntry } from '../../core/types';
import { motion, AnimatePresence } from 'motion/react';

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL' | 'EDIT';

export default function JournalScreen() {
  const { entries, isLoading, fetchEntries, addEntry, updateEntry, deleteEntry } = useJournalStore();
  const { t, dir } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = entries.filter(e => 
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content?.toLowerCase().includes(searchQuery.toLowerCase())
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
        className="flex flex-col h-full bg-slate-950 data-grid"
      >
        <header className="p-8 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-3xl font-display font-black text-white tracking-tighter">{t('new_archive')}.</h2>
            <p className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-[0.4em] mt-1">{t('capture_state') || 'Capture state temporal snapshot'}</p>
          </div>
          <button onClick={() => setViewMode('LIST')} className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
            <X size={24}/>
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
        className="flex flex-col h-full bg-slate-950 data-grid"
      >
        <header className="p-8 flex items-center justify-between border-b border-white/5">
           <div>
            <h2 className="text-3xl font-display font-black text-white tracking-tighter">{t('modify_log')}</h2>
            <p className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-[0.4em] mt-1">Adjusting neural archival data</p>
          </div>
          <button onClick={() => setViewMode('DETAIL')} className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
            <X size={24}/>
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
    const formattedDate = new Date(selectedEntry.entry_date).toLocaleDateString(dir === 'rtl' ? 'fa-IR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full bg-slate-950 overflow-y-auto data-grid"
      >
        <header className="sticky top-0 p-8 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between z-50">
          <button 
            onClick={() => setViewMode('LIST')} 
            className="flex items-center text-slate-500 gap-4 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center shadow-lg">
               <ArrowLeft size={20} />
            </div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">{t('exit_log')}</span>
          </button>
          <div className="flex gap-4">
            <button onClick={() => setViewMode('EDIT')} className="w-14 h-14 bg-slate-900 border border-white/5 text-emerald-500 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl">
              <Edit3 size={20} />
            </button>
            <button onClick={handleDelete} className="w-14 h-14 bg-slate-900 border border-white/5 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl">
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto w-full p-10 pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <div className="flex items-center text-slate-600 gap-3 text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-8">
               <Calendar size={14} className="text-brand-primary" />
               <span>TIMELINE_COORD: {formattedDate}</span>
            </div>
            <h1 className="text-7xl font-display font-black text-white leading-[1] tracking-tighter mb-12">{selectedEntry.title || ''}</h1>
            
            <div className="flex flex-wrap gap-8 p-10 bg-slate-900/50 border border-white/10 rounded-[3rem] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-brand-primary/20" />
              <StatInsight icon={<Star className="text-brand-primary" />} label="Neuro_Mood" value={`${selectedEntry.mood}/10`} />
              <StatInsight icon={<Zap className="text-brand-secondary" />} label="Vitality_Index" value={`${selectedEntry.energy}/10`} />
              <div className="flex-1" />
              {selectedEntry.tags?.map(t => (
                <span key={t} className="bg-slate-950 px-5 py-2.5 rounded-lg border border-white/5 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest self-center shadow-lg">#{t}</span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
             {selectedEntry.gratitude && <EditorialFeature label="Ascending_Reflection" value={selectedEntry.gratitude} icon="🙏" />}
             {selectedEntry.achievement && <EditorialFeature label="Growth_Vector_Peak" value={selectedEntry.achievement} icon="🏆" />}
             {selectedEntry.challenge && <EditorialFeature label="Entropy_Conflict" value={selectedEntry.challenge} icon="⚔️" />}
             {selectedEntry.lesson && <EditorialFeature label="Logic_Synthesis" value={selectedEntry.lesson} icon="💡" />}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none relative"
          >
            <div className="absolute -left-10 top-0 w-1 h-full bg-slate-900 rounded-full" />
            <div className="text-slate-300 text-3xl font-medium leading-[1.6] whitespace-pre-wrap font-sans selection:bg-brand-primary/30">
              {selectedEntry.content}
            </div>
          </motion.div>
        </main>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-base p-4 md:p-12 overflow-y-auto pb-40 scrollbar-hide data-grid">
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Intelligence Archive // Neural Logs</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-black text-white tracking-tighter">{t('journal')}.</h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none w-auto md:w-16 h-14 md:h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
             <Filter size={18} md:size={20} />
           </button>
           <button 
             onClick={() => setViewMode('CREATE')}
             className="flex-[2] md:flex-none bg-brand-primary p-4 md:p-6 rounded-2xl text-slate-950 shadow-2xl shadow-brand-primary/20 active:scale-95 transition-all hover:bg-emerald-400 group flex items-center justify-center"
           >
             <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
           </button>
        </div>
      </header>

      <div className="mb-12 relative group max-w-2xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
           <Search size={18} className="text-slate-700 group-focus-within:text-brand-primary transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Query logs // Narrative search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950/50 border border-white/[0.03] rounded-2xl py-6 pl-16 pr-8 text-white font-mono font-bold text-xs uppercase tracking-widest outline-none focus:border-brand-primary/20 transition-all placeholder:text-slate-850 shadow-xl"
        />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide pb-40">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="mb-4"
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
          <div className="flex flex-col items-center justify-center py-40 text-slate-850">
            <Book size={120} strokeWidth={1} className="mb-10 opacity-10" />
            <p className="text-[11px] font-mono font-black uppercase tracking-[0.6em] opacity-30">Archive Empty // No Narrative Logs Found</p>
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
