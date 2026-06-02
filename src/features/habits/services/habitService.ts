import { supabase } from '../../../core/services/supabase';
import { Habit, HabitLog, HabitStatus } from '../../../core/types';

const HABITS_LOCAL_KEY = 'growthos_habits_backup';
const LOGS_LOCAL_KEY = 'growthos_logs_backup';

const getLocalHabits = (): Habit[] => JSON.parse(localStorage.getItem(HABITS_LOCAL_KEY) || '[]');
const saveLocalHabits = (h: Habit[]) => localStorage.setItem(HABITS_LOCAL_KEY, JSON.stringify(h));
const getLocalLogs = (): HabitLog[] => JSON.parse(localStorage.getItem(LOGS_LOCAL_KEY) || '[]');
const saveLocalLogs = (l: HabitLog[]) => localStorage.setItem(LOGS_LOCAL_KEY, JSON.stringify(l));

export const habitService = {
  async getAllHabits() {
    try {
      const { data, error } = await supabase.from('habits').select('*');
      if (error) throw error;
      return data as Habit[];
    } catch (e) {
      return getLocalHabits();
    }
  },

  async getLogs(date: string) {
    try {
      const { data, error } = await supabase.from('habit_logs').select('*').eq('date', date);
      if (error) throw error;
      return data as HabitLog[];
    } catch (e) {
      return getLocalLogs().filter(l => l.date === date);
    }
  },

  async createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      const { data, error } = await supabase.from('habits').insert([{ ...habit, user_id: user.id, created_at: new Date().toISOString() }]).select().single();
      if (error) throw error;
      return data as Habit;
    } catch (e) {
      const newHabit: Habit = { ...habit, id: Math.random().toString(36).substring(2, 11), user_id: 'guest', created_at: new Date().toISOString() };
      saveLocalHabits([...getLocalHabits(), newHabit]);
      return newHabit;
    }
  },

  async logHabit(habitId: string, status: HabitStatus, date: string) {
    try {
      const { data, error } = await supabase.from('habit_logs').upsert([{ habit_id: habitId, status, date }], { onConflict: 'habit_id,date' }).select().single();
      if (error) throw error;
      return data as HabitLog;
    } catch (e) {
      const logs = getLocalLogs();
      const existingIdx = logs.findIndex(l => l.habit_id === habitId && l.date === date);
      const newLog = { id: Math.random().toString(36).substring(2, 11), habit_id: habitId, status, date };
      if (existingIdx > -1) logs[existingIdx] = newLog;
      else logs.push(newLog);
      saveLocalLogs(logs);
      return newLog;
    }
  },

  async deleteHabit(id: string) {
    try {
      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      saveLocalHabits(getLocalHabits().filter(h => h.id !== id));
      saveLocalLogs(getLocalLogs().filter(l => l.habit_id !== id));
    }
  }
};
