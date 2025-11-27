import { useState, useEffect, useReducer, useCallback } from "react";
import { useLocation } from "wouter";
import { SplashScreen } from "@/components/splash-screen";
import { LandingPage } from "@/components/landing-page";
import { PackSelection } from "@/components/pack-selection";
import { PlayerSetup } from "@/components/player-setup";
import { QuizCard } from "@/components/quiz-card";
import { ResultsScreen } from "@/components/results-screen";
import { MultiplayerResults } from "@/components/multiplayer-results";
import { BadgeGallery } from "@/pages/badge-gallery";
import { CoinDisplay } from "@/components/coin-display";
import { ThemeSelector } from "@/components/theme-selector";
import { DifficultySelector } from "@/components/difficulty-selector";
import { AudioControls } from "@/components/audio-controls";
import { ServiceWorkerUpdateBanner } from "@/components/service-worker-update-banner";
import { StreakDisplay } from "@/components/streak-display";
import { LevelDisplay } from "@/components/level-display";
import { DailyChallengeCard } from "@/components/daily-challenge-card";
import { StatsDashboard } from "@/components/stats-dashboard";
import { updateStreak, getStreakBonus, getStreakMessage } from "@/lib/streaks";
import { getTodayChallenge, isDailyChallengeCompletedToday, getDailyChallengeQuestions, getDailyChallengeRewards, completeDailyChallenge } from "@/lib/daily-challenge";
import { getNewBadges, calculateBadgeRewards } from "@/lib/badges";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import { TimedModeSelector } from "@/components/quiz-timer";
import { FavoritesGallery } from "@/components/favorites-gallery";
import { Shop } from "@/components/shop";
import { Confetti, CelebrationOverlay, CorrectAnswerBurst } from "@/components/confetti";
import { Leaderboard } from "@/components/leaderboard";
import { ShareableResults } from "@/components/shareable-results";
import { WeeklyQuests } from "@/components/weekly-quests";
import { StreakCelebration } from "@/components/streak-celebration";
import { FlashcardMode } from "@/components/flashcard-mode";
import { BarChart3, Heart, RefreshCw, ShoppingBag, Trophy, BookOpen, ArrowLeft } from "lucide-react";
import type { QuizItem, UserProgress, Pack, Player, GameMode, DailyChallenge } from "@shared/schema";
import { calculateLevel } from "@shared/schema";

// Timed mode settings
const DEFAULT_TIME_LIMIT = 15; // seconds per question

type GameState = "landing" | "splash" | "pack-selection" | "player-setup" | "quiz" | "results" | "badge-gallery" | "stats" | "daily-challenge" | "favorites" | "shop";

// Multiplayer state reducer for atomic updates
type MultiplayerState = {
  players: Player[];
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  shouldShowResults: boolean;
};

type MultiplayerAction =
  | { type: "RESET"; players: Player[] }
  | { type: "ANSWER"; playerIndex: number; questionId: string; isCorrect: boolean; points: number; totalQuestions: number }
  | { type: "CLEAR" };

function multiplayerReducer(state: MultiplayerState, action: MultiplayerAction): MultiplayerState {
  switch (action.type) {
    case "RESET":
      return {
        players: action.players,
        currentPlayerIndex: 0,
        currentQuestionIndex: 0,
        shouldShowResults: false,
      };

    case "ANSWER": {
      const { playerIndex, questionId, isCorrect, points, totalQuestions } = action;
      
      // Update player score
      const updatedPlayers = state.players.map((player, idx) =>
        idx === playerIndex
          ? {
              ...player,
              score: player.score + points,
              correctAnswers: player.correctAnswers + (isCorrect ? 1 : 0),
              answeredQuestions: [
                ...player.answeredQuestions,
                { id: questionId, correct: isCorrect },
              ],
            }
          : player
      );

      // Determine next state
      const isLastPlayer = playerIndex >= state.players.length - 1;
      const isLastQuestion = state.currentQuestionIndex >= totalQuestions - 1;

      console.log("[Multiplayer] ANSWER action:", {
        playerIndex,
        isLastPlayer,
        currentQuestionIndex: state.currentQuestionIndex,
        totalQuestions,
        isLastQuestion,
        willShowResults: isLastPlayer && isLastQuestion,
      });

      if (isLastPlayer && isLastQuestion) {
        // Quiz complete
        console.log("[Multiplayer] Quiz complete - setting shouldShowResults=true");
        return {
          ...state,
          players: updatedPlayers,
          shouldShowResults: true,
        };
      } else if (isLastPlayer) {
        // Next question, reset to first player
        console.log("[Multiplayer] Next question:", state.currentQuestionIndex + 1);
        return {
          ...state,
          players: updatedPlayers,
          currentPlayerIndex: 0,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };
      } else {
        // Next player
        console.log("[Multiplayer] Next player:", state.currentPlayerIndex + 1);
        return {
          ...state,
          players: updatedPlayers,
          currentPlayerIndex: state.currentPlayerIndex + 1,
        };
      }
    }

    case "CLEAR":
      return {
        players: [],
        currentPlayerIndex: 0,
        currentQuestionIndex: 0,
        shouldShowResults: false,
      };

    default:
      return state;
  }
}

// Global readiness hooks (per deployment guide)
declare global {
  interface Window {
    AKQ_packReady: (count: number) => void;
    AKQ_setReady: () => void;
  }
}

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { playCoinPickup, playBadgeEarned, playLevelComplete, playClick } = useAudio();

  // Game state
  const [gameState, setGameState] = useState<GameState>("landing");
  const [isPacksReady, setIsPacksReady] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [currentPack, setCurrentPack] = useState<Pack | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Game mode
  const [gameMode, setGameMode] = useState<GameMode>("single");
  
  // Timed mode settings
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  
  // Multiplayer state (atomic via reducer)
  const [multiplayerState, dispatchMultiplayer] = useReducer(multiplayerReducer, {
    players: [],
    currentPlayerIndex: 0,
    currentQuestionIndex: 0,
    shouldShowResults: false,
  });

  // User progress (for single player)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    coins: 10,
    xp: 0,
    level: 1,
    currentQuestionIndex: 0,
    score: 0,
    timedMode: false,
    answeredQuestions: [],
    completedPacks: [],
    badges: [],
    currentStreak: 0,
    longestStreak: 0,
    dailyChallengeHistory: [],
    packStats: [],
    favoriteAnimals: [],
    wrongAnswers: [],
    unlockedThemes: ["forest"],
    unlockedPacks: ["mammals", "birds", "reptiles", "fish", "amphibians", "insects"],
    lifetimeStats: {
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalScore: 0,
      totalXpEarned: 0,
      totalCoinsEarned: 0,
      totalTimePlayed: 0,
      perfectGames: 0,
      dailyChallengesCompleted: 0,
    },
  });

  // Celebration states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCorrectBurst, setShowCorrectBurst] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [streakMilestoneBonus, setStreakMilestoneBonus] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    type: "level-up" | "badge" | "perfect-score" | "streak";
    message: string;
    subMessage?: string;
  } | null>(null);

  // Load user progress from localStorage on mount (with migration for old data)
  useEffect(() => {
    const savedProgress = localStorage.getItem("animalQuizProgress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Migrate old progress data to new schema
        const migrated: UserProgress = {
          coins: parsed.coins ?? 10,
          xp: parsed.xp ?? 0,
          level: parsed.level ?? 1,
          currentPackId: parsed.currentPackId,
          currentQuestionIndex: parsed.currentQuestionIndex ?? 0,
          score: parsed.score ?? 0,
          timedMode: parsed.timedMode ?? false,
          answeredQuestions: parsed.answeredQuestions ?? [],
          completedPacks: parsed.completedPacks ?? [],
          badges: parsed.badges ?? [],
          currentStreak: parsed.currentStreak ?? 0,
          longestStreak: parsed.longestStreak ?? 0,
          lastPlayedDate: parsed.lastPlayedDate,
          dailyChallengeHistory: parsed.dailyChallengeHistory ?? [],
          packStats: parsed.packStats ?? [],
          favoriteAnimals: parsed.favoriteAnimals ?? [],
          wrongAnswers: parsed.wrongAnswers ?? [],
          unlockedThemes: parsed.unlockedThemes ?? ["forest"],
          unlockedPacks: parsed.unlockedPacks ?? ["mammals", "birds", "reptiles", "fish", "amphibians", "insects"],
          lifetimeStats: {
            totalQuestionsAnswered: parsed.lifetimeStats?.totalQuestionsAnswered ?? 0,
            totalCorrectAnswers: parsed.lifetimeStats?.totalCorrectAnswers ?? 0,
            totalScore: parsed.lifetimeStats?.totalScore ?? 0,
            totalXpEarned: parsed.lifetimeStats?.totalXpEarned ?? 0,
            totalCoinsEarned: parsed.lifetimeStats?.totalCoinsEarned ?? 0,
            totalTimePlayed: parsed.lifetimeStats?.totalTimePlayed ?? 0,
            perfectGames: parsed.lifetimeStats?.perfectGames ?? 0,
            dailyChallengesCompleted: parsed.lifetimeStats?.dailyChallengesCompleted ?? 0,
          },
          createdAt: parsed.createdAt,
          lastUpdatedAt: parsed.lastUpdatedAt,
        };
        setUserProgress(migrated);
      } catch (error) {
        console.error("Failed to load saved progress:", error);
      }
    }
  }, []);

  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("animalQuizProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Load packs on mount and restore state
  useEffect(() => {
    const initializeApp = async () => {
      await loadPacks();
    };

    initializeApp();

    // Setup readiness hooks
    const handleAkqReady = () => {
      setIsPacksReady(true);
    };

    window.AKQ_packReady = (count: number) => {
      console.log(`[AKQ] packReady() called with ${count} items`);
      if (!isPacksReady) {
        setIsPacksReady(true);
        toast({
          title: "Ready — tap to start",
          description: `${count} questions loaded`,
        });
      }
    };

    window.AKQ_setReady = () => {
      console.log("[AKQ] setReady() called");
      if (!isPacksReady) {
        setIsPacksReady(true);
        toast({
          title: "Ready — tap to start",
        });
      }
    };

    window.addEventListener("akq:ready", handleAkqReady);

    return () => {
      window.removeEventListener("akq:ready", handleAkqReady);
    };
  }, [isPacksReady, toast]);

  // Restore quiz state after packs are loaded
  useEffect(() => {
    if (packs.length > 0 && userProgress.currentPackId) {
      const savedPack = packs.find((p) => p.id === userProgress.currentPackId);
      if (savedPack) {
        setCurrentPack(savedPack);
        const questionIndex = userProgress.currentQuestionIndex || 0;
        setCurrentQuestionIndex(questionIndex);
        
        // Determine if quiz is completed or in progress
        const isCompleted = userProgress.completedPacks.includes(userProgress.currentPackId);
        if (isCompleted) {
          setGameState("results");
        } else {
          setGameState("quiz");
        }
      }
    }
  }, [packs, userProgress.currentPackId, userProgress.currentQuestionIndex, userProgress.completedPacks]);


  const loadPacks = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL || "/";
      const loadedPacks: Pack[] = [];

      // First, load the packs config
      let packConfigs: Array<{
        id: string;
        name: string;
        description?: string;
        icon?: string;
        category?: string;
        unlockCost: number;
      }> = [];

      try {
        const configResponse = await fetch(`${baseUrl}packs-config.json`);
        if (configResponse.ok) {
          const config = await configResponse.json();
          packConfigs = config.packs || [];
        }
      } catch (configError) {
        console.warn("Could not load packs-config.json, using fallback");
      }

      // Fallback to hardcoded list if config fails
      if (packConfigs.length === 0) {
        packConfigs = [
          { id: "mammals", name: "Mammals", unlockCost: 0 },
          { id: "birds", name: "Birds", unlockCost: 0 },
          { id: "reptiles", name: "Reptiles", unlockCost: 0 },
          { id: "fish", name: "Fish", unlockCost: 0 },
          { id: "amphibians", name: "Amphibians", unlockCost: 0 },
          { id: "insects", name: "Insects", unlockCost: 0 },
        ];
      }

      // Load each pack from its JSON file
      for (const packConfig of packConfigs) {
        try {
          const response = await fetch(`${baseUrl}packs/${packConfig.id}.json`);
          if (response.ok) {
            const items = await response.json();
            // Add questionType default to items if missing
            const normalizedItems = items.map((item: any) => ({
              ...item,
              questionType: item.questionType || "multiple-choice",
            }));
            loadedPacks.push({
              id: packConfig.id,
              name: packConfig.name,
              description: packConfig.description,
              icon: packConfig.icon,
              unlockCost: packConfig.unlockCost || 0,
              items: normalizedItems,
            });
          } else {
            console.error(`HTTP error loading pack ${packConfig.id}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Failed to load pack: ${packConfig.id}`, error);
        }
      }

      if (loadedPacks.length === 0) {
        toast({
          title: "No packs available",
          description: "Failed to load any quiz packs. Please refresh.",
          variant: "destructive",
        });
        window.AKQ_setReady();
        return;
      }

      setPacks(loadedPacks);

      // Calculate total items and call readiness hook
      const totalItems = loadedPacks.reduce(
        (sum, pack) => sum + pack.items.length,
        0
      );
      if (totalItems > 0) {
        window.AKQ_packReady(totalItems);
      } else {
        window.AKQ_setReady();
      }
    } catch (error) {
      console.error("Failed to load packs:", error);
      toast({
        title: "Loading failed",
        description: "Could not load quiz packs",
        variant: "destructive",
      });
      window.AKQ_setReady();
    }
  };

  const handleDismissSplash = () => {
    setGameState("pack-selection");
  };

  const handleSelectPack = (packId: string, isMultiplayer: boolean = false) => {
    const pack = packs.find((p) => p.id === packId);
    if (!pack) return;

    setCurrentPack(pack);
    setCurrentQuestionIndex(0);

    if (isMultiplayer) {
      // Go to player setup for multiplayer
      setGameMode("multiplayer");
      setGameState("player-setup");
    } else {
      // Single player - update streak and start immediately
      setGameMode("single");
      setUserProgress((prev) => {
        // Update streak when starting a quiz
        const streakUpdate = updateStreak(prev);
        const streakBonus = streakUpdate.isNewDay ? getStreakBonus(streakUpdate.currentStreak) : 0;
        const streakMessage = streakUpdate.isNewDay ? getStreakMessage(streakUpdate.currentStreak) : null;
        
        // Show streak milestone toast
        if (streakMessage) {
          toast({
            title: streakMessage,
            description: `Keep your streak going!`,
          });
        }
        
        // Show streak celebration for milestones
        const streakMilestones = [3, 7, 14, 30, 60, 100];
        if (streakUpdate.isNewDay && streakMilestones.includes(streakUpdate.currentStreak)) {
          setStreakMilestoneBonus(streakBonus);
          setTimeout(() => {
            setShowStreakCelebration(true);
          }, 500);
        }
        
        // Show streak bonus toast
        if (streakBonus > 0 && streakUpdate.isNewDay) {
          setTimeout(() => {
            playCoinPickup();
            toast({
              title: `Streak Bonus! +${streakBonus} coins`,
              description: `${streakUpdate.currentStreak} day streak`,
            });
          }, 500);
        }
        
        return {
          ...prev,
          currentPackId: packId,
          currentQuestionIndex: 0,
          answeredQuestions: [],
          score: 0,
          currentStreak: streakUpdate.currentStreak,
          longestStreak: streakUpdate.longestStreak,
          lastPlayedDate: streakUpdate.lastPlayedDate,
          coins: prev.coins + streakBonus,
          lifetimeStats: {
            ...prev.lifetimeStats,
            totalCoinsEarned: prev.lifetimeStats.totalCoinsEarned + streakBonus,
          },
        };
      });
      setGameState("quiz");
    }
  };
  
  // Handle starting daily challenge
  const handleStartDailyChallenge = () => {
    if (packs.length === 0) return;
    
    const challenge = getTodayChallenge(userProgress, packs);
    const pack = packs.find(p => p.id === challenge.packId);
    if (!pack) return;
    
    // Create a temporary pack with only the challenge questions
    const challengeQuestions = getDailyChallengeQuestions(challenge, packs);
    if (challengeQuestions.length === 0) return;
    
    const challengePack: Pack = {
      ...pack,
      id: `daily-${challenge.date}`,
      name: "Daily Challenge",
      items: challengeQuestions,
    };
    
    setCurrentPack(challengePack);
    setCurrentQuestionIndex(0);
    setGameMode("single");
    
    // Update streak and start daily challenge
    setUserProgress((prev) => {
      const streakUpdate = updateStreak(prev);
      const streakBonus = streakUpdate.isNewDay ? getStreakBonus(streakUpdate.currentStreak) : 0;
      
      if (streakBonus > 0 && streakUpdate.isNewDay) {
        setTimeout(() => {
          playCoinPickup();
          toast({
            title: `Streak Bonus! +${streakBonus} coins`,
            description: `${streakUpdate.currentStreak} day streak`,
          });
        }, 500);
      }
      
      // Add challenge to history if not already there
      const existingChallenge = prev.dailyChallengeHistory.find(c => c.date === challenge.date);
      const updatedHistory = existingChallenge 
        ? prev.dailyChallengeHistory 
        : [...prev.dailyChallengeHistory, challenge];
      
      return {
        ...prev,
        currentPackId: challengePack.id,
        currentQuestionIndex: 0,
        answeredQuestions: [],
        score: 0,
        currentStreak: streakUpdate.currentStreak,
        longestStreak: streakUpdate.longestStreak,
        lastPlayedDate: streakUpdate.lastPlayedDate,
        coins: prev.coins + streakBonus,
        dailyChallengeHistory: updatedHistory,
        lifetimeStats: {
          ...prev.lifetimeStats,
          totalCoinsEarned: prev.lifetimeStats.totalCoinsEarned + streakBonus,
        },
      };
    });
    
    setGameState("quiz");
  };
  
  // Handle viewing stats dashboard
  const handleViewStats = () => {
    setGameState("stats");
  };
  
  const handleStatsBackToHome = () => {
    setGameState("pack-selection");
  };
  
  const handleViewFavorites = () => {
    setGameState("favorites");
  };
  
  const handleFavoritesBackToHome = () => {
    setGameState("pack-selection");
  };
  
  const handleRemoveFavorite = (questionId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      favoriteAnimals: prev.favoriteAnimals.filter(id => id !== questionId),
    }));
    playClick();
  };
  
  const handlePracticeFavorites = () => {
    // Create a custom pack from favorite questions
    const favoriteQuestions: QuizItem[] = [];
    for (const pack of packs) {
      for (const item of pack.items) {
        if (userProgress.favoriteAnimals.includes(item.id)) {
          favoriteQuestions.push(item);
        }
      }
    }
    
    if (favoriteQuestions.length === 0) {
      toast({
        title: "No Favorites",
        description: "Add some favorites first by tapping the heart icon during quizzes!",
      });
      return;
    }
    
    // Create a custom pack with favorites
    const favoritesPack: Pack = {
      id: "favorites",
      name: "Favorites",
      description: "Your favorite animals",
      icon: "heart",
      unlockCost: 0,
      items: favoriteQuestions,
    };
    
    setCurrentPack(favoritesPack);
    setCurrentQuestionIndex(0);
    setUserProgress((prev) => ({
      ...prev,
      currentPackId: "favorites",
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
    }));
    setGameState("quiz");
  };
  
  // Review Mode - practice wrong answers
  const handleStartReviewMode = () => {
    // Get unique question IDs from wrong answers
    const wrongQuestionIds = new Set(userProgress.wrongAnswers.map(w => w.questionId));
    
    if (wrongQuestionIds.size === 0) {
      toast({
        title: "No Questions to Review",
        description: "You haven't gotten any questions wrong yet. Keep playing to build your review list!",
      });
      return;
    }
    
    // Collect questions from all packs that match wrong answer IDs
    const reviewQuestions: QuizItem[] = [];
    for (const pack of packs) {
      for (const item of pack.items) {
        if (wrongQuestionIds.has(item.id)) {
          reviewQuestions.push(item);
        }
      }
    }
    
    if (reviewQuestions.length === 0) {
      toast({
        title: "No Questions Found",
        description: "Could not find the questions to review.",
      });
      return;
    }
    
    // Create a custom pack with review questions
    const reviewPack: Pack = {
      id: "review",
      name: "Review Mode",
      description: "Practice questions you got wrong",
      icon: "refresh",
      unlockCost: 0,
      items: reviewQuestions,
    };
    
    setCurrentPack(reviewPack);
    setCurrentQuestionIndex(0);
    setUserProgress((prev) => ({
      ...prev,
      currentPackId: "review",
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
    }));
    setGameState("quiz");
  };
  
  // Clear a question from review list when answered correctly
  const clearFromReviewList = (questionId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers.filter(w => w.questionId !== questionId),
    }));
  };
  
  // Shop handlers
  const handleViewShop = () => {
    setGameState("shop");
  };
  
  const handleShopBackToHome = () => {
    setGameState("pack-selection");
  };
  
  const handlePurchaseTheme = (themeId: string, price: number) => {
    setUserProgress((prev) => ({
      ...prev,
      coins: prev.coins - price,
      unlockedThemes: [...prev.unlockedThemes, themeId],
    }));
    playCoinPickup();
  };
  
  const handlePurchasePack = (packId: string, price: number) => {
    setUserProgress((prev) => ({
      ...prev,
      coins: prev.coins - price,
      unlockedPacks: [...prev.unlockedPacks, packId],
    }));
    playCoinPickup();
  };

  const handleStartMultiplayerGame = (gamePlayers: Player[]) => {
    dispatchMultiplayer({ type: "RESET", players: gamePlayers });
    setGameState("quiz");
  };

  const handleBackFromPlayerSetup = () => {
    setGameState("pack-selection");
    setGameMode("single");
    dispatchMultiplayer({ type: "CLEAR" });
  };
  
  // Watch for multiplayer quiz completion
  useEffect(() => {
    console.log("[Multiplayer] useEffect check:", {
      gameMode,
      shouldShowResults: multiplayerState.shouldShowResults,
      willTransition: gameMode === "multiplayer" && multiplayerState.shouldShowResults,
    });
    if (gameMode === "multiplayer" && multiplayerState.shouldShowResults) {
      console.log("[Multiplayer] Transitioning to results screen");
      playLevelComplete();
      setGameState("results");
    }
  }, [gameMode, multiplayerState.shouldShowResults, playLevelComplete]);

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    if (!currentPack) return;

    const pointsEarned = isCorrect ? 10 : 0;

    if (gameMode === "multiplayer") {
      // Multiplayer mode - use multiplayerState question index for correct question
      const currentItem = currentPack.items[multiplayerState.currentQuestionIndex];
      
      // Dispatch atomic update synchronously
      dispatchMultiplayer({
        type: "ANSWER",
        playerIndex: multiplayerState.currentPlayerIndex,
        questionId: currentItem.id,
        isCorrect,
        points: pointsEarned,
        totalQuestions: currentPack.items.length,
      });
    } else {
      // Single player mode - use single-player question index
      const currentItem = currentPack.items[currentQuestionIndex];
      const coinsEarned = isCorrect ? 1 : 0;
      const isLastQuestion = currentQuestionIndex >= currentPack.items.length - 1;
      const nextQuestionIndex = isLastQuestion ? currentQuestionIndex : currentQuestionIndex + 1;

      // Play coin pickup sound and trigger celebration when earning coins
      if (isCorrect) {
        setTimeout(() => playCoinPickup(), 300);
        // Trigger correct answer burst animation
        setShowCorrectBurst(true);
        setTimeout(() => setShowCorrectBurst(false), 1000);
      }

      setUserProgress((prev) => {
        const xpEarned = isCorrect ? 15 : 5; // XP for correct/incorrect answers
        const oldLevel = calculateLevel(prev.xp);
        const newLevel = calculateLevel(prev.xp + xpEarned);
        
        // Check for level up and trigger celebration
        if (newLevel > oldLevel) {
          setTimeout(() => {
            setShowConfetti(true);
            setCelebrationData({
              type: "level-up",
              message: `Level ${newLevel}!`,
              subMessage: "Keep learning to level up more!"
            });
          }, 1700); // Delay to not overlap with other animations
        }
        
        // Check if this is a daily challenge completion
        const isDailyChallenge = currentPack.id.startsWith('daily-');
        const dailyChallengeBonus = isDailyChallenge && isLastQuestion ? { xp: 50, coins: 10 } : { xp: 0, coins: 0 };
        
        // Update daily challenge history if completing a daily challenge
        let updatedDailyChallengeHistory = prev.dailyChallengeHistory;
        if (isDailyChallenge && isLastQuestion) {
          const challengeDate = currentPack.id.replace('daily-', '');
          updatedDailyChallengeHistory = prev.dailyChallengeHistory.map(c => 
            c.date === challengeDate 
              ? { ...c, completed: true, score: prev.score + pointsEarned }
              : c
          );
          
          // Toast for daily challenge completion
          setTimeout(() => {
            toast({
              title: "Daily Challenge Complete!",
              description: `+${dailyChallengeBonus.xp} bonus XP, +${dailyChallengeBonus.coins} bonus coins`,
            });
          }, 800);
        }
        
        const updatedProgress = {
          ...prev,
          score: prev.score + pointsEarned,
          coins: prev.coins + coinsEarned + dailyChallengeBonus.coins,
          xp: prev.xp + xpEarned + dailyChallengeBonus.xp,
          answeredQuestions: [
            ...prev.answeredQuestions,
            { id: currentItem.id, correct: isCorrect, packId: currentPack.id, answeredAt: new Date().toISOString() },
          ],
          completedPacks: isLastQuestion && !isDailyChallenge && currentPack.id !== "favorites" && currentPack.id !== "review"
            ? Array.from(new Set([...prev.completedPacks, currentPack.id]))
            : prev.completedPacks,
          // Track wrong answers for review mode
          // If correct: remove from review list
          // If incorrect: add to review list (avoiding duplicates)
          wrongAnswers: isCorrect
            ? prev.wrongAnswers.filter(w => w.questionId !== currentItem.id)
            : prev.wrongAnswers.some(w => w.questionId === currentItem.id)
              ? prev.wrongAnswers.map(w => 
                  w.questionId === currentItem.id 
                    ? { ...w, wrongAnswer: selectedAnswer, answeredAt: new Date().toISOString() }
                    : w
                )
              : [...prev.wrongAnswers, { questionId: currentItem.id, packId: currentPack.id, wrongAnswer: selectedAnswer, correctAnswer: currentItem.answer, answeredAt: new Date().toISOString() }],
          dailyChallengeHistory: updatedDailyChallengeHistory,
          lifetimeStats: {
            ...prev.lifetimeStats,
            totalQuestionsAnswered: prev.lifetimeStats.totalQuestionsAnswered + 1,
            totalCorrectAnswers: prev.lifetimeStats.totalCorrectAnswers + (isCorrect ? 1 : 0),
            totalScore: prev.lifetimeStats.totalScore + pointsEarned,
            totalXpEarned: prev.lifetimeStats.totalXpEarned + xpEarned + dailyChallengeBonus.xp,
            totalCoinsEarned: prev.lifetimeStats.totalCoinsEarned + coinsEarned + dailyChallengeBonus.coins,
            dailyChallengesCompleted: prev.lifetimeStats.dailyChallengesCompleted + (isDailyChallenge && isLastQuestion ? 1 : 0),
          },
        };
        
        if (isLastQuestion) {
          // Check for perfect score - answeredQuestions is reset when pack starts
          // so it only contains answers from this session
          const isPerfect = updatedProgress.answeredQuestions.length === currentPack.items.length && 
                           updatedProgress.answeredQuestions.every(q => q.correct);
          
          setTimeout(() => {
            playLevelComplete();
            checkAndAwardBadges(updatedProgress, currentPack);
            
            // Trigger perfect score celebration if all answers were correct
            if (isPerfect) {
              setShowConfetti(true);
              setCelebrationData({
                type: "perfect-score",
                message: "Perfect Score!",
                subMessage: `You got all ${currentPack.items.length} questions right!`
              });
            }
            
            setGameState("results");
          }, 1600);
        }
        
        return updatedProgress;
      });

      if (!isLastQuestion) {
        setTimeout(() => {
          setCurrentQuestionIndex(nextQuestionIndex);
        }, 100);
      }
    }
  };

  const handleSkip = () => {
    if (!currentPack) return;
    
    // Skip only available in single player mode
    if (gameMode !== "single") return;

    const isLastQuestion = currentQuestionIndex >= currentPack.items.length - 1;
    const nextQuestionIndex = isLastQuestion ? currentQuestionIndex : currentQuestionIndex + 1;

    // Use functional update to avoid race conditions and ensure non-negative coins
    setUserProgress((prev) => {
      // Guard against insufficient coins
      if (prev.coins < 2) return prev;
      
      const updatedProgress = {
        ...prev,
        coins: prev.coins - 2,
        completedPacks: isLastQuestion
          ? Array.from(new Set([...prev.completedPacks, currentPack.id]))
          : prev.completedPacks,
        // Update lifetime stats for skipped questions (counted but not correct)
        lifetimeStats: {
          ...prev.lifetimeStats,
          totalQuestionsAnswered: prev.lifetimeStats.totalQuestionsAnswered + 1,
        },
      };
      
      // Handle last question completion
      if (isLastQuestion) {
        checkAndAwardBadges(updatedProgress, currentPack);
        setGameState("results");
      }
      
      return updatedProgress;
    });

    if (!isLastQuestion) {
      setCurrentQuestionIndex(nextQuestionIndex);
    }
    // Note: last question handling is now inside setUserProgress callback
  };

  // Toggle favorite for current question
  const handleToggleFavorite = () => {
    if (!currentPack) return;
    
    const questionIndex = gameMode === "multiplayer" 
      ? multiplayerState.currentQuestionIndex 
      : currentQuestionIndex;
    const currentItem = currentPack.items[questionIndex];
    
    setUserProgress((prev) => {
      const isFavorite = prev.favoriteAnimals.includes(currentItem.id);
      return {
        ...prev,
        favoriteAnimals: isFavorite
          ? prev.favoriteAnimals.filter(id => id !== currentItem.id)
          : [...prev.favoriteAnimals, currentItem.id],
      };
    });
    
    // Play a click sound for feedback
    playClick();
  };
  
  // Get current question's favorite status
  const getCurrentQuestionFavoriteStatus = () => {
    if (!currentPack) return false;
    
    const questionIndex = gameMode === "multiplayer" 
      ? multiplayerState.currentQuestionIndex 
      : currentQuestionIndex;
    const currentItem = currentPack.items[questionIndex];
    
    return userProgress.favoriteAnimals.includes(currentItem.id);
  };

  const checkAndAwardBadges = (progress: UserProgress, pack: Pack | null) => {
    const newBadges: string[] = [];

    // First quiz completion - award if user has completed their first pack
    if (!progress.badges.includes("first-quiz") && progress.completedPacks.length > 0) {
      newBadges.push("first-quiz");
    }

    // Perfect score - check if all answers in current pack were correct
    // Guard: only check if pack is provided (not null after reset)
    if (pack && !progress.badges.includes("perfect-score")) {
      // Get all answers for the current pack by matching IDs
      const currentPackIds = new Set(pack.items.map((item) => item.id));
      const currentPackAnswers = progress.answeredQuestions.filter((ans) =>
        currentPackIds.has(ans.id)
      );
      const allCorrect = currentPackAnswers.every((q) => q.correct);
      if (allCorrect && currentPackAnswers.length === pack.items.length) {
        newBadges.push("perfect-score");
      }
    }

    if (newBadges.length > 0) {
      // Play badge earned sound with slight delay for dramatic effect
      setTimeout(() => playBadgeEarned(), 500);
      
      // Trigger badge celebration for the first new badge
      setTimeout(() => {
        setShowConfetti(true);
        setCelebrationData({
          type: "badge",
          message: "Badge Unlocked!",
          subMessage: newBadges.length > 1 
            ? `You earned ${newBadges.length} badges!` 
            : "Keep playing to unlock more!"
        });
      }, 1000);
      
      setUserProgress((prev) => ({
        ...prev,
        badges: Array.from(new Set([...prev.badges, ...newBadges])),
      }));
    }
  };

  const handlePlayAgain = () => {
    setCurrentPack(null);
    setCurrentQuestionIndex(0);
    
    // Clear multiplayer state completely
    dispatchMultiplayer({ type: "CLEAR" });
    setGameMode("single"); // Always reset to single player
    
    // Reset single-player progress
    setUserProgress((prev) => ({
      ...prev,
      currentPackId: undefined,
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
    }));
    setGameState("pack-selection");
  };

  const handleBackToHome = () => {
    handlePlayAgain();
  };

  const handleViewBadges = () => {
    setGameState("badge-gallery");
  };

  const handleBadgeGalleryBackToHome = () => {
    setGameState("pack-selection");
  };

  const getPacksInfo = () => {
    return packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      description: `Test your knowledge about ${pack.name.toLowerCase()}`,
      image: "",
      questionCount: pack.items.length,
      completed: userProgress.completedPacks.includes(pack.id),
      progress: 0,
    }));
  };

  const getEarnedBadges = () => {
    const badgeDefinitions = [
      {
        id: "first-quiz",
        name: "First Steps",
        description: "Completed your first quiz",
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Answered all questions correctly",
      },
    ];

    return badgeDefinitions.filter((badge) =>
      userProgress.badges.includes(badge.id)
    );
  };

  const calculateEarnedCoins = () => {
    return userProgress.answeredQuestions.filter((q) => q.correct).length;
  };

  return (
    <>
      <ServiceWorkerUpdateBanner />

      {gameState === "landing" && (
        <LandingPage
          isReady={isPacksReady}
          onStart={() => setGameState("pack-selection")}
        />
      )}

      {gameState === "splash" && (
        <SplashScreen
          isReady={isPacksReady}
          onDismiss={handleDismissSplash}
        />
      )}

      {gameState === "pack-selection" && (
        <div className="relative min-h-screen">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 flex-wrap justify-end">
            <StreakDisplay 
              currentStreak={userProgress.currentStreak} 
              longestStreak={userProgress.longestStreak}
              size="sm"
            />
            <LevelDisplay 
              xp={userProgress.xp} 
              level={calculateLevel(userProgress.xp)}
              size="sm"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleViewStats}
              data-testid="button-view-stats"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewFavorites}
              className={userProgress.favoriteAnimals.length > 0 ? "text-red-500" : ""}
              data-testid="button-view-favorites"
            >
              <Heart className={`w-5 h-5 ${userProgress.favoriteAnimals.length > 0 ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartReviewMode}
              className={userProgress.wrongAnswers.length > 0 ? "text-amber-500" : ""}
              data-testid="button-start-review"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewShop}
              data-testid="button-view-shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeaderboard(true)}
              data-testid="button-view-leaderboard"
            >
              <Trophy className="w-5 h-5" />
            </Button>
            <TimedModeSelector
              enabled={timedMode}
              timeLimit={timeLimit}
              onToggle={() => setTimedMode(!timedMode)}
              onTimeLimitChange={setTimeLimit}
            />
            <DifficultySelector />
            <AudioControls />
            <ThemeSelector />
            <CoinDisplay coins={userProgress.coins} />
          </div>
          
          {/* Daily Challenge Card */}
          {packs.length > 0 && (
            <div className="absolute top-20 left-4 right-4 max-w-md mx-auto z-10">
              <DailyChallengeCard
                challenge={getTodayChallenge(userProgress, packs)}
                pack={packs.find(p => p.id === getTodayChallenge(userProgress, packs).packId)}
                isCompleted={isDailyChallengeCompletedToday(userProgress)}
                onStart={handleStartDailyChallenge}
              />
            </div>
          )}

          {/* Weekly Quests */}
          {packs.length > 0 && (
            <div className="absolute top-64 left-4 right-4 max-w-md mx-auto z-10">
              <WeeklyQuests
                questProgress={{
                  questionsAnswered: userProgress.lifetimeStats.totalQuestionsAnswered,
                  correctAnswers: userProgress.lifetimeStats.totalCorrectAnswers,
                  packsCompleted: userProgress.completedPacks.length,
                  streakDays: userProgress.currentStreak,
                  perfectScores: userProgress.lifetimeStats.perfectGames,
                }}
              />
            </div>
          )}
          
          <div className="pt-[480px]">
            <PackSelection
              packs={getPacksInfo()}
              onSelectPack={handleSelectPack}
              onViewBadges={handleViewBadges}
            />
          </div>
        </div>
      )}

      {gameState === "stats" && (
        <div className="min-h-screen bg-background">
          <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleStatsBackToHome} data-testid="button-back-from-stats">
              Back
            </Button>
            <h1 className="text-xl font-display font-semibold">Your Stats</h1>
            <div className="w-16" />
          </div>
          <StatsDashboard progress={userProgress} packs={packs} />
        </div>
      )}

      {gameState === "favorites" && (
        <FavoritesGallery
          favoriteIds={userProgress.favoriteAnimals}
          packs={packs}
          onBack={handleFavoritesBackToHome}
          onRemoveFavorite={handleRemoveFavorite}
          onPracticeFavorites={handlePracticeFavorites}
        />
      )}

      {gameState === "shop" && (
        <Shop
          coins={userProgress.coins}
          unlockedThemes={userProgress.unlockedThemes}
          unlockedPacks={userProgress.unlockedPacks}
          onBack={handleShopBackToHome}
          onPurchaseTheme={handlePurchaseTheme}
          onPurchasePack={handlePurchasePack}
        />
      )}

      {gameState === "badge-gallery" && (
        <BadgeGallery
          unlockedBadges={userProgress.badges}
          userProgress={{
            coins: userProgress.coins,
            score: userProgress.score,
            completedPacks: userProgress.completedPacks,
            answeredQuestions: userProgress.answeredQuestions,
            lifetimeStats: userProgress.lifetimeStats,
          }}
          onBackToHome={handleBadgeGalleryBackToHome}
        />
      )}

      {gameState === "player-setup" && (
        <PlayerSetup
          onStartGame={handleStartMultiplayerGame}
          onBack={handleBackFromPlayerSetup}
        />
      )}

      {gameState === "quiz" && currentPack && (
        <div className="min-h-screen bg-background p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToHome}
                title="Exit Quiz"
                data-testid="button-exit-quiz"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-display font-semibold">
                {currentPack.name} Quiz
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFlashcards(true)}
                title="Study Mode"
                data-testid="button-flashcard-mode"
              >
                <BookOpen className="w-5 h-5" />
              </Button>
              <AudioControls />
              <CoinDisplay coins={gameMode === "single" ? userProgress.coins : 0} />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <QuizCard
              key={
                gameMode === "multiplayer"
                  ? `q${multiplayerState.currentQuestionIndex}-p${multiplayerState.currentPlayerIndex}`
                  : `q${currentQuestionIndex}`
              }
              item={currentPack.items[gameMode === "multiplayer" ? multiplayerState.currentQuestionIndex : currentQuestionIndex]}
              questionNumber={(gameMode === "multiplayer" ? multiplayerState.currentQuestionIndex : currentQuestionIndex) + 1}
              totalQuestions={currentPack.items.length}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              canSkip={gameMode === "single" ? userProgress.coins >= 2 : false}
              currentPlayerName={
                gameMode === "multiplayer" && 
                multiplayerState.players.length > 0 && 
                multiplayerState.currentPlayerIndex < multiplayerState.players.length
                  ? multiplayerState.players[multiplayerState.currentPlayerIndex].name 
                  : undefined
              }
              isMultiplayer={gameMode === "multiplayer"}
              timedMode={timedMode && gameMode === "single"}
              timeLimit={timeLimit}
              isFavorite={getCurrentQuestionFavoriteStatus()}
              onToggleFavorite={gameMode === "single" ? handleToggleFavorite : undefined}
            />
          </div>
        </div>
      )}

      {gameState === "results" && gameMode === "single" && (
        <ResultsScreen
          score={userProgress.score}
          totalQuestions={userProgress.answeredQuestions.length}
          correctAnswers={
            userProgress.answeredQuestions.filter((q) => q.correct).length
          }
          earnedCoins={calculateEarnedCoins()}
          badges={getEarnedBadges()}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}

      {gameState === "results" && gameMode === "multiplayer" && (
        <MultiplayerResults
          players={multiplayerState.players}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Celebration overlays */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <CorrectAnswerBurst active={showCorrectBurst} />

      {/* Streak celebration modal */}
      {showStreakCelebration && (
        <StreakCelebration
          streakDays={userProgress.currentStreak}
          isNewMilestone={true}
          bonusCoins={streakMilestoneBonus}
          onComplete={() => setShowStreakCelebration(false)}
        />
      )}

      {/* Level up / badge celebration */}
      {celebrationData && (
        <CelebrationOverlay
          type={celebrationData.type}
          message={celebrationData.message}
          subMessage={celebrationData.subMessage}
          onComplete={() => setCelebrationData(null)}
        />
      )}

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Leaderboard
            userScore={userProgress.lifetimeStats.totalScore}
            userLevel={calculateLevel(userProgress.xp)}
            onClose={() => setShowLeaderboard(false)}
          />
        </div>
      )}

      {/* Flashcard mode */}
      {showFlashcards && currentPack && (
        <div className="fixed inset-0 z-50 bg-background">
          <FlashcardMode
            pack={currentPack}
            onExit={() => setShowFlashcards(false)}
          />
        </div>
      )}
    </>
  );
}
