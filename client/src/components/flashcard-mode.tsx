import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, BookOpen, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Pack, QuizItem } from "@shared/schema";

interface FlashcardModeProps {
  pack: Pack;
  onExit: () => void;
}

export function FlashcardMode({ pack, onExit }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [shuffledItems, setShuffledItems] = useState<QuizItem[]>(pack.items);

  const currentCard = shuffledItems[currentIndex];
  const progress = (studiedCards.size / shuffledItems.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards(prev => {
        const newSet = new Set(prev);
        newSet.add(currentCard.id);
        return newSet;
      });
    }
  }, [isFlipped, currentCard.id]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => 
        prev < shuffledItems.length - 1 ? prev + 1 : 0
      );
    }, 150);
  }, [shuffledItems.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => 
        prev > 0 ? prev - 1 : shuffledItems.length - 1
      );
    }, 150);
  }, [shuffledItems.length]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setShuffledItems([...pack.items].sort(() => Math.random() - 0.5));
  }, [pack.items]);

  const handleReset = useCallback(() => {
    setStudiedCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  return (
    <div className="flex flex-col h-full p-4" data-testid="flashcard-mode">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Flashcards: {pack.name}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onExit} data-testid="button-exit-flashcards">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Studied: {studiedCards.size} / {shuffledItems.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div 
          className="w-full max-w-md aspect-[3/4] perspective-1000 cursor-pointer"
          onClick={handleFlip}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${isFlipped}`}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Card className={`w-full h-full flex flex-col items-center justify-center p-6 ${
                isFlipped 
                  ? "bg-gradient-to-br from-primary/10 to-primary/5" 
                  : "bg-gradient-to-br from-muted/50 to-background"
              }`}>
                {!isFlipped ? (
                  // Front of card - Question
                  <div className="text-center space-y-4">
                    {/* Animal image */}
                    {currentCard.media?.image && (
                      <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden bg-muted">
                        <img
                          src={currentCard.media.image}
                          alt="Animal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        {currentCard.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tap to reveal answer
                      </p>
                    </div>

                    {/* Hint indicator */}
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Lightbulb className="w-3 h-3" />
                      <span>Think about it first...</span>
                    </div>
                  </div>
                ) : (
                  // Back of card - Answer + Fact
                  <div className="text-center space-y-4">
                    <div className="bg-primary/20 rounded-xl px-6 py-3">
                      <p className="text-sm text-muted-foreground">Answer</p>
                      <p className="text-2xl font-bold text-primary">
                        {currentCard.answer}
                      </p>
                    </div>

                    {currentCard.fact && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Fun Fact</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {currentCard.fact}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Tap to flip back
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Card counter */}
      <div className="text-center text-sm text-muted-foreground mb-4">
        Card {currentIndex + 1} of {shuffledItems.length}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          data-testid="button-prev-card"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleShuffle}
          data-testid="button-shuffle"
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          data-testid="button-reset-flashcards"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          data-testid="button-next-card"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Use arrow keys to navigate, Space to flip
      </p>
    </div>
  );
}

// Mini flashcard preview button
export function FlashcardButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="gap-2"
      data-testid="button-flashcard-mode"
    >
      <BookOpen className="w-4 h-4" />
      Study Mode
    </Button>
  );
}
