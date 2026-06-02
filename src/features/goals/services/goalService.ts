import { supabase } from '../../../core/services/supabase';
import { BigGoal, GoalSession } from '../../../core/types';

const GOALS_LOCAL = 'growthos_goals_backup';
const SESSIONS_LOCAL = 'growthos_sessions_backup';

const getGoals = () => JSON.parse(localStorage.getItem(GOALS_LOCAL) || '[]');
const saveGoals = (g: any) => localStorage.setItem(GOALS_LOCAL, JSON.stringify(g));
const getSessions = () => JSON.parse(localStorage.getItem(SESSIONS_LOCAL) || '[]');
const saveSessions = (s: any) => localStorage.setItem(SESSIONS_LOCAL, JSON.stringify(s));

export const goalService = {
  async getAllGoals() {
    try {
      const { data, error } = await supabase.from('big_goals').select('*');
      if (error) throw error;
      return data as BigGoal[];
    } catch (e) {
      return getGoals();
    }
  },

  async getSessions(goalId: string) {
    try {
      const { data, error } = await supabase.from('goal_sessions').select('*').eq('goal_id', goalId).order('session_number');
      if (error) throw error;
      return data as GoalSession[];
    } catch (e) {
      return getSessions().filter((s:any) => s.goal_id === goalId);
    }
  },

  async createGoal(goal: Omit<BigGoal, 'id' | 'user_id' | 'status'>) {
    const status = 'ACTIVE';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { data, error } = await supabase.from('big_goals').insert([{ ...goal, user_id: user.id, status }]).select().single();
      if (error) throw error;
      
      // Auto-create sessions
      const sessions = Array.from({ length: goal.total_expected_sessions }, (_, i) => ({
        goal_id: data.id,
        session_number: i + 1,
        is_completed: false
      }));
      await supabase.from('goal_sessions').insert(sessions);
      
      return data as BigGoal;
    } catch (e) {
      const g = { ...goal, id: Math.random().toString(36).substring(2,11), user_id: 'guest', status };
      saveGoals([...getGoals(), g]);
      const sessions = Array.from({ length: goal.total_expected_sessions }, (_, i) => ({
        id: Math.random().toString(36).substring(2,11),
        goal_id: g.id,
        session_number: i + 1,
        is_completed: false
      }));
      saveSessions([...getSessions(), ...sessions]);
      return g;
    }
  },

  async completeSession(sessionId: string, isCompleted: boolean) {
    try {
      const { data, error } = await supabase.from('goal_sessions').update({ is_completed: isCompleted, date: new Date().toISOString() }).eq('id', sessionId).select().single();
      if (error) throw error;
      return data as GoalSession;
    } catch (e) {
      const s = getSessions();
      const idx = s.findIndex((x:any) => x.id === sessionId);
      if (idx > -1) {
        s[idx] = { ...s[idx], is_completed: isCompleted, date: new Date().toISOString() };
        saveSessions(s);
        return s[idx];
      }
      throw e;
    }
  }
};
