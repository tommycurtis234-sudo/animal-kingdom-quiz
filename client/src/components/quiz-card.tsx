import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronRight, Lightbulb, Sparkles, Star, Volume2, Timer, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDifficulty } from "@/contexts/difficulty-context";
import { useAudio } from "@/contexts/audio-context";
import { QuizTimer } from "@/components/quiz-timer";
import type { QuizItem } from "@shared/schema";

interface QuizCardProps {
  item: QuizItem;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: string, isCorrect: boolean, timeSpentMs?: number) => void;
  onSkip: () => void;
  canSkip: boolean;
  currentPlayerName?: string;
  isMultiplayer?: boolean;
  timedMode?: boolean;
  timeLimit?: number; // seconds per question
  onTimeUp?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function QuizCard({
  item,
  questionNumber,
  totalQuestions,
  onAnswer,
  onSkip,
  canSkip,
  currentPlayerName,
  isMultiplayer = false,
  timedMode = false,
  timeLimit = 15,
  onTimeUp,
  isFavorite = false,
  onToggleFavorite,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestionIdRef = useRef<string>(item.id);
  const { difficulty } = useDifficulty();
  
  // Helper to clear any pending timeout
  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  // Reset question start time when question changes - using useLayoutEffect for synchronous update before paint
  useLayoutEffect(() => {
    // Clear any pending timeout first to prevent stale callbacks
    clearPendingTimeout();
    
    // Reset timing refs synchronously
    questionStartTimeRef.current = Date.now();
    currentQuestionIdRef.current = item.id;
    
    // Reset video error state for new question
    setVideoError(false);
    
    // Cleanup on unmount
    return () => {
      clearPendingTimeout();
    };
  }, [item.id, clearPendingTimeout]);
  const { playCorrect, playIncorrect, playClick, playHint, speak, stopSpeaking, playAnimalSound, speechEnabled, soundEnabled } = useAudio();

  // Handle time running out
  const handleTimeUp = useCallback(() => {
    if (showFeedback) return; // Already answered
    
    // Clear any pending timeout first
    clearPendingTimeout();
    
    // Capture time and question ID BEFORE the delay to avoid stale state
    const timeSpentMs = Date.now() - questionStartTimeRef.current;
    const questionIdAtTimeout = currentQuestionIdRef.current;
    
    // Auto-submit wrong answer when time runs out
    playIncorrect();
    setSelectedAnswer(null);
    setShowFeedback(true);
    
    timeoutRef.current = setTimeout(() => {
      // Guard: only submit if we're still on the same question
      if (currentQuestionIdRef.current === questionIdAtTimeout) {
        onAnswer("", false, timeSpentMs);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
      timeoutRef.current = null;
    }, 1500);
    
    onTimeUp?.();
  }, [showFeedback, onAnswer, playIncorrect, onTimeUp, clearPendingTimeout]);
  
  const baseUrl = import.meta.env.BASE_URL || "/";
  const getMediaUrl = (path?: string) => path ? `${baseUrl}${path}` : undefined;
  
  const isKidsMode = difficulty === "kids";
  
  // Speak the question when it changes (if speech is enabled)
  useEffect(() => {
    if (speechEnabled && item.question) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        speak(item.question);
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [item.id, speechEnabled, speak, stopSpeaking, item.question]);
  
  // Reset hint state when question changes
  useEffect(() => {
    setShowHint(false);
  }, [item.id]);
  
  const getHint = () => {
    const answer = item.answer;
    const firstLetter = answer[0].toUpperCase();
    return `The answer starts with "${firstLetter}"`;
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return; // Already answered

    // Clear any pending timeout first
    clearPendingTimeout();

    const timeSpentMs = Date.now() - questionStartTimeRef.current;
    const questionIdAtAnswer = currentQuestionIdRef.current;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === item.answer;
    
    // Stop any speaking
    stopSpeaking();
    
    // Play sound effect
    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }

    // Wait for feedback animation, then proceed
    timeoutRef.current = setTimeout(() => {
      // Guard: only submit if we're still on the same question
      if (currentQuestionIdRef.current === questionIdAtAnswer) {
        onAnswer(answer, isCorrect, timeSpentMs);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
      timeoutRef.current = null;
    }, 1500);
  };
  
  const handleHintClick = () => {
    playHint();
    setShowHint(true);
  };
  
  const handlePlayAnimalSound = () => {
    if (item.media?.sound) {
      playAnimalSound(getMediaUrl(item.media.sound) || "");
    }
  };

  const getButtonVariant = (option: string) => {
    if (!showFeedback) return "outline";
    if (option === item.answer) return "default"; // Correct answer highlighted
    if (option === selectedAnswer && option !== item.answer)
      return "destructive"; // Wrong selection
    return "outline";
  };

  const getButtonIcon = (option: string) => {
    if (!showFeedback) return null;
    if (option === item.answer)
      return <Check className="w-5 h-5" data-testid="icon-correct" />;
    if (option === selectedAnswer && option !== item.answer)
      return <X className="w-5 h-5" data-testid="icon-incorrect" />;
    return null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card className="max-w-2xl mx-auto shadow-xl" data-testid={`card-quiz-${item.id}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b gap-2">
            <Badge variant="secondary" className="text-sm font-semibold" data-testid="badge-question-number">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            
            <div className="flex items-center gap-2">
              {/* Timer */}
              {timedMode && (
                <QuizTimer
                  isRunning={!showFeedback}
                  timeLimit={timeLimit}
                  onTimeUp={handleTimeUp}
                  showElapsed={false}
                  size="md"
                />
              )}
              
              {/* Favorite Button */}
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                  className={`${
                    isFavorite
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-red-500"
                  }`}
                  data-testid="button-toggle-favorite"
                >
                  <motion.div
                    initial={false}
                    animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </motion.div>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearPendingTimeout();
                  onSkip();
                }}
                disabled={!canSkip || showFeedback}
                className="text-muted-foreground flex items-center gap-1"
                data-testid="button-skip"
              >
                <span>Skip</span>
                <span className="text-xs">(-2 coins)</span>
              </Button>
            </div>
          </div>

          {/* Current Player Indicator for Multiplayer */}
          {isMultiplayer && currentPlayerName && (
            <div className="px-4 pt-3">
              <div className="flex items-center justify-center gap-2 bg-primary/10 rounded-lg p-2">
                <span className="text-sm font-semibold text-primary" data-testid="text-current-player">
                  {currentPlayerName}'s Turn
                </span>
              </div>
            </div>
          )}

          {/* Media Section */}
          {(item.media?.video || item.media?.image) && (
            <div className="relative aspect-video bg-muted overflow-hidden">
              {item.media.video && !videoError ? (
                <video
                  className="w-full h-full object-cover"
                  poster={getMediaUrl(item.media.image)}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  onError={(e) => {
                    const videoEl = e.currentTarget as HTMLVideoElement;
                    console.error("Video error details:", {
                      url: getMediaUrl(item.media?.video),
                      error: videoEl.error?.message || "Unknown error",
                      code: videoEl.error?.code,
                      networkState: videoEl.networkState,
                      readyState: videoEl.readyState
                    });
                    setVideoError(true);
                  }}
                  onLoadStart={() => console.log("VIDEO LOADING:", getMediaUrl(item.media?.video))}
                  onCanPlay={() => console.log("VIDEO CAN PLAY:", getMediaUrl(item.media?.video))}
                  onLoadedData={() => console.log("VIDEO LOADED:", getMediaUrl(item.media?.video))}
                  data-testid="video-quiz-media"
                >
                  {/* WebM for broader browser support (VP9 codec) */}
                  <source src={getMediaUrl(item.media.video.replace('.mp4', '.webm'))} type="video/webm" />
                  {/* MP4 fallback for Safari and other browsers with H.264 support */}
                  <source src={getMediaUrl(item.media.video)} type="video/mp4" />
                </video>
              ) : item.media.image ? (
                <img
                  src={getMediaUrl(item.media.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  data-testid="img-quiz-media"
                />
              ) : null}
              
              {/* Animal Sound Button - overlaid on media */}
              {item.media?.sound && soundEnabled && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handlePlayAnimalSound}
                  className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  aria-label={`Hear ${item.name} sound`}
                  data-testid="button-animal-sound"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Fun Fact */}
            <div className="bg-accent/30 rounded-lg p-4" data-testid="section-fact">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Fun Fact:
              </p>
              <p className="text-base" data-testid="text-fact">
                {item.fact}
              </p>
            </div>

            {/* Question */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4" data-testid="text-question">
                {item.question}
              </h2>

              {/* Kids Mode Hint Button */}
              {isKidsMode && !showFeedback && (
                <div className="mb-4">
                  {!showHint ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHintClick}
                      className="text-primary border-primary/30 hover:bg-primary/10"
                      data-testid="button-hint"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Need a hint?
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 py-2"
                      data-testid="text-hint"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">{getHint()}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Answer Options */}
              <div className="grid gap-3 md:grid-cols-2">
                {item.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getButtonVariant(option)}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className="h-auto p-4 text-left justify-between hover:scale-[1.02] transition-transform"
                    data-testid={`button-answer-${index}`}
                  >
                    <span className="flex-1">{option}</span>
                    {getButtonIcon(option)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    selectedAnswer === item.answer
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                  data-testid="feedback-message"
                >
                  {selectedAnswer === item.answer ? (
                    <>
                      {isKidsMode ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      <span className="font-semibold">
                        {isKidsMode ? "Amazing! You got it right!" : "Correct! Great job!"}
                      </span>
                      {isKidsMode && <Star className="w-4 h-4 ml-1" />}
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span className="font-semibold">
                        {isKidsMode 
                          ? `Good try! It was: ${item.answer}` 
                          : `The correct answer is: ${item.answer}`}
                      </span>
                    </>
                  )}
                  <ChevronRight className="w-5 h-5 ml-auto animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
