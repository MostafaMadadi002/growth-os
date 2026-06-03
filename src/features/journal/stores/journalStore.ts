import { create } from 'zustand';
import { JournalEntry } from '../../../core/types';
import { journalService } from '../services/journalService';

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'visibility'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await journalService.getAllEntries();
      set({ entries, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true });
    try {
      const newEntry = await journalService.createEntry(entry);
      set({ entries: [newEntry, ...get().entries], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateEntry: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updated = await journalService.updateEntry(id, updates);
      set({
        entries: get().entries.map((e) => (e.id === id ? updated : e)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true });
    try {
      await journalService.deleteEntry(id);
      set({
        entries: get().entries.filter((e) => e.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
