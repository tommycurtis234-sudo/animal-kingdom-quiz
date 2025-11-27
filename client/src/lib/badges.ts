import type { BadgeDefinition, UserProgress, Pack } from "@shared/schema";

// All available badges with their requirements
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Progress badges
  {
    id: "first-quiz",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "🎯",
    category: "progress",
    requirement: { type: "completedPacks", value: 1 },
    reward: { coins: 5, xp: 50 },
  },
  {
    id: "pack-master",
    name: "Pack Master",
    description: "Complete all 6 animal packs",
    icon: "🏆",
    category: "progress",
    requirement: { type: "completedPacks", value: 6 },
    reward: { coins: 50, xp: 500 },
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Answer 100 questions correctly",
    icon: "💯",
    category: "progress",
    requirement: { type: "correctAnswers", value: 100 },
    reward: { coins: 25, xp: 250 },
  },
  {
    id: "quiz-marathon",
    name: "Quiz Marathon",
    description: "Answer 500 questions total",
    icon: "🏃",
    category: "progress",
    requirement: { type: "totalAnswered", value: 500 },
    reward: { coins: 50, xp: 500 },
  },
  
  // Streak badges
  {
    id: "streak-3",
    name: "Getting Started",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    category: "streak",
    requirement: { type: "streak", value: 3 },
    reward: { coins: 10, xp: 100 },
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    category: "streak",
    requirement: { type: "streak", value: 7 },
    reward: { coins: 25, xp: 250 },
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    category: "streak",
    requirement: { type: "streak", value: 30 },
    reward: { coins: 100, xp: 1000 },
  },
  {
    id: "streak-100",
    name: "Legendary Learner",
    description: "Maintain a 100-day streak",
    icon: "👑",
    category: "streak",
    requirement: { type: "streak", value: 100 },
    reward: { coins: 500, xp: 5000 },
  },
  
  // Speed badges
  {
    id: "speedster",
    name: "Speedster",
    description: "Complete a timed quiz in under 60 seconds",
    icon: "⚡",
    category: "speed",
    requirement: { type: "timedQuizUnder", value: 60000 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "lightning-fast",
    name: "Lightning Fast",
    description: "Answer a question correctly in under 3 seconds",
    icon: "💨",
    category: "speed",
    requirement: { type: "fastAnswer", value: 3000 },
    reward: { coins: 10, xp: 100 },
  },
  
  // Mastery badges
  {
    id: "perfect-pack",
    name: "Perfect Pack",
    description: "Complete a pack with 100% accuracy",
    icon: "✨",
    category: "mastery",
    requirement: { type: "perfectPack", value: 1 },
    reward: { coins: 20, xp: 200 },
  },
  {
    id: "mammal-expert",
    name: "Mammal Expert",
    description: "Complete the Mammals pack 3 times",
    icon: "🦁",
    category: "mastery",
    requirement: { type: "packCompletions_mammals", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "bird-watcher",
    name: "Bird Watcher",
    description: "Complete the Birds pack 3 times",
    icon: "🦅",
    category: "mastery",
    requirement: { type: "packCompletions_birds", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "reptile-ranger",
    name: "Reptile Ranger",
    description: "Complete the Reptiles pack 3 times",
    icon: "🦎",
    category: "mastery",
    requirement: { type: "packCompletions_reptiles", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "fish-finder",
    name: "Fish Finder",
    description: "Complete the Fish pack 3 times",
    icon: "🐠",
    category: "mastery",
    requirement: { type: "packCompletions_fish", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "amphibian-ace",
    name: "Amphibian Ace",
    description: "Complete the Amphibians pack 3 times",
    icon: "🐸",
    category: "mastery",
    requirement: { type: "packCompletions_amphibians", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  {
    id: "insect-investigator",
    name: "Insect Investigator",
    description: "Complete the Insects pack 3 times",
    icon: "🦋",
    category: "mastery",
    requirement: { type: "packCompletions_insects", value: 3 },
    reward: { coins: 15, xp: 150 },
  },
  
  // Special badges
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Play a quiz between midnight and 5 AM",
    icon: "🦉",
    category: "special",
    requirement: { type: "nightPlay", value: 1 },
    reward: { coins: 10, xp: 100 },
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Play a quiz between 5 AM and 7 AM",
    icon: "🐦",
    category: "special",
    requirement: { type: "earlyPlay", value: 1 },
    reward: { coins: 10, xp: 100 },
  },
  {
    id: "daily-devotee",
    name: "Daily Devotee",
    description: "Complete 10 daily challenges",
    icon: "📅",
    category: "special",
    requirement: { type: "dailyChallenges", value: 10 },
    reward: { coins: 30, xp: 300 },
  },
  {
    id: "coin-collector",
    name: "Coin Collector",
    description: "Earn 100 coins total",
    icon: "💰",
    category: "special",
    requirement: { type: "totalCoins", value: 100 },
    reward: { coins: 20, xp: 200 },
  },
  {
    id: "level-10",
    name: "Rising Star",
    description: "Reach level 10",
    icon: "⭐",
    category: "special",
    requirement: { type: "level", value: 10 },
    reward: { coins: 50, xp: 0 },
  },
  {
    id: "level-15",
    name: "Animal Master",
    description: "Reach level 15 (max level)",
    icon: "🎖️",
    category: "special",
    requirement: { type: "level", value: 15 },
    reward: { coins: 200, xp: 0 },
  },
];

// Check if a badge requirement is met
export function checkBadgeRequirement(
  badge: BadgeDefinition,
  progress: UserProgress,
  currentPack?: Pack | null,
  sessionData?: {
    perfectPack?: boolean;
    timedQuizTime?: number;
    fastestAnswer?: number;
  }
): boolean {
  const { type, value } = badge.requirement;
  
  switch (type) {
    case "completedPacks":
      return progress.completedPacks.length >= value;
      
    case "correctAnswers":
      return progress.lifetimeStats.totalCorrectAnswers >= value;
      
    case "totalAnswered":
      return progress.lifetimeStats.totalQuestionsAnswered >= value;
      
    case "streak":
      return progress.currentStreak >= value || progress.longestStreak >= value;
      
    case "perfectPack":
      return sessionData?.perfectPack === true;
      
    case "timedQuizUnder":
      return sessionData?.timedQuizTime !== undefined && sessionData.timedQuizTime < value;
      
    case "fastAnswer":
      return sessionData?.fastestAnswer !== undefined && sessionData.fastestAnswer < value;
      
    case "nightPlay": {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 5;
    }
    
    case "earlyPlay": {
      const hour = new Date().getHours();
      return hour >= 5 && hour < 7;
    }
    
    case "dailyChallenges":
      return progress.lifetimeStats.dailyChallengesCompleted >= value;
      
    case "totalCoins":
      return progress.lifetimeStats.totalCoinsEarned >= value;
      
    case "level":
      return progress.level >= value;
      
    default:
      // Handle pack completion badges
      if (type.startsWith("packCompletions_")) {
        const packId = type.replace("packCompletions_", "");
        const packStats = progress.packStats.find(p => p.packId === packId);
        return (packStats?.timesCompleted ?? 0) >= value;
      }
      return false;
  }
}

// Get all badges that should be awarded
export function getNewBadges(
  progress: UserProgress,
  currentPack?: Pack | null,
  sessionData?: {
    perfectPack?: boolean;
    timedQuizTime?: number;
    fastestAnswer?: number;
  }
): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(badge => {
    // Skip already earned badges
    if (progress.badges.includes(badge.id)) {
      return false;
    }
    // Check if requirement is met
    return checkBadgeRequirement(badge, progress, currentPack, sessionData);
  });
}

// Get badge definition by ID
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
}

// Get all badges for display (with unlock status)
export function getAllBadgesWithStatus(unlockedBadgeIds: string[]) {
  return BADGE_DEFINITIONS.map(badge => ({
    ...badge,
    unlocked: unlockedBadgeIds.includes(badge.id),
  }));
}

// Get badges by category
export function getBadgesByCategory(category: BadgeDefinition["category"]) {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
}

// Calculate total rewards for a set of badges
export function calculateBadgeRewards(badgeIds: string[]) {
  return badgeIds.reduce(
    (total, id) => {
      const badge = getBadgeById(id);
      if (badge?.reward) {
        return {
          coins: total.coins + (badge.reward.coins || 0),
          xp: total.xp + (badge.reward.xp || 0),
        };
      }
      return total;
    },
    { coins: 0, xp: 0 }
  );
}
