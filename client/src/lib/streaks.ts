import { getTodayDateString, isYesterday, isToday } from "@shared/schema";
import type { UserProgress } from "@shared/schema";

// Update streak when user plays
export function updateStreak(progress: UserProgress): {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  streakBroken: boolean;
  isNewDay: boolean;
} {
  const today = getTodayDateString();
  const lastPlayed = progress.lastPlayedDate;
  
  // First time playing
  if (!lastPlayed) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, progress.longestStreak),
      lastPlayedDate: today,
      streakBroken: false,
      isNewDay: true,
    };
  }
  
  // Already played today
  if (isToday(lastPlayed)) {
    return {
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastPlayedDate: lastPlayed,
      streakBroken: false,
      isNewDay: false,
    };
  }
  
  // Played yesterday - streak continues
  if (isYesterday(lastPlayed)) {
    const newStreak = progress.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastPlayedDate: today,
      streakBroken: false,
      isNewDay: true,
    };
  }
  
  // Streak broken - more than one day gap
  return {
    currentStreak: 1,
    longestStreak: progress.longestStreak,
    lastPlayedDate: today,
    streakBroken: progress.currentStreak > 0,
    isNewDay: true,
  };
}

// Calculate streak bonus coins
export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 10;
  if (streak >= 14) return 7;
  if (streak >= 7) return 5;
  if (streak >= 3) return 3;
  return 0;
}

// Get streak milestone message
export function getStreakMessage(streak: number): string | null {
  if (streak === 3) return "3-day streak! +3 bonus coins";
  if (streak === 7) return "1-week streak! +5 bonus coins";
  if (streak === 14) return "2-week streak! +7 bonus coins";
  if (streak === 30) return "30-day streak! +10 bonus coins";
  if (streak === 50) return "50-day streak! Amazing dedication!";
  if (streak === 100) return "100-day streak! You're legendary!";
  if (streak === 365) return "1-year streak! Incredible!";
  return null;
}

// Check if streak is at risk (last played was yesterday)
export function isStreakAtRisk(progress: UserProgress): boolean {
  if (!progress.lastPlayedDate) return false;
  return isYesterday(progress.lastPlayedDate);
}

// Get days until streak breaks
export function getDaysUntilStreakBreaks(progress: UserProgress): number {
  if (!progress.lastPlayedDate) return 0;
  
  const lastPlayed = new Date(progress.lastPlayedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastPlayed.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastPlayed.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If played today, streak is safe for today
  if (diffDays === 0) return 1;
  // If played yesterday, need to play today
  if (diffDays === 1) return 0;
  // Streak already broken
  return -1;
}
