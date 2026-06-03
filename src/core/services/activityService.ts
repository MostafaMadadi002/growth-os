import { ActivityRecord, ActivityEventType } from '../types';
import { activityRepository } from '../repositories/activityRepository';
import { supabase } from './supabase';
import { useAuthStore } from '../stores/authStore';

export const POINT_RULES: Record<ActivityEventType, number> = {
  JOURNAL_CREATED: 10,
  HABIT_COMPLETED: 5,
  GOAL_COMPLETED: 100,
  MILESTONE_COMPLETED: 25,
  WORKOUT_LOGGED: 15,
  TRADE_REVIEWED: 20,
  CUSTOM: 1
};

/**
 * ActivityService is the core engine for logging actions and awarding points.
 */
export const activityService = {
  async logActivity(
    eventType: ActivityEventType,
    sourceType: string,
    sourceId: string,
    title: string,
    metadata?: Record<string, any>
  ): Promise<ActivityRecord> {
    const { user } = useAuthStore.getState();
    const points = POINT_RULES[eventType] || 0;
    
    const record: ActivityRecord = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: user?.id || 'guest',
      title,
      event_type: eventType,
      source_type: sourceType,
      source_id: sourceId,
      points_earned: points,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      metadata
    };

    activityRepository.addActivity(record);
    
    if (user) {
      await supabase.from('activity_records').insert([record]);
    }
    
    return record;
  },

  async getRecentActivities(): Promise<ActivityRecord[]> {
    const { user } = useAuthStore.getState();
    if (user) {
      const { data, error } = await supabase.from('activity_records').select('*').eq('user_id', user.id).limit(50).order('created_at', { ascending: false });
      if (!error && data) {
        activityRepository.saveActivities(data);
        return data;
      }
    }
    return activityRepository.getActivities().slice(0, 50);
  },

  async getPointsForToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const activities = activityRepository.getActivities();
    return activities
      .filter(a => a.date === today && !a.deleted_at)
      .reduce((sum, a) => sum + a.points_earned, 0);
  },

  async getPointsByDate(days: number): Promise<Record<string, number>> {
    const activities = activityRepository.getActivities();
    const result: Record<string, number> = {};
    
    // Initialize last 30 days
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result[dateStr] = 0;
    }

    activities.forEach(a => {
      if (result[a.date] !== undefined && !a.deleted_at) {
        result[a.date] += a.points_earned;
      }
    });

    return result;
  }
};
