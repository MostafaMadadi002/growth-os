import { achievementRepository } from "../repositories/achievementRepository";
import { Achievement, ActivityRecord } from "../types";
import { AchievementKey, ACHIEVEMENT_DEFINITIONS } from "../../features/achievements/types";

export const achievementService = {
  async getUnlocked(): Promise<Achievement[]> {
    return achievementRepository.getUnlocked();
  },

  async checkAchievements(activities: ActivityRecord[]): Promise<Achievement[]> {
    const unlocked = achievementRepository.getUnlocked();
    const newUnlocks: Achievement[] = [];

    // Helper to check if already unlocked
    const isUnlocked = (key: AchievementKey) => unlocked.some(a => a.id === key);

    // 1. FIRST_GOAL
    if (!isUnlocked(AchievementKey.FIRST_GOAL)) {
      if (activities.some(a => a.event_type === 'GOAL_COMPLETED')) {
        newUnlocks.push(this.createAchievement(AchievementKey.FIRST_GOAL));
      }
    }

    // 2. FIRST_HABIT
    if (!isUnlocked(AchievementKey.FIRST_HABIT)) {
      if (activities.some(a => a.event_type === 'HABIT_COMPLETED')) {
        newUnlocks.push(this.createAchievement(AchievementKey.FIRST_HABIT));
      }
    }

    // 3. FIRST_JOURNAL
    if (!isUnlocked(AchievementKey.FIRST_JOURNAL)) {
      if (activities.some(a => a.event_type === 'JOURNAL_CREATED')) {
        newUnlocks.push(this.createAchievement(AchievementKey.FIRST_JOURNAL));
      }
    }

    // 4. SEVEN_DAY_STREAK
    if (!isUnlocked(AchievementKey.SEVEN_DAY_STREAK)) {
      if (this.checkStreak(activities, 7)) {
        newUnlocks.push(this.createAchievement(AchievementKey.SEVEN_DAY_STREAK));
      }
    }

    // 5. THIRTY_DAY_STREAK
    if (!isUnlocked(AchievementKey.THIRTY_DAY_STREAK)) {
      if (this.checkStreak(activities, 30)) {
        newUnlocks.push(this.createAchievement(AchievementKey.THIRTY_DAY_STREAK));
      }
    }

    // 6. GOAL_MASTER
    if (!isUnlocked(AchievementKey.GOAL_MASTER)) {
      const goalCount = activities.filter(a => a.event_type === 'GOAL_COMPLETED').length;
      if (goalCount >= 10) {
        newUnlocks.push(this.createAchievement(AchievementKey.GOAL_MASTER));
      }
    }

    // 7. GROWTH_MASTER
    if (!isUnlocked(AchievementKey.GROWTH_MASTER)) {
      const totalPoints = activities.reduce((sum, a) => sum + a.points_earned, 0);
      if (totalPoints >= 5000) {
        newUnlocks.push(this.createAchievement(AchievementKey.GROWTH_MASTER));
      }
    }

    // Persist new unlocks
    newUnlocks.forEach(a => achievementRepository.unlock(a));

    return newUnlocks;
  },

  createAchievement(key: AchievementKey): Achievement {
    const def = ACHIEVEMENT_DEFINITIONS[key];
    return {
      id: key,
      user_id: 'system', // Default to system for now
      title: def.key, // Using key for i18n
      description: `${def.key}_DESC`, // Using key for i18n
      category: def.category,
      points_value: def.points,
      type: 'SYSTEM',
      unlocked_at: new Date().toISOString(),
      icon_name: def.icon
    };
  },

  checkStreak(activities: ActivityRecord[], days: number): boolean {
    const dates = new Set(activities.map(a => a.date));
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        if (dates.has(dStr)) {
            streak++;
        } else {
            break;
        }
    }
    return streak >= days;
  }
};
