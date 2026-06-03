import { Habit, HabitLog, HabitStatus } from '../../../core/types';
import { habitRepository } from '../repositories/habitRepository';
import { activityService } from '../../../core/services/activityService';

/**
 * HabitService coordinates business logic for habits.
 */
export const habitService = {
  async getAllHabits(): Promise<Habit[]> {
    return habitRepository.getHabits().filter(h => !h.deleted_at);
  },

  async createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'visibility'>): Promise<Habit> {
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substring(2, 11),
      user_id: 'guest',
      visibility: 'private',
      created_at: new Date().toISOString()
    };

    habitRepository.addHabit(newHabit);
    
    await activityService.logActivity(
      'CUSTOM',
      'Habit',
      newHabit.id,
      `Started new habit: ${newHabit.title}`
    );
    
    return newHabit;
  },

  async deleteHabit(id: string): Promise<void> {
    habitRepository.softDeleteHabit(id);
  },

  async logHabit(habitId: string, status: HabitStatus, date: string, value?: number): Promise<HabitLog> {
    const habit = habitRepository.getHabitById(habitId);
    if (!habit) throw new Error('Habit not found');

    const log: HabitLog = {
      id: Math.random().toString(36).substring(2, 11),
      habit_id: habitId,
      status,
      value,
      date
    };

    habitRepository.addOrUpdateLog(log);

    if (status === HabitStatus.DONE) {
      await activityService.logActivity(
        'HABIT_COMPLETED',
        'HabitLog',
        log.id,
        `Maintained consistency: ${habit.title}`
      );
    }

    return log;
  },

  async getLogsForHabit(habitId: string): Promise<HabitLog[]> {
    return habitRepository.getLogsByHabitId(habitId);
  },

  async getTodayLogs(): Promise<HabitLog[]> {
    const today = new Date().toISOString().split('T')[0];
    return habitRepository.getLogs().filter(l => l.date === today);
  }
};
