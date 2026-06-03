import { BigGoal, Milestone } from '../../../core/types';
import { goalRepository } from '../repositories/goalRepository';

/**
 * GoalService orchestrates the business logic for goals.
 * It uses the GoalRepository for persistence and will eventually 
 * trigger the ActivityService for point calculations and achievements.
 */
export const goalService = {
  async getAllGoals(): Promise<BigGoal[]> {
    // Return only non-deleted goals
    return goalRepository.getGoals().filter(g => !g.deleted_at);
  },

  async createGoal(goal: Omit<BigGoal, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'visibility'>): Promise<BigGoal> {
    const newGoal: BigGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 11),
      user_id: 'guest', // To be replaced with auth user id
      status: 'ACTIVE',
      visibility: 'private',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      milestones: goal.milestones || []
    };

    goalRepository.addGoal(newGoal);
    
    // TODO: Trigger ActivityService.logActivity('GOAL_CREATED', 'Goal', newGoal.id)
    
    return newGoal;
  },

  async updateGoal(id: string, updates: Partial<BigGoal>): Promise<BigGoal> {
    const updated = goalRepository.updateGoal(id, updates);
    if (!updated) throw new Error('Goal not found');
    
    // Check if status changed to COMPLETED
    if (updates.status === 'COMPLETED') {
      // TODO: Trigger ActivityService.logActivity('GOAL_COMPLETED', 'Goal', id)
    }

    return updated;
  },

  async deleteGoal(id: string): Promise<void> {
    goalRepository.softDeleteGoal(id);
  },

  async toggleMilestone(goalId: string, milestoneId: string): Promise<BigGoal> {
    const goal = goalRepository.getGoalById(goalId);
    if (!goal) throw new Error('Goal not found');

    const updatedMilestones = (goal.milestones || []).map(m => {
      if (m.id === milestoneId) {
        const newState = !m.is_completed;
        if (newState) {
          // TODO: Trigger ActivityService.logActivity('MILESTONE_COMPLETED', 'Milestone', milestoneId)
        }
        return { ...m, is_completed: newState };
      }
      return m;
    });

    const updated = await this.updateGoal(goalId, { milestones: updatedMilestones });
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


