import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Trophy, Zap, Crown } from "lucide-react";
import { Confetti } from "./confetti";

interface StreakCelebrationProps {
  streakDays: number;
  isNewMilestone: boolean;
  bonusCoins: number;
  onComplete?: () => void;
}

const milestones = [
  { days: 3, title: "Getting Started!", icon: Flame, color: "text-orange-400" },
  { days: 7, title: "Week Warrior!", icon: Star, color: "text-yellow-500" },
  { days: 14, title: "Dedicated Learner!", icon: Trophy, color: "text-purple-500" },
  { days: 30, title: "Monthly Master!", icon: Crown, color: "text-amber-500" },
  { days: 60, title: "Knowledge Seeker!", icon: Zap, color: "text-blue-500" },
  { days: 100, title: "Streak Legend!", icon: Crown, color: "text-yellow-400" },
];

export function StreakCelebration({
  streakDays,
  isNewMilestone,
  bonusCoins,
  onComplete
}: StreakCelebrationProps) {
  const currentMilestone = milestones.findLast(m => streakDays >= m.days);
  const nextMilestone = milestones.find(m => m.days > streakDays);
  const Icon = currentMilestone?.icon || Flame;

  if (!isNewMilestone) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onComplete}
        data-testid="streak-celebration"
      >
        <Confetti 
          active={true} 
          colors={["#ff6b6b", "#feca57", "#ff9ff3", "#ffeaa7", "#ff7979"]}
          particleCount={60}
        />
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/20 backdrop-blur-md border border-orange-500/30 rounded-3xl p-8 text-center max-w-sm mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated fire ring */}
          <motion.div
            className="relative inline-block mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/50 to-red-500/50 blur-xl rounded-full" />
            <div className={`relative text-7xl p-4 ${currentMilestone?.color || "text-orange-500"}`}>
              <Icon className="w-16 h-16" />
            </div>
          </motion.div>

          {/* Streak count with fire effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-2"
          >
            <span className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              {streakDays}
            </span>
            <span className="text-2xl ml-1 text-orange-400">🔥</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-1"
          >
            Day Streak!
          </motion.h2>

          {currentMilestone && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-orange-400 font-medium mb-3"
            >
              {currentMilestone.title}
            </motion.p>
          )}

          {/* Bonus reward */}
          {bonusCoins > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-2 inline-flex items-center gap-2 mb-4"
            >
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-bold text-yellow-500">+{bonusCoins}</span>
              <span className="text-sm text-yellow-400">Bonus!</span>
            </motion.div>
          )}

          {/* Next milestone preview */}
          {nextMilestone && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              Next milestone: {nextMilestone.days} days ({nextMilestone.title})
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground mt-4"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact streak display for toolbar/header
export function StreakBadge({ 
  streakDays, 
  onClick 
}: { 
  streakDays: number;
  onClick?: () => void;
}) {
  const isHot = streakDays >= 7;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
        isHot 
          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30" 
          : "bg-muted border border-border"
      }`}
      data-testid="streak-badge"
    >
      <motion.span
        animate={isHot ? { 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.5, repeat: isHot ? Infinity : 0, repeatDelay: 2 }}
      >
        🔥
      </motion.span>
      <span className={`font-bold ${isHot ? "text-orange-500" : "text-foreground"}`}>
        {streakDays}
      </span>
    </motion.button>
  );
}
