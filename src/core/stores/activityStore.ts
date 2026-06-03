import { create } from 'zustand';
import { ActivityRecord } from '../types';
import { activityService } from '../services/activityService';

interface ActivityState {
  activities: ActivityRecord[];
  todayPoints: number;
  heatmapData: Record<string, number>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActivities: () => Promise<void>;
  fetchTodayPoints: () => Promise<void>;
  fetchHeatmapData: (days: number) => Promise<void>;
  logCustomActivity: (title: string, points: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  todayPoints: 0,
  heatmapData: {},
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true });
    try {
      const activities = await activityService.getRecentActivities();
      set({ activities, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTodayPoints: async () => {
    try {
      const todayPoints = await activityService.getPointsForToday();
      set({ todayPoints });
    } catch (err: any) {
      console.error('Failed to fetch today points', err);
    }
  },

  fetchHeatmapData: async (days) => {
    try {
      const heatmapData = await activityService.getPointsByDate(days);
      set({ heatmapData });
    } catch (err: any) {
      console.error('Failed to fetch heatmap data', err);
    }
  },

  logCustomActivity: async (title, points) => {
    try {
      await activityService.logActivity('CUSTOM', 'Manual', 'manual', title, { manualPoints: points });
      get().fetchActivities();
      get().fetchTodayPoints();
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
