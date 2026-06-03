import { JournalEntry } from '../../../core/types';
import { journalRepository } from '../repositories/journalRepository';
import { activityService } from '../../../core/services/activityService';

/**
 * JournalService orchestrates business logic for journaling.
 */
export const journalService = {
  async getAllEntries(): Promise<JournalEntry[]> {
    return journalRepository.getEntries().filter(e => !e.deleted_at);
  },

  async createEntry(entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'visibility'>): Promise<JournalEntry> {
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      user_id: 'guest',
      visibility: 'private',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      entry_date: entry.entry_date || new Date().toISOString().split('T')[0]
    };

    journalRepository.addEntry(newEntry);

    // Log activity
    await activityService.logActivity(
      'JOURNAL_CREATED',
      'JournalEntry',
      newEntry.id,
      `Journaled: ${newEntry.title || 'New Entry'}`
    );

    return newEntry;
  },

  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const updated = journalRepository.updateEntry(id, updates);
    if (!updated) throw new Error('Entry not found');
    return updated;
  },

  async deleteEntry(id: string): Promise<void> {
    journalRepository.softDeleteEntry(id);
  }
};

