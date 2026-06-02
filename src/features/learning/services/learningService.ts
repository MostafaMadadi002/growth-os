import { supabase } from '../../../core/services/supabase';
import { LearningSession } from '../../../core/types';

const LOCAL_KEY = 'growthos_learning_backup';
const getLocal = (): LearningSession[] => JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
const saveLocal = (d: LearningSession[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(d));

export const learningService = {
  async getAll() {
    try {
      const { data, error } = await supabase.from('learning_sessions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data as LearningSession[];
    } catch (e) {
      return getLocal();
    }
  },

  async create(session: Omit<LearningSession, 'id' | 'user_id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { data, error } = await supabase.from('learning_sessions').insert([{ ...session, user_id: user.id }]).select().single();
      if (error) throw error;
      return data as LearningSession;
    } catch (e) {
      const s = { ...session, id: Math.random().toString(36).substring(2,11), user_id: 'guest' };
      saveLocal([s, ...getLocal()]);
      return s;
    }
  }
};
