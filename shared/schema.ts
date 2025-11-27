import { z } from "zod";

// Quiz question schema
export const quizItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  fact: z.string(),
  question: z.string(),
  questionType: z.enum(["multiple-choice", "true-false", "sound-id", "image-match"]).default("multiple-choice"),
  options: z.array(z.string()),
  answer: z.string(),
  media: z.object({
    image: z.string().optional(),
    video: z.string().optional(),
    sound: z.string().optional(),
  }).optional(),
});

export type QuizItem = z.infer<typeof quizItemSchema>;

// Pack metadata schema
export const packSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  unlockCost: z.number().default(0),
  items: z.array(quizItemSchema),
});

export type Pack = z.infer<typeof packSchema>;

// Answered question with timing data
export const answeredQuestionSchema = z.object({
  id: z.string(),
  packId: z.string().optional(),
  correct: z.boolean(),
  timeSpent: z.number().optional(), // milliseconds
  answeredAt: z.string().optional(), // ISO date string
});

export type AnsweredQuestion = z.infer<typeof answeredQuestionSchema>;

// Pack statistics
export const packStatsSchema = z.object({
  packId: z.string(),
  timesCompleted: z.number().default(0),
  bestScore: z.number().default(0),
  bestTime: z.number().optional(), // milliseconds for timed mode
  totalCorrect: z.number().default(0),
  totalAnswered: z.number().default(0),
  lastPlayedAt: z.string().optional(), // ISO date string
});

export type PackStats = z.infer<typeof packStatsSchema>;

// Daily challenge record
export const dailyChallengeSchema = z.object({
  date: z.string(), // ISO date string (YYYY-MM-DD)
  packId: z.string(),
  questionIds: z.array(z.string()),
  completed: z.boolean().default(false),
  score: z.number().optional(),
  timeSpent: z.number().optional(),
});

export type DailyChallenge = z.infer<typeof dailyChallengeSchema>;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5500,   // Level 8
  8000,   // Level 9
  12000,  // Level 10
  17000,  // Level 11
  23000,  // Level 12
  30000,  // Level 13
  40000,  // Level 14
  50000,  // Level 15 (Animal Master)
];

export const LEVEL_NAMES = [
  "Curious Cub",
  "Eager Explorer",
  "Wildlife Watcher",
  "Nature Novice",
  "Animal Apprentice",
  "Safari Seeker",
  "Creature Connoisseur",
  "Beast Expert",
  "Wildlife Wizard",
  "Nature Navigator",
  "Animal Ace",
  "Fauna Fanatic",
  "Creature Champion",
  "Wildlife Warrior",
  "Animal Master",
];

// User progress/state schema for local storage
export const userProgressSchema = z.object({
  // Core progression
  coins: z.number().default(10),
  xp: z.number().default(0),
  level: z.number().default(1),
  
  // Current session state
  currentPackId: z.string().optional(),
  currentQuestionIndex: z.number().default(0),
  score: z.number().default(0),
  sessionStartTime: z.number().optional(), // timestamp for timed mode
  timedMode: z.boolean().default(false),
  
  // Question history
  answeredQuestions: z.array(answeredQuestionSchema).default([]),
  completedPacks: z.array(z.string()).default([]),
  
  // Badges and achievements
  badges: z.array(z.string()).default([]),
  
  // Streak system
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  lastPlayedDate: z.string().optional(), // ISO date string (YYYY-MM-DD)
  
  // Daily challenge
  dailyChallengeHistory: z.array(dailyChallengeSchema).default([]),
  
  // Per-pack statistics
  packStats: z.array(packStatsSchema).default([]),
  
  // Favorites
  favoriteAnimals: z.array(z.string()).default([]), // question IDs
  
  // Wrong answers for review mode
  wrongAnswers: z.array(z.object({
    questionId: z.string(),
    packId: z.string(),
    wrongAnswer: z.string(),
    correctAnswer: z.string(),
    answeredAt: z.string(),
  })).default([]),
  
  // Unlocked content
  unlockedThemes: z.array(z.string()).default(["forest"]), // default theme unlocked
  unlockedPacks: z.array(z.string()).default(["mammals", "birds", "reptiles", "fish", "amphibians", "insects"]),
  
  // Lifetime statistics (never reset)
  lifetimeStats: z.object({
    totalQuestionsAnswered: z.number().default(0),
    totalCorrectAnswers: z.number().default(0),
    totalScore: z.number().default(0),
    totalXpEarned: z.number().default(0),
    totalCoinsEarned: z.number().default(0),
    totalTimePlayed: z.number().default(0), // milliseconds
    fastestCorrectAnswer: z.number().optional(), // milliseconds
    perfectGames: z.number().default(0),
    dailyChallengesCompleted: z.number().default(0),
  }).default({
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    totalScore: 0,
    totalXpEarned: 0,
    totalCoinsEarned: 0,
    totalTimePlayed: 0,
    perfectGames: 0,
    dailyChallengesCompleted: 0,
  }),
  
  // Timestamps
  createdAt: z.string().optional(), // ISO date string
  lastUpdatedAt: z.string().optional(), // ISO date string
});

export type UserProgress = z.infer<typeof userProgressSchema>;

// Badge definition schema
export const badgeDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(), // emoji or icon name
  category: z.enum(["progress", "streak", "speed", "mastery", "special"]),
  requirement: z.object({
    type: z.string(),
    value: z.number(),
  }),
  reward: z.object({
    coins: z.number().default(0),
    xp: z.number().default(0),
  }).optional(),
});

export type BadgeDefinition = z.infer<typeof badgeDefinitionSchema>;

// Badge schema (for display)
export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  unlocked: z.boolean(),
});

export type Badge = z.infer<typeof badgeSchema>;

// Player schema for multiplayer mode
export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().default(0),
  correctAnswers: z.number().default(0),
  answeredQuestions: z.array(z.object({
    id: z.string(),
    correct: z.boolean(),
  })).default([]),
});

export type Player = z.infer<typeof playerSchema>;

// Game mode schema
export const gameModeSchema = z.enum(["single", "multiplayer", "timed", "daily-challenge", "review"]);
export type GameMode = z.infer<typeof gameModeSchema>;

// Multiplayer game state
export const multiplayerStateSchema = z.object({
  players: z.array(playerSchema),
  currentPlayerIndex: z.number().default(0),
  gameMode: gameModeSchema.default("single"),
});

export type MultiplayerState = z.infer<typeof multiplayerStateSchema>;

// Leaderboard entry schema
export const leaderboardEntrySchema = z.object({
  id: z.string(),
  playerName: z.string(),
  score: z.number(),
  packId: z.string().optional(),
  gameMode: z.string(),
  completedAt: z.string(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

// Theme definition
export const themeDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  unlockCost: z.number().default(0),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
});

export type ThemeDefinition = z.infer<typeof themeDefinitionSchema>;

// Helper function to calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Helper function to get XP needed for next level
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

// Helper function to get level name
export function getLevelName(level: number): string {
  const index = Math.min(level - 1, LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[index];
}

// Helper function to get today's date string
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper function to check if date is today
export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

// Helper function to check if date was yesterday
export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
}
