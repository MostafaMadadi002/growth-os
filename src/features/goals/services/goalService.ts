import { BigGoal, Milestone } from '../../../core/types';
import { goalRepository } from '../repositories/goalRepository';
import { activityService } from '../../../core/services/activityService';
import { supabase } from '../../../core/services/supabase';
import { useAuthStore } from '../../../core/stores/authStore';

/**
 * GoalService orchestrates the business logic for goals.
 * It uses the GoalRepository for persistence and 
 * triggers the ActivityService for point calculations and achievements.
 */
export const goalService = {
  async getAllGoals(): Promise<BigGoal[]> {
    const { user } = useAuthStore.getState();
    if (user) {
      const { data, error } = await supabase.from('goals').select('*').eq('user_id', user.id).is('deleted_at', null);
      if (!error && data) {
        goalRepository.saveGoals(data); // Sync local with cloud
        return data;
      }
    }
    return goalRepository.getGoals().filter(g => !g.deleted_at);
  },

  async createGoal(goal: Omit<BigGoal, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'visibility'>): Promise<BigGoal> {
    const { user } = useAuthStore.getState();
    const newGoal: BigGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 11),
      user_id: user?.id || 'guest',
      status: 'ACTIVE',
      visibility: 'private',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      milestones: goal.milestones || []
    };

    goalRepository.addGoal(newGoal);

    if (user) {
      await supabase.from('goals').insert([newGoal]);
    }
    
    await activityService.logActivity(
      'CUSTOM',
      'BigGoal',
      newGoal.id,
      `Set new goal: ${newGoal.title}`
    );
    
    return newGoal;
  },

  async updateGoal(id: string, updates: Partial<BigGoal>): Promise<BigGoal> {
    const { user } = useAuthStore.getState();
    const updated = goalRepository.updateGoal(id, updates);
    if (!updated) throw new Error('Goal not found');
    
    if (user) {
      await supabase.from('goals').update(updates).eq('id', id);
    }

    if (updates.status === 'COMPLETED') {
      await activityService.logActivity(
        'GOAL_COMPLETED',
        'BigGoal',
        id,
        `Mission Accomplished: ${updated.title}`
      );
    }

    return updated;
  },

  async deleteGoal(id: string): Promise<void> {
    const { user } = useAuthStore.getState();
    goalRepository.softDeleteGoal(id);
    if (user) {
      await supabase.from('goals').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    }
  },

  async toggleMilestone(goalId: string, milestoneId: string): Promise<BigGoal> {
    const goal = goalRepository.getGoalById(goalId);
    if (!goal) throw new Error('Goal not found');

    let milestoneTitle = '';
    const updatedMilestones = (goal.milestones || []).map(m => {
      if (m.id === milestoneId) {
        milestoneTitle = m.title;
        const newState = !m.is_completed;
        return { ...m, is_completed: newState };
      }
      return m;
    });

    const updated = await this.updateGoal(goalId, { milestones: updatedMilestones });
    
    // Check if it was completed
    const newlyCompleted = updated.milestones.find(m => m.id === milestoneId)?.is_completed;
    if (newlyCompleted) {
      await activityService.logActivity(
        'MILESTONE_COMPLETED',
        'Milestone',
        milestoneId,
        `Reached milestone: ${milestoneTitle} (${goal.title})`
      );
    }

    return updated;
  },

  async addMilestone(goalId: string, title: string): Promise<BigGoal> {
    const goal = goalRepository.getGoalById(goalId);
    if (!goal) throw new Error('Goal not found');

    const newMilestone: Milestone = {
      id: Math.random().toString(36).substring(2, 9),
      goal_id: goalId,
      title,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    const updatedMilestones = [...(goal.milestones || []), newMilestone];
    return this.updateGoal(goalId, { milestones: updatedMilestones });
  }
};



