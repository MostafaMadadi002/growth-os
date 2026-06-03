import { ActivityRecord } from '../types';

/**
 * ActivityRepository handles persistence for activity records.
 */
export const activityRepository = {
  getActivities: (): ActivityRecord[] => {
    return JSON.parse(localStorage.getItem('activity_records') || '[]');
  },

  saveActivities: (activities: ActivityRecord[]): void => {
    localStorage.setItem('activity_records', JSON.stringify(activities));
  },

  addActivity: (record: ActivityRecord): void => {
    const activities = activityRepository.getActivities();
    activityRepository.saveActivities([record, ...activities]);
  },

  getActivitiesByUserId: (userId: string): ActivityRecord[] => {
    return activityRepository.getActivities().filter(a => a.user_id === userId);
  }
};
