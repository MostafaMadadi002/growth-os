import { Habit, HabitLog, HabitStatus } from '../../../core/types';
import { habitRepository } from '../repositories/habitRepository';
import { activityService } from '../../../core/services/activityService';
import { supabase } from '../../../core/services/supabase';
import { useAuthStore } from '../../../core/stores/authStore';

/**
 * HabitService coordinates business logic for habits.
 */
export const habitService = {
  async getAllHabits(): Promise<Habit[]> {
    const { user } = useAuthStore.getState();
    if (user) {
      const { data, error } = await supabase.from('habits').select('*').eq('user_id', user.id).is('deleted_at', null);
      if (!error && data) {
        habitRepository.saveHabits(data);
        return data;
      }
    }
    return habitRepository.getHabits().filter(h => !h.deleted_at);
  },

  async createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'visibility'>): Promise<Habit> {
    const { user } = useAuthStore.getState();
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substring(2, 11),
      user_id: user?.id || 'guest',
      visibility: 'private',
      created_at: new Date().toISOString()
    };

    habitRepository.addHabit(newHabit);
    
    if (user) {
      await supabase.from('habits').insert([newHabit]);
    }

    await activityService.logActivity(
      'CUSTOM',
      'Habit',
      newHabit.id,
      `Started new habit: ${newHabit.title}`
    );
    
    return newHabit;
  },

  async deleteHabit(id: string): Promise<void> {
    const { user } = useAuthStore.getState();
    habitRepository.softDeleteHabit(id);
    if (user) {
      await supabase.from('habits').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    }
  },

  async logHabit(habitId: string, status: HabitStatus, date: string, value?: number): Promise<HabitLog> {
    const { user } = useAuthStore.getState();
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

    if (user) {
      await supabase.from('habit_logs').upsert([log]);
    }

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
  },

  async getLogsForRange(days: number): Promise<HabitLog[]> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    return habitRepository.getLogs().filter(l => {
      const logDate = new Date(l.date);
      return logDate >= startDate && logDate <= today;
    });
  }
};
