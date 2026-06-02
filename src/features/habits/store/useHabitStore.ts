import { create } from 'zustand';
import { Habit, HabitLog, HabitStatus } from '../../../core/types';
import { habitService } from '../services/habitService';

interface HabitState {
  habits: Habit[];
  logs: Record<string, HabitLog[]>; // date -> logs
  isLoading: boolean;
  fetchHabits: () => Promise<void>;
  fetchLogs: (date: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  logHabit: (habitId: string, status: HabitStatus, date: string, value?: number) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  logs: {},
  isLoading: false,

  fetchHabits: async () => {
    set({ isLoading: true });
    const habits = await habitService.getAllHabits();
    set({ habits, isLoading: false });
  },

  fetchLogs: async (date) => {
    const dayLogs = await habitService.getLogs(date);
    set({ logs: { ...get().logs, [date]: dayLogs } });
  },

  addHabit: async (habit) => {
    const newHabit = await habitService.createHabit(habit);
    set({ habits: [...get().habits, newHabit] });
  },

  logHabit: async (habitId, status, date, value) => {
    const newLog = await habitService.logHabit(habitId, status, date, value);
    const dayLogs = get().logs[date] || [];
    const updatedDayLogs = dayLogs.filter(l => l.habit_id !== habitId).concat(newLog);
    set({ logs: { ...get().logs, [date]: updatedDayLogs } });
  },

  removeHabit: async (id) => {
    await habitService.deleteHabit(id);
    set({ habits: get().habits.filter(h => h.id !== id) });
  }
}));
