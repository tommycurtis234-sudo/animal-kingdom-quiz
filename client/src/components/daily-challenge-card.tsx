import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Check, Clock, Gift } from "lucide-react";
import { motion } from "framer-motion";
import type { DailyChallenge, Pack } from "@shared/schema";

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  pack: Pack | undefined;
  isCompleted: boolean;
  onStart: () => void;
}

export function DailyChallengeCard({
  challenge,
  pack,
  isCompleted,
  onStart,
}: DailyChallengeCardProps) {
  const packName = pack?.name || challenge.packId;
  const questionCount = challenge.questionIds.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card 
        className={`relative overflow-hidden ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30'}`}
        data-testid="card-daily-challenge"
      >
        {/* Decorative star pattern */}
        <div className="absolute top-2 right-2 opacity-10">
          <Star className="w-16 h-16 text-primary" />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Daily Challenge</CardTitle>
            </div>
            {isCompleted ? (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Check className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            ) : (
              <Badge variant="secondary" className="animate-pulse">
                <Gift className="w-3 h-3 mr-1" />
                New!
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Today's challenge from the <span className="font-semibold text-foreground">{packName}</span> pack
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{questionCount} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>+50 bonus XP</span>
              </div>
            </div>
          </div>
          
          {isCompleted ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">{challenge.score || 0} points</span>
              </div>
              {challenge.timeSpent && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold">
                    {Math.floor(challenge.timeSpent / 1000)}s
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">
                Come back tomorrow for a new challenge!
              </p>
            </div>
          ) : (
            <Button 
              onClick={onStart} 
              className="w-full"
              data-testid="button-start-daily-challenge"
            >
              <Star className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Compact version for toolbar/header
interface DailyChallengeIndicatorProps {
  isCompleted: boolean;
  onClick: () => void;
}

export function DailyChallengeIndicator({ isCompleted, onClick }: DailyChallengeIndicatorProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`relative ${!isCompleted ? 'animate-pulse' : ''}`}
      data-testid="button-daily-challenge-indicator"
    >
      <Calendar className="w-5 h-5" />
      {!isCompleted && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
      )}
    </Button>
  );
}
