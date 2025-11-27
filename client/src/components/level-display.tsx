import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateLevel, getXpForNextLevel, getLevelName, LEVEL_THRESHOLDS } from "@shared/schema";

interface LevelDisplayProps {
  xp: number;
  level: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LevelDisplay({
  xp,
  level,
  showProgress = false,
  size = "md",
}: LevelDisplayProps) {
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercent = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
  const levelName = getLevelName(currentLevel);
  
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

  if (showProgress) {
    return (
      <div className="space-y-2" data-testid="level-progress">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className={`${iconSizes[size]} text-yellow-500`} />
            <span className="font-semibold">Level {currentLevel}</span>
            <span className="text-muted-foreground text-sm">{levelName}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {xpInCurrentLevel} / {xpNeededForNextLevel} XP
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className="cursor-default" data-testid="badge-level">
          <div className={`flex items-center ${sizeClasses[size]}`}>
            <Star className={`${iconSizes[size]} text-yellow-500`} />
            <span className="font-semibold">{currentLevel}</span>
          </div>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-semibold">{levelName}</p>
          <p className="text-xs text-muted-foreground">
            {xpInCurrentLevel} / {xpNeededForNextLevel} XP to next level
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Level up celebration component
interface LevelUpCelebrationProps {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpCelebration({ newLevel, onClose }: LevelUpCelebrationProps) {
  const levelName = getLevelName(newLevel);

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
        className="bg-card p-8 rounded-xl shadow-xl text-center max-w-sm"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold mb-2">Level Up!</h2>
        <p className="text-xl text-primary font-semibold mb-1">Level {newLevel}</p>
        <p className="text-muted-foreground">{levelName}</p>
        <p className="text-sm text-muted-foreground mt-4">Tap to continue</p>
      </motion.div>
    </motion.div>
  );
}

// XP gained animation
interface XpGainedProps {
  amount: number;
  className?: string;
}

export function XpGained({ amount, className = "" }: XpGainedProps) {
  if (amount <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: -20 }}
      transition={{ duration: 1.5 }}
      className={`text-primary font-semibold ${className}`}
    >
      +{amount} XP
    </motion.div>
  );
}
