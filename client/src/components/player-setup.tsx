import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Minus, Play } from "lucide-react";
import type { Player } from "@shared/schema";

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

export function PlayerSetup({ onStartGame, onBack }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1"]);

  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(4, playerCount + delta));
    setPlayerCount(newCount);
    
    const newNames = [...playerNames];
    if (newCount > playerNames.length) {
      for (let i = playerNames.length; i < newCount; i++) {
        newNames.push(`Player ${i + 1}`);
      }
    } else {
      newNames.splice(newCount);
    }
    setPlayerNames(newNames);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index + 1}`,
      name: name.trim() || `Player ${index + 1}`,
      score: 0,
      correctAnswers: 0,
      answeredQuestions: [],
    }));
    
    onStartGame(players);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            Player Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player Count Selector */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Number of Players</Label>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePlayerCountChange(-1)}
                disabled={playerCount <= 1}
                data-testid="button-decrease-players"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold text-primary" data-testid="text-player-count">
                  {playerCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {playerCount === 1 ? "Single Player" : "Players"}
                </div>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePlayerCountChange(1)}
                disabled={playerCount >= 4}
                data-testid="button-increase-players"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Player Name Inputs */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Player Names</Label>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <div key={index} className="space-y-1">
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    maxLength={20}
                    data-testid={`input-player-name-${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
              data-testid="button-back"
            >
              Back
            </Button>
            <Button
              onClick={handleStartGame}
              className="flex-1"
              data-testid="button-start-game"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
