import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Lock, Sparkles, Crown, Flame, Target, Zap, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Confetti } from "./confetti";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface EnhancedBadge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  rarity: BadgeRarity;
  category: "progress" | "streak" | "speed" | "mastery" | "special";
  requirement: string;
  reward: { coins: number; xp: number };
  isUnlocked?: boolean;
  unlockedAt?: Date;
}

// Enhanced badge definitions with rarity
export const enhancedBadgeDefinitions: EnhancedBadge[] = [
  // Progress badges
  { id: "first-steps", name: "First Steps", description: "Complete your first quiz", icon: Star, rarity: "common", category: "progress", requirement: "Complete 1 quiz", reward: { coins: 10, xp: 25 } },
  { id: "pack-explorer", name: "Pack Explorer", description: "Complete 3 different packs", icon: Target, rarity: "common", category: "progress", requirement: "Complete 3 packs", reward: { coins: 25, xp: 50 } },
  { id: "knowledge-seeker", name: "Knowledge Seeker", description: "Answer 100 questions", icon: Zap, rarity: "rare", category: "progress", requirement: "Answer 100 questions", reward: { coins: 50, xp: 100 } },
  { id: "centurion", name: "Centurion", description: "Answer 500 questions", icon: Award, rarity: "epic", category: "progress", requirement: "Answer 500 questions", reward: { coins: 200, xp: 500 } },
  { id: "grand-master", name: "Grand Master", description: "Answer 1000 questions", icon: Crown, rarity: "legendary", category: "progress", requirement: "Answer 1000 questions", reward: { coins: 500, xp: 1000 } },

  // Streak badges
  { id: "week-warrior", name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, rarity: "common", category: "streak", requirement: "7-day streak", reward: { coins: 25, xp: 50 } },
  { id: "fortnight-fighter", name: "Fortnight Fighter", description: "Maintain a 14-day streak", icon: Flame, rarity: "rare", category: "streak", requirement: "14-day streak", reward: { coins: 75, xp: 150 } },
  { id: "monthly-master", name: "Monthly Master", description: "Maintain a 30-day streak", icon: Flame, rarity: "epic", category: "streak", requirement: "30-day streak", reward: { coins: 200, xp: 400 } },
  { id: "streak-legend", name: "Streak Legend", description: "Maintain a 100-day streak", icon: Crown, rarity: "legendary", category: "streak", requirement: "100-day streak", reward: { coins: 1000, xp: 2000 } },

  // Speed badges
  { id: "quick-thinker", name: "Quick Thinker", description: "Answer 10 questions under 5 seconds each", icon: Clock, rarity: "rare", category: "speed", requirement: "10 fast answers", reward: { coins: 50, xp: 100 } },
  { id: "lightning-fast", name: "Lightning Fast", description: "Complete a pack in under 3 minutes", icon: Zap, rarity: "epic", category: "speed", requirement: "Pack under 3 min", reward: { coins: 150, xp: 300 } },

  // Mastery badges
  { id: "perfect-pack", name: "Perfect Pack", description: "Get 100% on any pack", icon: Star, rarity: "rare", category: "mastery", requirement: "100% accuracy", reward: { coins: 75, xp: 150 } },
  { id: "triple-perfect", name: "Triple Perfect", description: "Get 3 perfect scores", icon: Trophy, rarity: "epic", category: "mastery", requirement: "3 perfect scores", reward: { coins: 200, xp: 400 } },
  { id: "flawless-master", name: "Flawless Master", description: "Get perfect on all 6 packs", icon: Crown, rarity: "legendary", category: "mastery", requirement: "All packs perfect", reward: { coins: 1000, xp: 2000 } },

  // Special badges
  { id: "night-owl", name: "Night Owl", description: "Play between midnight and 5 AM", icon: Star, rarity: "rare", category: "special", requirement: "Play late night", reward: { coins: 30, xp: 60 } },
  { id: "early-bird", name: "Early Bird", description: "Play between 5 AM and 7 AM", icon: Sparkles, rarity: "rare", category: "special", requirement: "Play early morning", reward: { coins: 30, xp: 60 } },
  { id: "weekend-warrior", name: "Weekend Warrior", description: "Complete 5 packs on a weekend", icon: Trophy, rarity: "epic", category: "special", requirement: "5 weekend packs", reward: { coins: 100, xp: 200 } },
];

const rarityColors: Record<BadgeRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", glow: "" },
  rare: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  epic: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/30" },
  legendary: { bg: "bg-gradient-to-br from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30", text: "text-yellow-400", glow: "shadow-yellow-500/40" },
};

const categoryIcons: Record<string, typeof Trophy> = {
  progress: Target,
  streak: Flame,
  speed: Clock,
  mastery: Star,
  special: Sparkles,
};

interface BadgeCardProps {
  badge: EnhancedBadge;
  onClick?: () => void;
}

export function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const colors = rarityColors[badge.rarity];
  const Icon = badge.icon;
  const isUnlocked = badge.isUnlocked;

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05, y: -2 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`relative cursor-pointer ${!isUnlocked ? "opacity-50 grayscale" : ""}`}
      data-testid={`badge-${badge.id}`}
    >
      <div className={`p-4 rounded-xl border-2 ${colors.bg} ${colors.border} ${isUnlocked ? `shadow-lg ${colors.glow}` : ""}`}>
        {/* Rarity indicator */}
        <div className="absolute -top-2 -right-2">
          <BadgeUI variant="secondary" className={`text-xs px-1.5 ${colors.text} capitalize`}>
            {badge.rarity}
          </BadgeUI>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-2">
          {isUnlocked ? (
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon className={`w-10 h-10 ${colors.text}`} />
            </motion.div>
          ) : (
            <Lock className="w-10 h-10 text-muted-foreground" />
          )}
        </div>

        {/* Name */}
        <h4 className={`text-sm font-bold text-center ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
          {badge.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-center text-muted-foreground mt-1 line-clamp-2">
          {badge.description}
        </p>

        {/* Reward preview */}
        {!isUnlocked && (
          <div className="flex justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>🪙 {badge.reward.coins}</span>
            <span>⚡ {badge.reward.xp}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface BadgeGalleryProps {
  unlockedBadges: string[];
  onBadgeClick?: (badge: EnhancedBadge) => void;
}

export function BadgeGallery({ unlockedBadges, onBadgeClick }: BadgeGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "progress", "streak", "speed", "mastery", "special"];
  
  const filteredBadges = enhancedBadgeDefinitions
    .map(b => ({ ...b, isUnlocked: unlockedBadges.includes(b.id) }))
    .filter(b => selectedCategory === "all" || b.category === selectedCategory)
    .sort((a, b) => {
      // Sort: unlocked first, then by rarity
      if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1;
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

  const unlockedCount = enhancedBadgeDefinitions.filter(b => unlockedBadges.includes(b.id)).length;

  return (
    <Card className="w-full" data-testid="badge-gallery">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Badges
          </CardTitle>
          <BadgeUI variant="secondary">
            {unlockedCount} / {enhancedBadgeDefinitions.length}
          </BadgeUI>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {categories.map(cat => {
            const CatIcon = cat === "all" ? Trophy : categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid={`filter-${cat}`}
              >
                <CatIcon className="w-3 h-3" />
                {cat}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BadgeCard 
                badge={badge} 
                onClick={() => onBadgeClick?.(badge)}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Badge unlock animation overlay
export function BadgeUnlockAnimation({
  badge,
  onComplete
}: {
  badge: EnhancedBadge;
  onComplete?: () => void;
}) {
  const colors = rarityColors[badge.rarity];
  const Icon = badge.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onComplete}
        data-testid="badge-unlock-animation"
      >
        <Confetti 
          active={true}
          colors={
            badge.rarity === "legendary" 
              ? ["#ffd700", "#ffaa00", "#ffeaa7"]
              : badge.rarity === "epic"
              ? ["#9b59b6", "#8e44ad", "#be2edd"]
              : badge.rarity === "rare"
              ? ["#3498db", "#2980b9", "#00cec9"]
              : ["#95a5a6", "#7f8c8d", "#bdc3c7"]
          }
          particleCount={badge.rarity === "legendary" ? 100 : 50}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className={`${colors.bg} ${colors.border} border-2 rounded-3xl p-8 text-center max-w-sm mx-4 ${
            badge.rarity === "legendary" ? "shadow-2xl shadow-yellow-500/30" : ""
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-4"
          >
            <div className={`inline-block p-4 rounded-full ${colors.bg}`}>
              <Icon className={`w-16 h-16 ${colors.text}`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BadgeUI className={`${colors.text} mb-2 capitalize`}>
              {badge.rarity} Badge
            </BadgeUI>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {badge.name}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {badge.description}
            </p>

            {/* Rewards */}
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-xl">🪙</span>
                <span className="font-bold text-yellow-500">+{badge.reward.coins}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl">⚡</span>
                <span className="font-bold text-blue-500">+{badge.reward.xp}</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-muted-foreground mt-4"
          >
            Tap to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
