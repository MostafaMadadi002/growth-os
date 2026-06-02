import { supabase } from '../../../core/services/supabase';
import { BigGoal, Milestone } from '../../../core/types';

const GOALS_LOCAL = 'growthos_goals_backup';

const getGoals = (): BigGoal[] => JSON.parse(localStorage.getItem(GOALS_LOCAL) || '[]');
const saveGoals = (g: BigGoal[]) => localStorage.setItem(GOALS_LOCAL, JSON.stringify(g));

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

  async createGoal(goal: Omit<BigGoal, 'id' | 'user_id' | 'status'>) {
    const status = 'ACTIVE';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { data, error } = await supabase.from('big_goals').insert([{ ...goal, user_id: user.id, status }]).select().single();
      if (error) throw error;
      return data as BigGoal;
    } catch (e) {
      const g: BigGoal = { 
        ...goal, 
        id: Math.random().toString(36).substring(2,11), 
        user_id: 'guest', 
        status 
      } as BigGoal;
      saveGoals([...getGoals(), g]);
      return g;
    }
  },

  async updateGoal(id: string, updates: Partial<BigGoal>) {
    try {
      const { data, error } = await supabase.from('big_goals').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as BigGoal;
    } catch (e) {
      const goals = getGoals();
      const idx = goals.findIndex(g => g.id === id);
      if (idx > -1) {
        goals[idx] = { ...goals[idx], ...updates };
        saveGoals(goals);
        return goals[idx];
      }
      throw e;
    }
  },

  async toggleMilestone(goalId: string, milestoneId: string) {
    const goals = await this.getAllGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) throw new Error('Goal not found');

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, is_completed: !m.is_completed } : m
    );

    return this.updateGoal(goalId, { milestones: updatedMilestones });
  }
};
