import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronRight, Trash2, Edit3, X } from 'lucide-react';
import { useNoteStore } from './store/useNoteStore';
import NoteListItem from './components/NoteListItem';
import NoteForm from './components/NoteForm';
import DeleteNoteModal from './components/DeleteNoteModal';
import { Note } from '../../core/types';

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL' | 'EDIT';

export default function NotesScreen() {
  const { notes, isLoading, fetchNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: { title: string; content: string }) => {
    await addNote(data);
    setViewMode('LIST');
  };

  const handleEdit = async (data: { title: string; content: string }) => {
    if (selectedNote) {
      await updateNote(selectedNote.id, data);
      setSelectedNote({ ...selectedNote, ...data });
      setViewMode('DETAIL');
    }
  };

  const handleDelete = async () => {
    if (selectedNote) {
      await deleteNote(selectedNote.id);
      setIsDeleteModalOpen(false);
      setSelectedNote(null);
      setViewMode('LIST');
    }
  };

  if (viewMode === 'CREATE') {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
        <header className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">یادداشت جدید</h2>
          <button onClick={() => setViewMode('LIST')} className="p-2 bg-slate-800 rounded-xl"><X size={20}/></button>
        </header>
        <NoteForm onSubmit={handleCreate} onCancel={() => setViewMode('LIST')} loading={isLoading} />
      </div>
    );
  }

  if (viewMode === 'EDIT' && selectedNote) {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
        <header className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">ویرایش یادداشت</h2>
          <button onClick={() => setViewMode('DETAIL')} className="p-2 bg-slate-800 rounded-xl"><X size={20}/></button>
        </header>
        <NoteForm 
          initialData={selectedNote} 
          onSubmit={handleEdit} 
          onCancel={() => setViewMode('DETAIL')} 
          loading={isLoading} 
        />
      </div>
    );
  }

  if (viewMode === 'DETAIL' && selectedNote) {
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
            <button onClick={() => setIsDeleteModalOpen(true)} className="p-3 bg-slate-800 text-red-500 rounded-2xl">
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <main className="p-6 pt-28 pb-10">
          <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight">{selectedNote.title}</h1>
          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
        </main>

        <DeleteNoteModal 
          isOpen={isDeleteModalOpen} 
          onCancel={() => setIsDeleteModalOpen(false)} 
          onConfirm={handleDelete}
          loading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white mb-6">یادداشت‌ها</h1>
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="جستجو بین یادداشت‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-emerald-500 outline-none transition-all shadow-lg"
          />
        </div>
      </header>

      <main className="flex-1">
        {isLoading && notes.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="pb-24">
            {filteredNotes.map(note => (
              <NoteListItem 
                key={note.id} 
                note={note} 
                onClick={() => {
                  setSelectedNote(note);
                  setViewMode('DETAIL');
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-60">
            <div className="bg-slate-800 p-8 rounded-full mb-6">
              <Search size={48} />
            </div>
            <p className="text-lg font-medium">یادداشتی پیدا نشد</p>
            <p className="text-sm mt-2">اولین یادداشت خود را همین حالا بسازید!</p>
          </div>
        )}
      </main>

      <button 
        onClick={() => setViewMode('CREATE')}
        className="fixed bottom-24 right-6 bg-emerald-500 hover:bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 text-white transition-all hover:scale-105 active:scale-95 z-20"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
}
