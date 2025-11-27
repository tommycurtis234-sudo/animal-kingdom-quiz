import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Target, Award, Home, Coins } from "lucide-react";

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  earnedCoins: number;
  badges?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export function ResultsScreen({
  score,
  totalQuestions,
  correctAnswers,
  earnedCoins,
  badges = [],
  onPlayAgain,
  onBackToHome,
}: ResultsScreenProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect Score!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Great Job!";
    if (percentage >= 40) return "Good Effort!";
    return "Keep Learning!";
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl" data-testid="card-results">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center"
            >
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-4xl font-display font-semibold" data-testid="text-performance-message">
              {getPerformanceMessage()}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              You've completed the quiz!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center space-y-2">
              <div className="text-6xl font-display font-bold text-primary" data-testid="text-score">
                {score}
              </div>
              <p className="text-muted-foreground">Total Score</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-accent/30">
                <CardContent className="p-6 text-center space-y-2">
                  <Target className="w-8 h-8 mx-auto text-primary" />
                  <div className="text-2xl font-bold" data-testid="text-correct-count">
                    {correctAnswers}/{totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </CardContent>
              </Card>

              <Card className="bg-accent/30">
                <CardContent className="p-6 text-center space-y-2">
                  <Target className="w-8 h-8 mx-auto text-primary" />
                  <div className="text-2xl font-bold" data-testid="text-percentage">
                    {percentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-accent/30">
                <CardContent className="p-6 text-center space-y-2">
                  <Coins className="w-8 h-8 mx-auto text-primary" />
                  <div className="text-2xl font-bold" data-testid="text-earned-coins">
                    +{earnedCoins}
                  </div>
                  <p className="text-sm text-muted-foreground">Coins Earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Badges Earned</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm" data-testid={`badge-name-${badge.id}`}>
                              {badge.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {badge.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={onPlayAgain}
                data-testid="button-play-again"
              >
                Play Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={onBackToHome}
                data-testid="button-back-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
