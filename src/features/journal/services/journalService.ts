import { supabase } from '../../../core/services/supabase';
import { JournalEntry } from '../../../core/types';

const LOCAL_STORAGE_KEY = 'growthos_journal_backup';

const getLocalEntries = (): JournalEntry[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalEntries = (entries: JournalEntry[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
};

export const journalService = {
  async getAllEntries() {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      return data as JournalEntry[];
    } catch (e) {
      return getLocalEntries();
    }
  },

  async createEntry(entry: Omit<JournalEntry, 'id' | 'user_id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data as JournalEntry;
    } catch (e) {
      const newEntry: JournalEntry = {
        ...entry,
        id: Math.random().toString(36).substring(2, 11),
        user_id: 'guest'
      };
      const local = getLocalEntries();
      saveLocalEntries([newEntry, ...local]);
      return newEntry;
    }
  },

  async updateEntry(id: string, updates: Partial<JournalEntry>) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as JournalEntry;
    } catch (e) {
      const local = getLocalEntries();
      const updated = local.map(ent => ent.id === id ? { ...ent, ...updates } : ent);
      saveLocalEntries(updated);
      return updated.find(ent => ent.id === id) as JournalEntry;
    }
  },

  async deleteEntry(id: string) {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      const local = getLocalEntries();
      saveLocalEntries(local.filter(ent => ent.id !== id));
    }
  }
};
