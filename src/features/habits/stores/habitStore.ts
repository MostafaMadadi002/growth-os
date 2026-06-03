import { create } from 'zustand';
import { Habit, HabitLog, HabitStatus } from '../../../core/types';
import { habitService } from '../services/habitService';
import { activityService } from '../../../core/services/activityService';

interface HabitState {
  habits: Habit[];
  todayLogs: Record<string, HabitLog>; // habitId -> HabitLog
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'visibility'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  logHabit: (habitId: string, status: HabitStatus, date: string, value?: number) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  todayLogs: {},
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await habitService.getAllHabits();
      const logs = await habitService.getTodayLogs();
      
      const todayLogsMap: Record<string, HabitLog> = {};
      logs.forEach(l => {
        todayLogsMap[l.habit_id] = l;
      });

      set({ habits, todayLogs: todayLogsMap, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    set({ isLoading: true, error: null });
    try {
      const newHabit = await habitService.createHabit(habitData);
      set(state => ({
        habits: [...state.habits, newHabit],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await habitService.deleteHabit(id);
      set(state => ({
        habits: state.habits.filter(h => h.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  logHabit: async (habitId, status, date, value) => {
    try {
      const log = await habitService.logHabit(habitId, status, date, value);
      const habit = get().habits.find(h => h.id === habitId);
      
      if (status === HabitStatus.DONE && habit) {
        await activityService.logActivity(
          'HABIT_COMPLETED', 
          'Habit', 
          habitId, 
          ` Ritual Complete: ${habit.title}`,
          { is_good: habit.is_good }
        );
      }

      set(state => ({
        todayLogs: { ...state.todayLogs, [habitId]: log }
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
