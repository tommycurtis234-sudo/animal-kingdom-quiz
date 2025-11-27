import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuizTimerProps {
  isRunning: boolean;
  timeLimit?: number; // seconds, undefined = no limit (just tracking)
  onTimeUp?: () => void;
  onTick?: (elapsedMs: number) => void;
  showElapsed?: boolean;
  size?: "sm" | "md" | "lg";
}

export function QuizTimer({
  isRunning,
  timeLimit,
  onTimeUp,
  onTick,
  showElapsed = true,
  size = "md",
}: QuizTimerProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Reset and start timer
  useEffect(() => {
    if (isRunning) {
      setStartTime(Date.now());
      setElapsedMs(0);
    } else {
      setStartTime(null);
    }
  }, [isRunning]);

  // Update elapsed time
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const newElapsed = Date.now() - startTime;
      setElapsedMs(newElapsed);
      onTick?.(newElapsed);

      // Check time limit
      if (timeLimit && newElapsed >= timeLimit * 1000) {
        onTimeUp?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, timeLimit, onTimeUp, onTick]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}.${tenths}`;
  };

  const remainingMs = timeLimit ? Math.max(0, timeLimit * 1000 - elapsedMs) : 0;
  const isLowTime = timeLimit && remainingMs < 10000; // Less than 10 seconds

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (!showElapsed && !timeLimit) return null;

  return (
    <div className="flex items-center gap-2" data-testid="quiz-timer">
      {timeLimit ? (
        <motion.div
          animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
        >
          <Badge 
            variant={isLowTime ? "destructive" : "secondary"}
            className={`${sizeClasses[size]} font-mono`}
          >
            <Timer className={`${iconSizes[size]} mr-1`} />
            {formatTime(remainingMs)}
          </Badge>
        </motion.div>
      ) : showElapsed ? (
        <Badge variant="outline" className={`${sizeClasses[size]} font-mono`}>
          <Clock className={`${iconSizes[size]} mr-1`} />
          {formatTime(elapsedMs)}
        </Badge>
      ) : null}
    </div>
  );
}

// Question timer for tracking individual question times
interface QuestionTimerProps {
  questionIndex: number;
  onAnswered: (timeMs: number) => void;
}

export function useQuestionTimer() {
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const resetTimer = useCallback(() => {
    setQuestionStartTime(Date.now());
  }, []);

  const getElapsedTime = useCallback(() => {
    return Date.now() - questionStartTime;
  }, [questionStartTime]);

  return { resetTimer, getElapsedTime };
}

// Timed mode selector component
interface TimedModeSelectorProps {
  enabled: boolean;
  timeLimit: number; // seconds per question
  onToggle: () => void;
  onTimeLimitChange: (seconds: number) => void;
}

export function TimedModeSelector({
  enabled,
  timeLimit,
  onToggle,
  onTimeLimitChange,
}: TimedModeSelectorProps) {
  const timeLimits = [
    { value: 10, label: "10s" },
    { value: 15, label: "15s" },
    { value: 20, label: "20s" },
    { value: 30, label: "30s" },
  ];

  return (
    <div className="flex items-center gap-2" data-testid="timed-mode-selector">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${enabled 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted hover:bg-muted/80"
          }`}
        data-testid="button-toggle-timed-mode"
      >
        <Zap className="w-4 h-4" />
        Timed
      </button>
      
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex gap-1 overflow-hidden"
          >
            {timeLimits.map((limit) => (
              <button
                key={limit.value}
                onClick={() => onTimeLimitChange(limit.value)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors
                  ${timeLimit === limit.value
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/50 hover:bg-muted"
                  }`}
                data-testid={`button-time-limit-${limit.value}`}
              >
                {limit.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
