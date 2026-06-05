import { create } from 'zustand';
import { useHabitStore } from '../../features/habits/stores/habitStore';
import { useGoalStore } from '../../features/goals/stores/goalStore';
// import { useJournalStore } from '../../features/journal/stores/journalStore';
import { HabitStatus } from '../types';

interface GrowthState {
  dailyScore: number;
  weeklyScore: number;
  monthlyScore: number;
  lifetimeScore: number;
  calculateScores: () => void;
}

export const useGrowthStore = create<GrowthState>((set) => ({
  dailyScore: 0,
  weeklyScore: 0,
  monthlyScore: 0,
  lifetimeScore: 0,

  calculateScores: () => {
    const { todayLogs } = useHabitStore.getState();
    const { goals } = useGoalStore.getState();
    // const { entries } = useJournalStore.getState();
    const entries: any[] = [];

    const todayStr = new Date().toISOString().split('T')[0];
    
    // Points Config
    const POINTS = {
      JOURNAL: 10,
      HABIT: 5,
      GOAL_S: 1000,
      GOAL_A: 500,
      GOAL_B: 250,
      GOAL_C: 100,
      GOAL_DAILY: 15,
      GOAL_WEEKLY: 50,
      GOAL_MONTHLY: 150,
      GOAL_QUARTERLY: 250,
      GOAL_YEARLY: 500,
      GOAL_LIFETIME: 1000,
    };

    let total = 0;
    let daily = 0;

    // Journal Points
    entries.forEach(entry => {
      total += POINTS.JOURNAL;
      if (entry.entry_date === todayStr) daily += POINTS.JOURNAL;
    });

    // Habit Points (Today only for now due to todayLogs limitation)
    Object.values(todayLogs).forEach(log => {
      if (log.status === HabitStatus.DONE) {
        if (log.date === todayStr) {
          daily += POINTS.HABIT;
          total += POINTS.HABIT;
        }
      }
    });

    // Goal Points
    goals.forEach(goal => {
      if (goal.status === 'COMPLETED') {
        const pointKey = `GOAL_${goal.level}` as keyof typeof POINTS;
        total += POINTS[pointKey] || 50;
      }
    });

    set({ 
      dailyScore: daily,
      lifetimeScore: total,
      // Weekly/Monthly would require more complex date filtering logic
      weeklyScore: Math.floor(daily * 5.5), // Placeholder
      monthlyScore: Math.floor(daily * 22), // Placeholder
    });
  }
}));
