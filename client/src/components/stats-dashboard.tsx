import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Target, 
  Trophy, 
  Flame, 
  Calendar,
  Star,
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import type { UserProgress, Pack } from "@shared/schema";
import { calculateLevel, getLevelName, getXpForNextLevel, LEVEL_THRESHOLDS } from "@shared/schema";

interface StatsDashboardProps {
  progress: UserProgress;
  packs: Pack[];
}

export function StatsDashboard({ progress, packs }: StatsDashboardProps) {
  const { lifetimeStats, packStats } = progress;
  
  const accuracy = lifetimeStats.totalQuestionsAnswered > 0
    ? Math.round((lifetimeStats.totalCorrectAnswers / lifetimeStats.totalQuestionsAnswered) * 100)
    : 0;

  const currentLevel = calculateLevel(progress.xp);
  const currentLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpInCurrentLevel = progress.xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const levelProgress = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return (
    <div className="space-y-6 p-4" data-testid="stats-dashboard">
      {/* Level & XP Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">Level {currentLevel}</p>
                <p className="text-muted-foreground">{getLevelName(currentLevel)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-primary">{progress.xp}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
            <div className="space-y-1">
              <Progress value={levelProgress} className="h-3" />
              <p className="text-xs text-muted-foreground text-right">
                {xpInCurrentLevel} / {xpNeededForNextLevel} XP to Level {currentLevel + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          label="Correct"
          value={lifetimeStats.totalCorrectAnswers}
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Accuracy"
          value={`${accuracy}%`}
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          label="Current Streak"
          value={progress.currentStreak}
          subtext={`Best: ${progress.longestStreak}`}
        />
        <StatCard
          icon={<Coins className="w-5 h-5 text-yellow-500" />}
          label="Total Coins"
          value={lifetimeStats.totalCoinsEarned}
        />
      </motion.div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5" />
              Lifetime Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow 
              label="Questions Answered" 
              value={lifetimeStats.totalQuestionsAnswered} 
            />
            <StatRow 
              label="Correct Answers" 
              value={lifetimeStats.totalCorrectAnswers}
              subtext={`${accuracy}% accuracy`}
            />
            <StatRow 
              label="Total Score" 
              value={lifetimeStats.totalScore} 
            />
            <StatRow 
              label="XP Earned" 
              value={lifetimeStats.totalXpEarned} 
            />
            <StatRow 
              label="Coins Earned" 
              value={lifetimeStats.totalCoinsEarned} 
            />
            <StatRow 
              label="Daily Challenges" 
              value={lifetimeStats.dailyChallengesCompleted} 
            />
            <StatRow 
              label="Badges Earned" 
              value={progress.badges.length} 
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Pack Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Pack Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packs.map((pack) => {
              const stats = packStats.find(ps => ps.packId === pack.id);
              const bestAccuracy = stats 
                ? Math.round((stats.bestScore / (pack.items.length * 10)) * 100)
                : 0;
              
              return (
                <div key={pack.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{pack.icon}</span>
                      <span className="font-medium">{pack.name}</span>
                    </div>
                    {stats && stats.timesCompleted > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {stats.timesCompleted}x completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {stats ? (
                      <>
                        <span>Best: {stats.bestScore} pts</span>
                        <span>Accuracy: {bestAccuracy}%</span>
                      </>
                    ) : (
                      <span>Not started</span>
                    )}
                  </div>
                  <Separator />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Wrong Answers for Review */}
      {progress.wrongAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <XCircle className="w-5 h-5 text-red-500" />
                Review Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                {progress.wrongAnswers.length} questions to review
              </p>
              <p className="text-sm text-muted-foreground">
                Practice these in Review Mode to improve your knowledge!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// Helper components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext?: string;
}

function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface StatRowProps {
  label: string;
  value: number | string;
  subtext?: string;
}

function StatRow({ label, value, subtext }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-semibold">{value}</span>
        {subtext && (
          <span className="text-xs text-muted-foreground ml-2">({subtext})</span>
        )}
      </div>
    </div>
  );
}
