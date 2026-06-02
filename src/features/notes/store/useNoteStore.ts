import { create } from 'zustand';
import { Note } from '../../../core/types';
import { noteService } from '../services/noteService';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'last_edited_at'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notes = await noteService.getAllNotes();
      set({ notes, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addNote: async (note) => {
    set({ isLoading: true });
    try {
      const newNote = await noteService.createNote(note);
      set({ notes: [newNote, ...get().notes], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateNote: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updated = await noteService.updateNote(id, updates);
      set({
        notes: get().notes.map((n) => (n.id === id ? updated : n)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true });
    try {
      await noteService.deleteNote(id);
      set({
        notes: get().notes.filter((n) => n.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
