import { useRef } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Trophy, Star, Zap, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pack } from "@shared/schema";

interface ShareableResultsProps {
  pack: Pack;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  level: number;
  xpEarned: number;
  coinsEarned: number;
  isPerfect: boolean;
  onShare?: () => void;
}

export function ShareableResults({
  pack,
  score,
  totalQuestions,
  correctAnswers,
  timeSpent,
  level,
  xpEarned,
  coinsEarned,
  isPerfect,
  onShare
}: ShareableResultsProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const avgTime = Math.round(timeSpent / totalQuestions);

  const getGrade = () => {
    if (accuracy === 100) return { grade: "S", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    if (accuracy >= 90) return { grade: "A+", color: "text-green-500", bg: "bg-green-500/20" };
    if (accuracy >= 80) return { grade: "A", color: "text-green-400", bg: "bg-green-400/20" };
    if (accuracy >= 70) return { grade: "B", color: "text-blue-500", bg: "bg-blue-500/20" };
    if (accuracy >= 60) return { grade: "C", color: "text-orange-500", bg: "bg-orange-500/20" };
    return { grade: "D", color: "text-red-500", bg: "bg-red-500/20" };
  };

  const grade = getGrade();

  const handleShare = async () => {
    const shareText = `🦁 I just completed the ${pack.name} quiz in Animal Kingdom Quiz!\n\n` +
      `📊 Score: ${accuracy}% (${correctAnswers}/${totalQuestions})\n` +
      `⭐ Grade: ${grade.grade}\n` +
      `⚡ XP Earned: +${xpEarned}\n` +
      `🪙 Coins: +${coinsEarned}\n` +
      (isPerfect ? `🏆 PERFECT SCORE!\n` : "") +
      `\nCan you beat my score? Play now!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Animal Kingdom Quiz Results",
          text: shareText,
        });
        onShare?.();
      } catch (e) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      onShare?.();
    }
  };

  const packEmoji: Record<string, string> = {
    mammals: "🦁",
    birds: "🦅",
    reptiles: "🦎",
    fish: "🐠",
    amphibians: "🐸",
    insects: "🦋",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <Card
        ref={cardRef}
        className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-2"
        data-testid="shareable-results"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        </div>

        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-5xl mb-2"
            >
              {packEmoji[pack.id] || "🐾"}
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">{pack.name} Quiz</h2>
            <p className="text-sm text-muted-foreground">Animal Kingdom Quiz</p>
          </div>

          {/* Grade Circle */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 15 }}
              className={`w-24 h-24 rounded-full ${grade.bg} flex items-center justify-center border-4 border-current ${grade.color}`}
            >
              <span className={`text-4xl font-bold ${grade.color}`}>{grade.grade}</span>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-3 text-center"
            >
              <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-muted/50 rounded-lg p-3 text-center"
            >
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-2xl font-bold">{correctAnswers}/{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-muted/50 rounded-lg p-3 text-center"
            >
              <Zap className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-2xl font-bold">+{xpEarned}</div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-muted/50 rounded-lg p-3 text-center"
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <div className="text-2xl font-bold">{avgTime}s</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </motion.div>
          </div>

          {/* Achievements */}
          {isPerfect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-1">
                <Trophy className="w-4 h-4 mr-1" />
                PERFECT SCORE!
              </Badge>
            </motion.div>
          )}

          {/* Level indicator */}
          <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
            <span>Level {level}</span>
            <span>•</span>
            <span>+{coinsEarned} coins</span>
          </div>

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-2"
          >
            <Button 
              onClick={handleShare} 
              className="flex-1"
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
