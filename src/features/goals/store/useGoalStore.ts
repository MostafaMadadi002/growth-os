import { create } from 'zustand';
import { BigGoal, GoalSession } from '../../../core/types';
import { goalService } from '../services/goalService';

interface GoalState {
  goals: BigGoal[];
  sessions: Record<string, GoalSession[]>;
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  fetchSessions: (goalId: string) => Promise<void>;
  addGoal: (goal: Omit<BigGoal, 'id' | 'user_id' | 'status'>) => Promise<void>;
  toggleSession: (goalId: string, sessionId: string, isCompleted: boolean) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  sessions: {},
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    const goals = await goalService.getAllGoals();
    set({ goals, isLoading: false });
  },

  fetchSessions: async (goalId) => {
    const s = await goalService.getSessions(goalId);
    set({ sessions: { ...get().sessions, [goalId]: s } });
  },

  addGoal: async (goal) => {
    const g = await goalService.createGoal(goal);
    set({ goals: [g as BigGoal, ...get().goals] });
  },

  toggleSession: async (goalId, sessionId, isCompleted) => {
    const updated = await goalService.completeSession(sessionId, isCompleted);
    const goalSessions = get().sessions[goalId] || [];
    set({
      sessions: {
        ...get().sessions,
        [goalId]: goalSessions.map(s => s.id === sessionId ? updated : s)
      }
    });
  }
}));
