import { supabase } from '../../../core/services/supabase';
import { JournalEntry } from '../../../core/types';

export const journalService = {
  async getAllJournals() {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('entry_date', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  async createJournal(entry: Omit<JournalEntry, 'id' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  async updateJournal(id: string, updates: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  async deleteJournal(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
