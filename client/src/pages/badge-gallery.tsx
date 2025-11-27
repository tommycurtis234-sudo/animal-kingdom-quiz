import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, Trophy, Target, Coins, Award, Zap, Flame, Crown, Star, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "achievement" | "mastery" | "collection";
  requirement: string;
  unlocked: boolean;
}

interface BadgeGalleryProps {
  unlockedBadges: string[];
  userProgress: {
    coins: number;
    score: number;
    completedPacks: string[];
    answeredQuestions: Array<{ id: string; correct: boolean }>;
    lifetimeStats: {
      totalQuestionsAnswered: number;
      totalCorrectAnswers: number;
      totalScore: number;
    };
  };
  onBackToHome: () => void;
}

export function BadgeGallery({ unlockedBadges, userProgress, onBackToHome }: BadgeGalleryProps) {
  const allBadges: BadgeDefinition[] = [
    {
      id: "first-quiz",
      name: "First Steps",
      description: "Complete your very first quiz pack",
      icon: Trophy,
      category: "achievement",
      requirement: "Complete 1 quiz pack",
      unlocked: unlockedBadges.includes("first-quiz"),
    },
    {
      id: "perfect-score",
      name: "Perfect Score",
      description: "Answer every question correctly in a quiz pack",
      icon: Star,
      category: "mastery",
      requirement: "100% correct answers in any pack",
      unlocked: unlockedBadges.includes("perfect-score"),
    },
    {
      id: "coin-collector",
      name: "Coin Collector",
      description: "Accumulate 50 coins",
      icon: Coins,
      category: "collection",
      requirement: "Earn 50 total coins",
      unlocked: userProgress.coins >= 50,
    },
    {
      id: "pack-master",
      name: "Pack Master",
      description: "Complete all three quiz packs",
      icon: Crown,
      category: "mastery",
      requirement: "Complete all 3 packs",
      unlocked: userProgress.completedPacks.length >= 3,
    },
    {
      id: "sharpshooter",
      name: "Sharpshooter",
      description: "Answer 25 questions correctly",
      icon: Target,
      category: "achievement",
      requirement: "25 correct answers total",
      unlocked: userProgress.lifetimeStats.totalCorrectAnswers >= 25,
    },
    {
      id: "speedster",
      name: "Speedster",
      description: "Complete a timed quiz under par time",
      icon: Zap,
      category: "achievement",
      requirement: "Beat par time in timed mode",
      unlocked: false, // Will be implemented with timed mode
    },
    {
      id: "streak-master",
      name: "Streak Master",
      description: "Complete daily challenges for 7 days straight",
      icon: Flame,
      category: "mastery",
      requirement: "7-day streak",
      unlocked: false, // Will be implemented with daily challenges
    },
    {
      id: "completionist",
      name: "Completionist",
      description: "Answer 100 questions correctly",
      icon: CheckCircle2,
      category: "collection",
      requirement: "100 correct answers total",
      unlocked: userProgress.lifetimeStats.totalCorrectAnswers >= 100,
    },
    {
      id: "animal-expert",
      name: "Animal Expert",
      description: "Earn a perfect score on all packs",
      icon: Award,
      category: "mastery",
      requirement: "Perfect score on all 3 packs",
      unlocked: false, // Advanced achievement
    },
  ];

  const unlockedCount = allBadges.filter(b => b.unlocked).length;
  const totalBadges = allBadges.length;
  const progressPercentage = (unlockedCount / totalBadges) * 100;

  const categories = {
    achievement: allBadges.filter(b => b.category === "achievement"),
    mastery: allBadges.filter(b => b.category === "mastery"),
    collection: allBadges.filter(b => b.category === "collection"),
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="heading-badge-gallery">
              Badge Gallery
            </h1>
            <p className="text-muted-foreground" data-testid="text-badge-subtitle">
              Track your achievements and unlock new badges
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onBackToHome}
            className="flex items-center gap-2"
            data-testid="button-back-home"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8" data-testid="card-progress-overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Collection Progress</h2>
              <Badge variant="secondary" className="text-lg px-3 py-1" data-testid="badge-progress-count">
                {unlockedCount} / {totalBadges}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" data-testid="progress-badges" />
            <p className="text-sm text-muted-foreground" data-testid="text-progress-percentage">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </Card>

        {/* Badge Categories */}
        <div className="space-y-8">
          {Object.entries(categories).map(([categoryName, badgesInCategory]) => (
            <div key={categoryName}>
              <h2 className="text-2xl font-bold mb-4 capitalize" data-testid={`heading-category-${categoryName}`}>
                {categoryName} Badges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badgesInCategory.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`p-6 relative overflow-hidden ${
                          badge.unlocked
                            ? "border-primary bg-accent/20"
                            : "opacity-60"
                        }`}
                        data-testid={`card-badge-${badge.id}`}
                      >
                        {/* Unlocked indicator */}
                        {badge.unlocked && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-5 h-5 text-primary" data-testid={`icon-unlocked-${badge.id}`} />
                          </div>
                        )}

                        {/* Badge Icon */}
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            badge.unlocked
                              ? "bg-primary/20"
                              : "bg-muted"
                          }`}
                          data-testid={`icon-container-${badge.id}`}
                        >
                          {badge.unlocked ? (
                            <Icon className="w-8 h-8 text-primary" data-testid={`icon-badge-${badge.id}`} />
                          ) : (
                            <Lock className="w-8 h-8 text-muted-foreground" data-testid={`icon-locked-${badge.id}`} />
                          )}
                        </div>

                        {/* Badge Info */}
                        <h3 className="text-lg font-semibold mb-2" data-testid={`text-badge-name-${badge.id}`}>
                          {badge.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-badge-description-${badge.id}`}>
                          {badge.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs" data-testid={`badge-requirement-${badge.id}`}>
                            {badge.requirement}
                          </Badge>
                        </div>

                        {badge.unlocked && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-primary font-medium" data-testid={`text-unlocked-${badge.id}`}>
                              ✓ Unlocked
                            </p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <Card className="p-6 mt-8" data-testid="card-stats-summary">
          <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" data-testid="stat-total-coins">
                {userProgress.coins}
              </div>
              <div className="text-sm text-muted-foreground">Total Coins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" data-testid="stat-total-score">
                {userProgress.lifetimeStats.totalScore}
              </div>
              <div className="text-sm text-muted-foreground">Lifetime Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" data-testid="stat-packs-completed">
                {userProgress.completedPacks.length}
              </div>
              <div className="text-sm text-muted-foreground">Packs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" data-testid="stat-correct-answers">
                {userProgress.lifetimeStats.totalCorrectAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
