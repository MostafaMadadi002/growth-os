import { BigGoal, Milestone, ProgressRecord } from '../../../core/types';

/**
 * GoalRepository handles direct data persistence for goals, milestones, and progress.
 * Currently uses localStorage for MVP, but designed to be replaced with Supabase.
 */
export const goalRepository = {
  getGoals: (): BigGoal[] => {
    return JSON.parse(localStorage.getItem('goals') || '[]');
  },

  saveGoals: (goals: BigGoal[]): void => {
    localStorage.setItem('goals', JSON.stringify(goals));
  },

  getGoalById: (id: string): BigGoal | undefined => {
    const goals = goalRepository.getGoals();
    return goals.find(g => g.id === id);
  },

  addGoal: (goal: BigGoal): void => {
    const goals = goalRepository.getGoals();
    goalRepository.saveGoals([...goals, goal]);
  },

  updateGoal: (id: string, updates: Partial<BigGoal>): BigGoal | undefined => {
    const goals = goalRepository.getGoals();
    const idx = goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      goals[idx] = { ...goals[idx], ...updates, updated_at: new Date().toISOString() };
      goalRepository.saveGoals(goals);
      return goals[idx];
    }
    return undefined;
  },

  softDeleteGoal: (id: string): void => {
    goalRepository.updateGoal(id, { deleted_at: new Date().toISOString() });
  },

  getMilestones: (goalId: string): Milestone[] => {
    const goal = goalRepository.getGoalById(goalId);
    return goal?.milestones || [];
  },

  updateMilestones: (goalId: string, milestones: Milestone[]): void => {
    goalRepository.updateGoal(goalId, { milestones });
  }
};
