import { create } from 'zustand';
import { Achievement, ActivityRecord } from '../../../core/types';
import { achievementService } from '../../../core/services/achievementService';

interface AchievementState {
  unlocked: Achievement[];
  isLoading: boolean;
  error: string | null;

  fetchUnlocked: () => Promise<void>;
  checkNewAchievements: (activities: ActivityRecord[]) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlocked: [],
  isLoading: false,
  error: null,

  fetchUnlocked: async () => {
    set({ isLoading: true });
    try {
      const unlocked = await achievementService.getUnlocked();
      set({ unlocked, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  checkNewAchievements: async (activities) => {
    try {
      const newUnlocks = await achievementService.checkAchievements(activities);
      if (newUnlocks.length > 0) {
        const current = get().unlocked;
        set({ unlocked: [...current, ...newUnlocks] });
      }
    } catch (err: any) {
      console.error('Failed to check achievements', err);
    }
  }
}));
