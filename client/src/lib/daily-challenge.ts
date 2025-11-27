import { getTodayDateString } from "@shared/schema";
import type { UserProgress, Pack, DailyChallenge, QuizItem } from "@shared/schema";

// Generate a seeded random number based on date
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Convert date string to seed number
function dateToSeed(dateStr: string): number {
  const parts = dateStr.split('-').map(Number);
  return parts[0] * 10000 + parts[1] * 100 + parts[2];
}

// Generate daily challenge for today
export function generateDailyChallenge(packs: Pack[]): DailyChallenge {
  const today = getTodayDateString();
  const seed = dateToSeed(today);
  
  // Select a random pack based on seed
  const packIndex = Math.floor(seededRandom(seed) * packs.length);
  const selectedPack = packs[packIndex];
  
  // Select 5 random questions from the pack
  const numQuestions = Math.min(5, selectedPack.items.length);
  const shuffledIndices = selectedPack.items
    .map((_, i) => i)
    .sort((a, b) => seededRandom(seed + a) - seededRandom(seed + b));
  
  const questionIds = shuffledIndices
    .slice(0, numQuestions)
    .map(i => selectedPack.items[i].id);
  
  return {
    date: today,
    packId: selectedPack.id,
    questionIds,
    completed: false,
  };
}

// Get today's daily challenge (or generate if not exists)
export function getTodayChallenge(
  progress: UserProgress,
  packs: Pack[]
): DailyChallenge {
  const today = getTodayDateString();
  
  // Check if we already have today's challenge
  const existingChallenge = progress.dailyChallengeHistory.find(
    c => c.date === today
  );
  
  if (existingChallenge) {
    return existingChallenge;
  }
  
  // Generate new challenge for today
  return generateDailyChallenge(packs);
}

// Check if daily challenge is completed for today
export function isDailyChallengeCompletedToday(progress: UserProgress): boolean {
  const today = getTodayDateString();
  return progress.dailyChallengeHistory.some(
    c => c.date === today && c.completed
  );
}

// Get daily challenge questions from pack
export function getDailyChallengeQuestions(
  challenge: DailyChallenge,
  packs: Pack[]
): QuizItem[] {
  const pack = packs.find(p => p.id === challenge.packId);
  if (!pack) return [];
  
  return challenge.questionIds
    .map(id => pack.items.find(item => item.id === id))
    .filter((item): item is QuizItem => item !== undefined);
}

// Calculate daily challenge rewards - fixed rewards per spec
export function getDailyChallengeRewards(): { coins: number; xp: number } {
  // Always award exactly +50 XP and +10 coins for completing a daily challenge
  return { coins: 10, xp: 50 };
}

// Complete daily challenge and update progress
export function completeDailyChallenge(
  progress: UserProgress,
  challenge: DailyChallenge,
  score: number,
  timeSpent: number
): UserProgress {
  const completedChallenge: DailyChallenge = {
    ...challenge,
    completed: true,
    score,
    timeSpent,
  };
  
  // Remove any existing entry for today and add completed one
  const filteredHistory = progress.dailyChallengeHistory.filter(
    c => c.date !== challenge.date
  );
  
  return {
    ...progress,
    dailyChallengeHistory: [...filteredHistory, completedChallenge],
    lifetimeStats: {
      ...progress.lifetimeStats,
      dailyChallengesCompleted: progress.lifetimeStats.dailyChallengesCompleted + 1,
    },
  };
}

// Get daily challenge streak (consecutive days completed)
export function getDailyChallengeStreak(progress: UserProgress): number {
  const sortedHistory = [...progress.dailyChallengeHistory]
    .filter(c => c.completed)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (sortedHistory.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const challenge of sortedHistory) {
    const challengeDate = new Date(challenge.date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    // Check if this challenge is from the expected date
    if (challengeDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
