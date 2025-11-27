import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, Clock, Flame, Star, Trophy, Gift, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
  target: number;
  reward: { type: "coins" | "xp"; amount: number };
  color: string;
}

interface WeeklyQuestsProps {
  questProgress: {
    questionsAnswered: number;
    correctAnswers: number;
    packsCompleted: number;
    streakDays: number;
    perfectScores: number;
  };
  onClaimReward?: (questId: string) => void;
}

// Generate quests based on current week
const generateWeeklyQuests = (): Quest[] => {
  // Use week number as seed for consistent quests per week
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  
  const allQuests: Quest[] = [
    {
      id: "answer-master",
      title: "Answer Master",
      description: "Answer 50 questions this week",
      icon: Target,
      target: 50,
      reward: { type: "coins", amount: 100 },
      color: "text-blue-500"
    },
    {
      id: "accuracy-ace",
      title: "Accuracy Ace",
      description: "Get 30 correct answers",
      icon: Star,
      target: 30,
      reward: { type: "xp", amount: 200 },
      color: "text-yellow-500"
    },
    {
      id: "pack-explorer",
      title: "Pack Explorer",
      description: "Complete 3 different packs",
      icon: Trophy,
      target: 3,
      reward: { type: "coins", amount: 75 },
      color: "text-purple-500"
    },
    {
      id: "streak-keeper",
      title: "Streak Keeper",
      description: "Maintain a 5-day streak",
      icon: Flame,
      target: 5,
      reward: { type: "xp", amount: 150 },
      color: "text-orange-500"
    },
    {
      id: "perfectionist",
      title: "Perfectionist",
      description: "Get 2 perfect scores",
      icon: CheckCircle,
      target: 2,
      reward: { type: "coins", amount: 150 },
      color: "text-green-500"
    },
    {
      id: "quiz-champion",
      title: "Quiz Champion",
      description: "Answer 100 questions",
      icon: Target,
      target: 100,
      reward: { type: "xp", amount: 500 },
      color: "text-indigo-500"
    }
  ];

  // Select 3 quests based on week number
  const shuffled = [...allQuests].sort((a, b) => {
    const hashA = (weekNumber * a.id.length) % 100;
    const hashB = (weekNumber * b.id.length) % 100;
    return hashA - hashB;
  });

  return shuffled.slice(0, 3);
};

export function WeeklyQuests({ questProgress, onClaimReward }: WeeklyQuestsProps) {
  const quests = useMemo(() => generateWeeklyQuests(), []);

  const getQuestProgress = (quest: Quest): number => {
    switch (quest.id) {
      case "answer-master":
      case "quiz-champion":
        return questProgress.questionsAnswered;
      case "accuracy-ace":
        return questProgress.correctAnswers;
      case "pack-explorer":
        return questProgress.packsCompleted;
      case "streak-keeper":
        return questProgress.streakDays;
      case "perfectionist":
        return questProgress.perfectScores;
      default:
        return 0;
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    const diff = endOfWeek.getTime() - now.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <Card className="w-full" data-testid="weekly-quests">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="w-5 h-5 text-primary" />
            Weekly Quests
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {getTimeRemaining()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.map((quest, index) => {
          const progress = getQuestProgress(quest);
          const progressPercent = Math.min((progress / quest.target) * 100, 100);
          const isComplete = progress >= quest.target;
          const Icon = quest.icon;

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                isComplete ? "bg-green-500/10 border-green-500/30" : "bg-muted/30 border-border"
              }`}
              data-testid={`quest-${quest.id}`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-full bg-background ${quest.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">{quest.title}</h4>
                    {isComplete && (
                      <Badge variant="default" className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete!
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.min(progress, quest.target)} / {quest.target}</span>
                      <span className="flex items-center gap-1">
                        {quest.reward.type === "coins" ? "🪙" : "⚡"}
                        +{quest.reward.amount} {quest.reward.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Total rewards preview */}
        <div className="pt-2 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Complete all quests for bonus rewards!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
