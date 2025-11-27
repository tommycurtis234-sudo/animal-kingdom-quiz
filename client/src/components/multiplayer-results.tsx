import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Home, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { Player } from "@shared/schema";

interface MultiplayerResultsProps {
  players: Player[];
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export function MultiplayerResults({
  players,
  onPlayAgain,
  onBackToHome,
}: MultiplayerResultsProps) {
  // Sort players by score (descending) and then by correct answers
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correctAnswers - a.correctAnswers;
  });

  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.filter(p => p.score === winner.score).length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden">
          <CardHeader className="text-center space-y-4 bg-gradient-to-br from-primary/10 to-primary/5 pb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" data-testid="icon-trophy" />
              </div>
            </motion.div>
            
            <CardTitle className="text-3xl md:text-4xl font-display" data-testid="text-title">
              {isTie ? "It's a Tie!" : `${winner.name} Wins!`}
            </CardTitle>
            
            {!isTie && (
              <p className="text-lg text-muted-foreground" data-testid="text-winner-subtitle">
                Congratulations on your victory!
              </p>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Player Rankings */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">Final Standings</h3>
              {sortedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  data-testid={`card-player-result-${player.id}`}
                >
                  <Card className={`
                    ${index === 0 && !isTie ? 'border-primary/50 bg-primary/5' : ''}
                    ${index === 0 && isTie && player.score === winner.score ? 'border-primary/50 bg-primary/5' : ''}
                  `}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {index === 0 && (
                            <Trophy className="w-6 h-6 text-primary" />
                          )}
                          {index === 1 && players.length > 2 && (
                            <Medal className="w-6 h-6 text-orange-500" />
                          )}
                          {index === 2 && players.length > 3 && (
                            <Medal className="w-6 h-6 text-amber-700" />
                          )}
                          {(index > 2 || (index > 0 && players.length <= 2 + index)) && (
                            <span className="text-lg font-semibold text-muted-foreground">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="font-semibold text-lg" data-testid={`text-player-name-${player.id}`}>
                            {player.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.correctAnswers} correct answer{player.correctAnswers !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary" data-testid={`text-player-score-${player.id}`}>
                            {player.score}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onBackToHome}
                className="flex-1"
                data-testid="button-back-to-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={onPlayAgain}
                className="flex-1"
                data-testid="button-play-again"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
