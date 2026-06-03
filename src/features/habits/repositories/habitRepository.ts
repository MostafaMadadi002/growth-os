import { Habit, HabitLog, HabitStatus } from '../../../core/types';

/**
 * HabitRepository handles direct data persistence for habits and their logs.
 */
export const habitRepository = {
  getHabits: (): Habit[] => {
    return JSON.parse(localStorage.getItem('habits') || '[]');
  },

  saveHabits: (habits: Habit[]): void => {
    localStorage.setItem('habits', JSON.stringify(habits));
  },

  getHabitById: (id: string): Habit | undefined => {
    const habits = habitRepository.getHabits();
    return habits.find(h => h.id === id);
  },

  addHabit: (habit: Habit): void => {
    const habits = habitRepository.getHabits();
    habitRepository.saveHabits([...habits, habit]);
  },

  updateHabit: (id: string, updates: Partial<Habit>): Habit | undefined => {
    const habits = habitRepository.getHabits();
    const idx = habits.findIndex(h => h.id === id);
    if (idx !== -1) {
      habits[idx] = { ...habits[idx], ...updates };
      habitRepository.saveHabits(habits);
      return habits[idx];
    }
    return undefined;
  },

  softDeleteHabit: (id: string): void => {
    habitRepository.updateHabit(id, { deleted_at: new Date().toISOString() });
  },

  // Logs Persistence
  getLogs: (): HabitLog[] => {
    return JSON.parse(localStorage.getItem('habit_logs') || '[]');
  },

  saveLogs: (logs: HabitLog[]): void => {
    localStorage.setItem('habit_logs', JSON.stringify(logs));
  },

  getLogsByHabitId: (habitId: string): HabitLog[] => {
    return habitRepository.getLogs().filter(log => log.habit_id === habitId);
  },

  addOrUpdateLog: (log: HabitLog): void => {
    const logs = habitRepository.getLogs();
    const existingIdx = logs.findIndex(l => l.habit_id === log.habit_id && l.date === log.date);
    
    if (existingIdx !== -1) {
      logs[existingIdx] = log;
    } else {
      logs.push(log);
    }
    
    habitRepository.saveLogs(logs);
  }
};
