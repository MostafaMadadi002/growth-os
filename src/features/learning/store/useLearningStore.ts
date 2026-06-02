import { create } from 'zustand';
import { LearningSession } from '../../../core/types';
import { learningService } from '../services/learningService';

interface LearningState {
  sessions: LearningSession[];
  isLoading: boolean;
  fetchSessions: () => Promise<void>;
  addSession: (s: Omit<LearningSession, 'id' | 'user_id'>) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  sessions: [],
  isLoading: false,

  fetchSessions: async () => {
    set({ isLoading: true });
    const sessions = await learningService.getAll();
    set({ sessions, isLoading: false });
  },

  addSession: async (s) => {
    const session = await learningService.create(s);
    set({ sessions: [session, ...get().sessions] });
  }
}));
