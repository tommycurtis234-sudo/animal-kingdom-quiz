import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import lionImage from "@assets/generated_images/lion_pack_card.png";
import parrotImage from "@assets/generated_images/parrot_pack_card.png";
import chameleonImage from "@assets/generated_images/chameleon_pack_card.png";
import fishImage from "@assets/generated_images/fish_pack_card_image.png";
import amphibiansImage from "@assets/generated_images/amphibians_pack_card_image.png";
import insectsImage from "@assets/generated_images/insects_pack_card_image.png";
import tigerImage from "@assets/generated_images/tiger_pack_card_image.png";
import sharkImage from "@assets/generated_images/shark_pack_card_image.png";
import jungleImage from "@assets/generated_images/jungle_toucan_pack_card.png";
import arcticImage from "@assets/generated_images/arctic_polar_bear_card.png";

interface PackInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  questionCount: number;
  completed?: boolean;
  progress?: number;
}

interface PackSelectionProps {
  packs: PackInfo[];
  onSelectPack: (packId: string, isMultiplayer?: boolean) => void;
  onViewBadges?: () => void;
}

const packImages: Record<string, string> = {
  mammals: lionImage,
  birds: parrotImage,
  reptiles: chameleonImage,
  fish: fishImage,
  amphibians: amphibiansImage,
  insects: insectsImage,
  "big-cats": tigerImage,
  sharks: sharkImage,
  jungle: jungleImage,
  arctic: arcticImage,
};

export function PackSelection({ packs, onSelectPack, onViewBadges }: PackSelectionProps) {
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(false);

  const handlePackClick = (packId: string) => {
    onSelectPack(packId, isMultiplayerMode);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
            Choose Your Adventure
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a pack to start your animal quiz journey
          </p>
          
          {/* Mode Toggle and Badges */}
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={!isMultiplayerMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsMultiplayerMode(false)}
                className="flex items-center gap-2"
                data-testid="button-single-player-mode"
              >
                <User className="w-4 h-4" />
                Single Player
              </Button>
              <Button
                variant={isMultiplayerMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsMultiplayerMode(true)}
                className="flex items-center gap-2"
                data-testid="button-multiplayer-mode"
              >
                <Users className="w-4 h-4" />
                Multiplayer
              </Button>
            </div>
            
            {onViewBadges && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewBadges}
                className="flex items-center gap-2"
                data-testid="button-view-badges"
              >
                <Award className="w-4 h-4" />
                Badges
              </Button>
            )}
          </div>
        </div>

        {/* Pack Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="overflow-hidden hover-elevate cursor-pointer h-full flex flex-col"
                onClick={() => handlePackClick(pack.id)}
                data-testid={`card-pack-${pack.id}`}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={packImages[pack.id] || lionImage}
                      alt={pack.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-pack-${pack.id}`}
                    />
                    {pack.completed && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <span>✓</span>
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <CardTitle className="text-2xl font-display font-semibold mb-2">
                    {pack.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pack.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span data-testid={`text-question-count-${pack.id}`}>
                      {pack.questionCount} questions
                    </span>
                  </div>
                  {pack.progress !== undefined && pack.progress > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{pack.progress}%</span>
                      </div>
                      <Progress value={pack.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    className="w-full"
                    size="lg"
                    data-testid={`button-select-pack-${pack.id}`}
                  >
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
