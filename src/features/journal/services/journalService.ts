import { JournalEntry } from '../../../core/types';
import { journalRepository } from '../repositories/journalRepository';
import { activityService } from '../../../core/services/activityService';
import { supabase } from '../../../core/services/supabase';
import { useAuthStore } from '../../../core/stores/authStore';

/**
 * JournalService orchestrates business logic for journaling.
 */
export const journalService = {
  async getAllEntries(): Promise<JournalEntry[]> {
    const { user } = useAuthStore.getState();
    if (user) {
      const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', user.id).is('deleted_at', null);
      if (!error && data) {
        journalRepository.saveEntries(data);
        return data;
      }
    }
    return journalRepository.getEntries().filter(e => !e.deleted_at);
  },

  async createEntry(entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'visibility'>): Promise<JournalEntry> {
    const { user } = useAuthStore.getState();
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      user_id: user?.id || 'guest',
      visibility: 'private',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      entry_date: entry.entry_date || new Date().toISOString().split('T')[0]
    };

    journalRepository.addEntry(newEntry);

    if (user) {
      await supabase.from('journal_entries').insert([newEntry]);
    }

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
    const { user } = useAuthStore.getState();
    const updated = journalRepository.updateEntry(id, updates);
    if (!updated) throw new Error('Entry not found');
    
    if (user) {
      await supabase.from('journal_entries').update(updates).eq('id', id);
    }

    return updated;
  },

  async deleteEntry(id: string): Promise<void> {
    const { user } = useAuthStore.getState();
    journalRepository.softDeleteEntry(id);
    if (user) {
      await supabase.from('journal_entries').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    }
  }
};

