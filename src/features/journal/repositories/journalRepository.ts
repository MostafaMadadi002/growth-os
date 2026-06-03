import { JournalEntry } from '../../../core/types';

/**
 * JournalRepository handles data persistence for journal entries.
 */
export const journalRepository = {
  getEntries: (): JournalEntry[] => {
    return JSON.parse(localStorage.getItem('journal_entries') || '[]');
  },

  saveEntries: (entries: JournalEntry[]): void => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  },

  getEntryById: (id: string): JournalEntry | undefined => {
    return journalRepository.getEntries().find(e => e.id === id);
  },

  addEntry: (entry: JournalEntry): void => {
    const entries = journalRepository.getEntries();
    journalRepository.saveEntries([entry, ...entries]);
  },

  updateEntry: (id: string, updates: Partial<JournalEntry>): JournalEntry | undefined => {
    const entries = journalRepository.getEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      entries[idx] = { ...entries[idx], ...updates, updated_at: new Date().toISOString() };
      journalRepository.saveEntries(entries);
      return entries[idx];
    }
    return undefined;
  },

  softDeleteEntry: (id: string): void => {
    journalRepository.updateEntry(id, { deleted_at: new Date().toISOString() });
  }
};
