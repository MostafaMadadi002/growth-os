import { create } from 'zustand';
import { BigGoal } from '../../../core/types';
import { goalService } from '../services/goalService';

interface GoalState {
  goals: BigGoal[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<BigGoal, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'visibility'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<BigGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addMilestone: (goalId: string, title: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await goalService.getAllGoals();
      set({ goals, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    try {
      const newGoal = await goalService.createGoal(goalData);
      set(state => ({ 
        goals: [...state.goals, newGoal],
        isLoading: false 
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedGoal = await goalService.updateGoal(id, updates);
      set(state => ({
        goals: state.goals.map(g => g.id === id ? updatedGoal : g),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await goalService.deleteGoal(id);
      set(state => ({
        goals: state.goals.filter(g => g.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addMilestone: async (goalId, title) => {
    try {
      const updatedGoal = await goalService.addMilestone(goalId, title);
      set(state => ({
        goals: state.goals.map(g => g.id === goalId ? updatedGoal : g)
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    try {
      const updatedGoal = await goalService.toggleMilestone(goalId, milestoneId);
      set(state => ({
        goals: state.goals.map(g => g.id === goalId ? updatedGoal : g)
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
