import { motion } from "framer-motion";
import { Lock, Star, CheckCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pack } from "@shared/schema";

interface AnimatedPackCardProps {
  pack: Pack;
  isCompleted: boolean;
  isLocked: boolean;
  bestScore?: number;
  accuracy?: number;
  onClick: () => void;
  index: number;
}

const packIcons: Record<string, string> = {
  mammals: "🦁",
  birds: "🦅",
  reptiles: "🦎",
  fish: "🐠",
  amphibians: "🐸",
  insects: "🦋",
  favorites: "❤️",
  review: "📚",
};

const packGradients: Record<string, string> = {
  mammals: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
  birds: "from-sky-500/20 via-blue-500/10 to-cyan-500/20",
  reptiles: "from-emerald-500/20 via-green-500/10 to-lime-500/20",
  fish: "from-blue-500/20 via-indigo-500/10 to-purple-500/20",
  amphibians: "from-green-500/20 via-teal-500/10 to-emerald-500/20",
  insects: "from-purple-500/20 via-pink-500/10 to-rose-500/20",
};

export function AnimatedPackCard({
  pack,
  isCompleted,
  isLocked,
  bestScore,
  accuracy,
  onClick,
  index
}: AnimatedPackCardProps) {
  const icon = packIcons[pack.id] || "🐾";
  const gradient = packGradients[pack.id] || "from-primary/20 via-primary/10 to-primary/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={!isLocked ? { 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
          isLocked ? "opacity-60 grayscale" : ""
        } hover-elevate`}
        onClick={!isLocked ? onClick : undefined}
        data-testid={`pack-card-${pack.id}`}
      >
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ["-100%", "200%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative p-6">
          {/* Status badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Badge variant="default" className="bg-green-500/90 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              </motion.div>
            )}
            {isLocked && (
              <Badge variant="secondary" className="bg-gray-500/90 text-white">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>

          {/* Icon with animation */}
          <motion.div
            className="text-5xl mb-4"
            animate={{
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            {icon}
          </motion.div>

          {/* Pack name */}
          <h3 className="text-xl font-bold text-foreground mb-1 font-display">
            {pack.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {pack.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {pack.items.length} questions
            </span>
            {bestScore !== undefined && bestScore > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                Best: {bestScore}%
              </span>
            )}
          </div>

          {/* Progress bar for accuracy */}
          {accuracy !== undefined && accuracy > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Accuracy</span>
                <span>{accuracy}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-primary/5 blur-xl" />
      </Card>
    </motion.div>
  );
}

// Grid container for pack cards
export function PackGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {children}
    </div>
  );
}
