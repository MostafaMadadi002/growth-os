import { supabase } from '../../../core/services/supabase';
import { Note } from '../../../core/types';

// Helper to handle offline/local storage if supabase fails
const LOCAL_STORAGE_KEY = 'growthos_notes_backup';

const getLocalNotes = (): Note[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalNotes = (notes: Note[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
};

export const noteService = {
  async getAllNotes() {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('last_edited_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    } catch (e) {
      console.warn('Using local backup for notes');
      return getLocalNotes();
    }
  },

  async createNote(note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'last_edited_at'>) {
    const now = new Date().toISOString();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

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
    } catch (e) {
      // Fallback to local storage
      const newNote: Note = {
        ...note,
        id: Math.random().toString(36).substring(2, 11),
        user_id: 'guest',
        created_at: now,
        last_edited_at: now
      };
      const localNotes = getLocalNotes();
      saveLocalNotes([newNote, ...localNotes]);
      return newNote;
    }
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const now = new Date().toISOString();
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          last_edited_at: now
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    } catch (e) {
      const localNotes = getLocalNotes();
      const updatedNotes = localNotes.map(n => 
        n.id === id ? { ...n, ...updates, last_edited_at: now } : n
      );
      saveLocalNotes(updatedNotes);
      return updatedNotes.find(n => n.id === id) as Note;
    }
  },

  async deleteNote(id: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      const localNotes = getLocalNotes();
      saveLocalNotes(localNotes.filter(n => n.id !== id));
    }
  },
};
