import { create } from 'zustand';
import { BigGoal } from '../../../core/types';
import { goalService } from '../services/goalService';

interface GoalState {
  goals: BigGoal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<BigGoal, 'id' | 'user_id' | 'status'>) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    const goals = await goalService.getAllGoals();
    set({ goals, isLoading: false });
  },

  addGoal: async (goal) => {
    const g = await goalService.createGoal(goal);
    set({ goals: [g, ...get().goals] });
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const updatedGoal = await goalService.toggleMilestone(goalId, milestoneId);
    set({
      goals: get().goals.map(g => g.id === goalId ? updatedGoal : g)
    });
  }
}));
