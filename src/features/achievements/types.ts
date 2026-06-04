import { ActivityEventType } from "../../core/types";

export enum AchievementKey {
  FIRST_GOAL = 'FIRST_GOAL',
  FIRST_HABIT = 'FIRST_HABIT',
  FIRST_JOURNAL = 'FIRST_JOURNAL',
  SEVEN_DAY_STREAK = 'SEVEN_DAY_STREAK',
  THIRTY_DAY_STREAK = 'THIRTY_DAY_STREAK',
  GOAL_MASTER = 'GOAL_MASTER',
  CONSISTENCY_MASTER = 'CONSISTENCY_MASTER',
  GROWTH_MASTER = 'GROWTH_MASTER',
  FIRST_TRADE = 'FIRST_TRADE',
  WINNING_STREAK = 'WINNING_STREAK',
  TRADE_MASTER = 'TRADE_MASTER',
}

export interface AchievementDefinition {
  key: AchievementKey;
  icon: string;
  points: number;
  category: 'GOAL' | 'HABIT' | 'CONSISTENCY' | 'MILESTONE' | 'TRADING';
}

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementKey, AchievementDefinition> = {
  [AchievementKey.FIRST_GOAL]: { key: AchievementKey.FIRST_GOAL, icon: '🎯', points: 100, category: 'GOAL' },
  [AchievementKey.FIRST_HABIT]: { key: AchievementKey.FIRST_HABIT, icon: '🔥', points: 50, category: 'HABIT' },
  [AchievementKey.FIRST_JOURNAL]: { key: AchievementKey.FIRST_JOURNAL, icon: '📖', points: 50, category: 'CONSISTENCY' },
  [AchievementKey.SEVEN_DAY_STREAK]: { key: AchievementKey.SEVEN_DAY_STREAK, icon: '⚡', points: 250, category: 'CONSISTENCY' },
  [AchievementKey.THIRTY_DAY_STREAK]: { key: AchievementKey.THIRTY_DAY_STREAK, icon: '💎', points: 1000, category: 'CONSISTENCY' },
  [AchievementKey.GOAL_MASTER]: { key: AchievementKey.GOAL_MASTER, icon: '👑', points: 500, category: 'GOAL' },
  [AchievementKey.CONSISTENCY_MASTER]: { key: AchievementKey.CONSISTENCY_MASTER, icon: '🧬', points: 750, category: 'CONSISTENCY' },
  [AchievementKey.GROWTH_MASTER]: { key: AchievementKey.GROWTH_MASTER, icon: '🚀', points: 2000, category: 'CONSISTENCY' },
  [AchievementKey.FIRST_TRADE]: { key: AchievementKey.FIRST_TRADE, icon: '📊', points: 100, category: 'TRADING' },
  [AchievementKey.WINNING_STREAK]: { key: AchievementKey.WINNING_STREAK, icon: '💰', points: 500, category: 'TRADING' },
  [AchievementKey.TRADE_MASTER]: { key: AchievementKey.TRADE_MASTER, icon: '⚓', points: 1000, category: 'TRADING' },
};
