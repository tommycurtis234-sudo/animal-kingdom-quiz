import { Flame, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  showLongest?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  showLongest = false,
  size = "md",
  animated = true,
}: StreakDisplayProps) {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-orange-500";
    if (streak >= 14) return "text-yellow-500";
    if (streak >= 7) return "text-amber-500";
    if (streak >= 3) return "text-red-400";
    return "text-muted-foreground";
  };

  const StreakContent = () => (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <Flame className={`${iconSizes[size]} ${getStreakColor(currentStreak)}`} />
      <span className="font-semibold">{currentStreak}</span>
      {showLongest && longestStreak > currentStreak && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground ml-1">
              <Trophy className={iconSizes[size]} />
              <span>{longestStreak}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Best streak: {longestStreak} days</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  if (!animated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-default" data-testid="badge-streak">
            <StreakContent />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{currentStreak} day streak</p>
          {currentStreak > 0 && <p className="text-xs text-muted-foreground">Keep it up!</p>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-default" data-testid="badge-streak">
              <StreakContent />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentStreak} day streak</p>
            {currentStreak > 0 && <p className="text-xs text-muted-foreground">Keep it up!</p>}
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
}

// Streak milestone celebration component
interface StreakCelebrationProps {
  streak: number;
  onClose: () => void;
}

export function StreakCelebration({ streak, onClose }: StreakCelebrationProps) {
  const getMilestoneMessage = (streak: number) => {
    if (streak === 7) return { title: "1 Week Streak!", emoji: "🔥" };
    if (streak === 14) return { title: "2 Week Streak!", emoji: "⚡" };
    if (streak === 30) return { title: "30 Day Streak!", emoji: "🌟" };
    if (streak === 50) return { title: "50 Day Streak!", emoji: "💪" };
    if (streak === 100) return { title: "100 Day Streak!", emoji: "👑" };
    if (streak === 365) return { title: "1 Year Streak!", emoji: "🏆" };
    return null;
  };

  const milestone = getMilestoneMessage(streak);
  if (!milestone) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-card p-8 rounded-xl shadow-xl text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          {milestone.emoji}
        </motion.div>
        <h2 className="text-2xl font-display font-bold mb-2">{milestone.title}</h2>
        <p className="text-muted-foreground">You've been learning for {streak} days!</p>
        <p className="text-sm text-primary mt-2">Tap to continue</p>
      </motion.div>
    </motion.div>
  );
}
