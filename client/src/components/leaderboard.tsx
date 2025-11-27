import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  level: number;
  streak: number;
  country?: string;
  isCurrentUser?: boolean;
}

// Generate realistic-looking leaderboard data
const generateLeaderboardData = (currentUserScore: number, currentUserLevel: number): LeaderboardEntry[] => {
  const names = [
    "WildExplorer", "AnimalWhiz", "NatureLover", "SafariKing", "ZooMaster",
    "WildlifeGuru", "JungleQueen", "OceanDiver", "BirdWatcher", "ReptileFan",
    "InsectHunter", "FrogFinder", "FishFriend", "MammalMaster", "CreatureKing",
    "BeastBuddy", "AnimalAce", "WildWonder", "NatureNinja", "ZooZapper"
  ];
  
  const countries = ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇯🇵", "🇧🇷", "🇮🇳", "🇲🇽"];
  
  const entries: LeaderboardEntry[] = [];
  
  // Generate top players
  for (let i = 0; i < 10; i++) {
    const baseScore = Math.max(5000 - i * 400, 500);
    const variance = Math.floor(Math.random() * 200);
    entries.push({
      rank: i + 1,
      name: names[i],
      score: baseScore + variance,
      level: Math.max(15 - Math.floor(i / 2), 5),
      streak: Math.max(30 - i * 2, 3),
      country: countries[Math.floor(Math.random() * countries.length)]
    });
  }
  
  // Find where current user would rank
  let userRank = entries.findIndex(e => e.score < currentUserScore);
  if (userRank === -1) userRank = entries.length;
  
  // Insert current user if they'd be in top 10
  if (userRank < 10 && currentUserScore > 0) {
    entries.splice(userRank, 0, {
      rank: userRank + 1,
      name: "You",
      score: currentUserScore,
      level: currentUserLevel,
      streak: 0,
      isCurrentUser: true
    });
    // Recalculate ranks
    entries.forEach((e, i) => e.rank = i + 1);
    // Keep only top 10
    entries.splice(10);
  } else if (currentUserScore > 0) {
    // Add user at the end with their actual rank
    entries.push({
      rank: userRank + 1,
      name: "You",
      score: currentUserScore,
      level: currentUserLevel,
      streak: 0,
      isCurrentUser: true
    });
  }
  
  return entries;
};

interface LeaderboardProps {
  userScore: number;
  userLevel: number;
  onClose?: () => void;
}

export function Leaderboard({ userScore, userLevel, onClose }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"weekly" | "allTime">("weekly");
  const entries = generateLeaderboardData(userScore, userLevel);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) return "bg-primary/20 border-primary/50";
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-300/10 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-testid="leaderboard">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
        
        {/* Timeframe toggle */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={timeframe === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("weekly")}
            className="flex-1"
            data-testid="button-weekly"
          >
            <Calendar className="w-4 h-4 mr-1" />
            This Week
          </Button>
          <Button
            variant={timeframe === "allTime" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("allTime")}
            className="flex-1"
            data-testid="button-alltime"
          >
            <Star className="w-4 h-4 mr-1" />
            All Time
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={timeframe}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {entries.map((entry, index) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBg(entry.rank, entry.isCurrentUser)}`}
                data-testid={`leaderboard-entry-${entry.rank}`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={entry.isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                    {entry.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${entry.isCurrentUser ? "text-primary" : ""}`}>
                      {entry.name}
                    </span>
                    {entry.country && <span className="text-sm">{entry.country}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      Lv.{entry.level}
                    </Badge>
                    {entry.streak > 0 && (
                      <span className="flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {entry.streak}d
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Score */}
                <div className="text-right">
                  <div className="font-bold text-foreground">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* User's position if not in top 10 */}
        {entries.length > 10 && entries[entries.length - 1]?.isCurrentUser && (
          <div className="pt-2 border-t border-dashed">
            <p className="text-center text-sm text-muted-foreground">
              Keep playing to climb the ranks!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
