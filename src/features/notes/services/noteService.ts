import { supabase } from '../../../core/services/supabase';
import { Note } from '../../../core/types';

export const noteService = {
  async getAllNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('last_edited_at', { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async createNote(note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'last_edited_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        ...note, 
        user_id: user.id,
        created_at: now,
        last_edited_at: now
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update({
        ...updates,
        last_edited_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
