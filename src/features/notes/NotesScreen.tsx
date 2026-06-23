import React, { useState } from 'react';
import { 
  Plus, Search, StickyNote, Trash2, Link as LinkIcon, 
  ChevronDown, ExternalLink, Calendar, X
} from 'lucide-react';
import { useAppStore, Note, UserRole } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function NotesScreen() {
  const { t, language } = useI18n();
  const { currentRoot, studentData, traderData, addNote, deleteNote } = useAppStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const domain = currentRoot === UserRole.STUDENT ? 'STUDENT' : 'TRADER';
  const data = currentRoot === UserRole.STUDENT ? studentData : traderData;
  const notes = data.notes || [];

  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    linkedId: '',
    linkedType: currentRoot === UserRole.STUDENT ? 'GOAL' : 'TRADE'
  });

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return;

    const note: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString(),
      linkedId: newNote.linkedId || undefined,
      linkedType: newNote.linkedId ? (currentRoot === UserRole.STUDENT ? 'GOAL' : 'TRADE') : undefined
    };

    addNote(note, domain);
    setIsAdding(false);
    setNewNote({ title: '', content: '', linkedId: '', linkedType: currentRoot === UserRole.STUDENT ? 'GOAL' : 'TRADE' });
  };

  const getLinkedTitle = (note: Note) => {
    if (!note.linkedId) return null;
    if (note.linkedType === 'GOAL') {
      return studentData.goals.find(g => g.id === note.linkedId)?.title;
    }
    if (note.linkedType === 'TRADE') {
      const trade = traderData.trades.find(t => t.id === note.linkedId);
      return trade ? `${trade.symbol} (${trade.result})` : null;
    }
    return null;
  };

  return (
    <div className="space-y-8 md:space-y-12 w-full max-w-7xl mx-auto pb-32 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">
              {domain}_CENTRAL_ARCHIVE
            </span>
          </div>
          <h1 className={`text-3xl md:text-5xl font-display font-black text-text-primary ${language === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase mt-1`}>
            {t('branch_notes').split(' ')[0]}<span className="text-brand-primary">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group w-full md:w-64">
            <Search className={`absolute ${language === 'fa' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary opacity-40 group-focus-within:text-brand-primary transition-colors`} size={16} />
            <input 
              type="text"
              placeholder={t('search_symbol_notes')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${language === 'fa' ? 'pr-11 pl-6' : 'pl-11 pr-6'} py-3 bg-surface-card border border-surface-border rounded-xl text-[12px] font-mono focus:outline-none focus:border-brand-primary/50 transition-all`}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-3 bg-brand-primary text-slate-950 rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 shrink-0"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Add Note Modal/Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-card border border-surface-border w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-text-primary uppercase tracking-tight">
                  {t('add_note')}
                </h3>
                <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest opacity-60">Archive_Synaptic_Input</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] px-1">{t('note_title')}</label>
                  <input 
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="e.g. Master Strategy v1"
                    className="w-full p-4 bg-surface-base border border-surface-border rounded-xl text-sm font-mono focus:outline-none focus:border-brand-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] px-1">{t('note_content')}</label>
                  <textarea 
                    rows={6}
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    placeholder={t('notes_placeholder')}
                    className="w-full p-4 bg-surface-base border border-surface-border rounded-xl text-sm font-mono focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] px-1">{t('link_to')}</label>
                  <select 
                    value={newNote.linkedId}
                    onChange={(e) => setNewNote({...newNote, linkedId: e.target.value})}
                    className="w-full p-4 bg-surface-base border border-surface-border rounded-xl text-sm font-mono focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
                  >
                    <option value="">{t('no_linked_item')}</option>
                    {currentRoot === UserRole.STUDENT ? (
                      studentData.goals.map(g => (
                        <option key={g.id} value={g.id}>{g.title}</option>
                      ))
                    ) : (
                      traderData.trades.map(t => (
                        <option key={t.id} value={t.id}>{t.symbol} - {t.date} ({t.result})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 md:py-4 bg-surface-base border border-surface-border rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest hover:bg-surface-card transition-all"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleAddNote}
                  className="flex-1 py-3 md:py-4 bg-brand-primary text-slate-950 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20"
                >
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {filteredNotes.map((note) => (
          <motion.div 
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 bg-surface-card border border-surface-border rounded-[2rem] space-y-6 group hover:border-brand-primary/30 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <StickyNote size={20} />
                </div>
                {confirmDeleteId === note.id ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        deleteNote(note.id, domain);
                        setConfirmDeleteId(null);
                      }}
                      className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                    >
                      {language === 'fa' ? 'تایید' : 'CONFIRM'}
                    </button>
                    <button 
                      onClick={() => setConfirmDeleteId(null)}
                      className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setConfirmDeleteId(note.id)}
                    className="p-2 text-text-secondary opacity-20 hover:opacity-100 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-display font-black text-text-primary tracking-tight uppercase line-clamp-1">{note.title}</h4>
                <div className="flex items-center gap-2 text-[8px] font-mono text-text-secondary uppercase tracking-widest opacity-40">
                  <Calendar size={10} />
                  {new Date(note.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
                </div>
              </div>

              <p className="text-sm font-mono text-text-secondary leading-relaxed line-clamp-4 overflow-hidden">
                {note.content}
              </p>
            </div>

            {note.linkedId && (
              <div className="pt-6 mt-6 border-t border-surface-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-surface-base border border-surface-border flex items-center justify-center text-brand-primary">
                    <LinkIcon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-mono font-black text-text-secondary uppercase opacity-40 leading-none mb-1">{t('linked_to')}</p>
                    <p className="text-[10px] font-mono font-black text-text-primary uppercase leading-none truncate">
                      {getLinkedTitle(note)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-surface-card border border-surface-border rounded-2xl flex items-center justify-center mx-auto opacity-20 text-text-secondary">
              <StickyNote size={32} />
            </div>
            <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-40">Archive_Empty // awaiting_signal</p>
          </div>
        )}
      </div>
    </div>
  );
}
