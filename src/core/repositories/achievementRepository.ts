import { Achievement } from "../types";

let unlockedAchievements: Achievement[] = [];

// This will eventually be Firestore, but using memory for now as per project pattern
// until the user asks for full persistence or until I see Firestore setup in metadata.json
export const achievementRepository = {
  getUnlocked(): Achievement[] {
    return unlockedAchievements;
  },

  unlock(achievement: Achievement): void {
    if (!unlockedAchievements.find(a => a.id === achievement.id)) {
      unlockedAchievements.push(achievement);
    }
  },

  setAchievements(achievements: Achievement[]): void {
    unlockedAchievements = achievements;
  }
};
