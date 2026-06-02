import { supabase } from '../../../core/services/supabase';
import { Workout } from '../../../core/types';

const LOCAL_KEY = 'growthos_fitness_backup';
const getLocal = (): Workout[] => JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
const saveLocal = (d: Workout[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(d));

export const fitnessService = {
  async getAllWorkouts() {
    try {
      const { data, error } = await supabase.from('workouts').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data as Workout[];
    } catch (e) {
      return getLocal();
    }
  },

  async createWorkout(workout: Omit<Workout, 'id' | 'user_id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { data, error } = await supabase.from('workouts').insert([{ ...workout, user_id: user.id }]).select().single();
      if (error) throw error;
      return data as Workout;
    } catch (e) {
      const w = { ...workout, id: Math.random().toString(36).substring(2,11), user_id: 'guest' };
      saveLocal([w, ...getLocal()]);
      return w;
    }
  }
};
