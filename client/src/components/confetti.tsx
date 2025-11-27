import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: "square" | "circle" | "star" | "triangle";
  delay: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
  onComplete?: () => void;
}

const SHAPES = ["square", "circle", "star", "triangle"] as const;

const DEFAULT_COLORS = [
  "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff",
  "#5f27cd", "#00d2d3", "#1dd1a1", "#ff6b6b", "#ffeaa7"
];

const StarShape = ({ color }: { color: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
  </svg>
);

const TriangleShape = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={color}>
    <polygon points="12,2 22,22 2,22" />
  </svg>
);

export function Confetti({
  active,
  duration = 3000,
  particleCount = 50,
  spread = 360,
  colors = DEFAULT_COLORS,
  onComplete
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: Math.random() * 0.5
      });
    }
    return newPieces;
  }, [particleCount, colors]);

  useEffect(() => {
    if (active) {
      setPieces(generatePieces());
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [active, duration, generatePieces, onComplete]);

  const renderShape = (piece: ConfettiPiece) => {
    switch (piece.shape) {
      case "star":
        return <StarShape color={piece.color} />;
      case "triangle":
        return <TriangleShape color={piece.color} />;
      case "circle":
        return (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: piece.color }}
          />
        );
      default:
        return (
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: piece.color }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${piece.x}vw`,
              y: "-10vh",
              rotate: 0,
              scale: piece.scale,
              opacity: 1
            }}
            animate={{
              x: `${piece.x + (Math.random() - 0.5) * 30}vw`,
              y: "110vh",
              rotate: piece.rotation + Math.random() * 720,
              opacity: [1, 1, 0.8, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + Math.random(),
              delay: piece.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute"
          >
            {renderShape(piece)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Burst confetti from a specific point (for button clicks, etc.)
export function ConfettiBurst({
  active,
  originX = 50,
  originY = 50,
  particleCount = 30,
  colors = DEFAULT_COLORS,
  onComplete
}: {
  active: boolean;
  originX?: number;
  originY?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const velocity = 50 + Math.random() * 100;
        newPieces.push({
          id: i,
          x: originX + Math.cos(angle) * velocity,
          y: originY + Math.sin(angle) * velocity,
          rotation: Math.random() * 360,
          scale: 0.4 + Math.random() * 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          delay: Math.random() * 0.1
        });
      }
      setPieces(newPieces);
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, originX, originY, particleCount, colors, onComplete]);

  const renderShape = (piece: ConfettiPiece) => {
    switch (piece.shape) {
      case "star":
        return <StarShape color={piece.color} />;
      case "triangle":
        return <TriangleShape color={piece.color} />;
      case "circle":
        return (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: piece.color }}
          />
        );
      default:
        return (
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: piece.color }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              left: `${originX}%`,
              top: `${originY}%`,
              rotate: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              rotate: piece.rotation,
              scale: piece.scale,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 1,
              delay: piece.delay,
              ease: "easeOut"
            }}
            className="absolute"
          >
            {renderShape(piece)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Celebration overlay with multiple effects
export function CelebrationOverlay({
  type,
  message,
  subMessage,
  onComplete
}: {
  type: "level-up" | "badge" | "perfect-score" | "streak";
  message: string;
  subMessage?: string;
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getColors = () => {
    switch (type) {
      case "level-up":
        return ["#ffd700", "#ffaa00", "#ff8c00", "#ffeaa7", "#f9ca24"];
      case "badge":
        return ["#9b59b6", "#8e44ad", "#be2edd", "#e056fd", "#d63031"];
      case "perfect-score":
        return ["#00d2d3", "#54a0ff", "#5f27cd", "#1dd1a1", "#48dbfb"];
      case "streak":
        return ["#ff6b6b", "#ff9ff3", "#feca57", "#ff6348", "#ff7979"];
      default:
        return DEFAULT_COLORS;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "level-up":
        return "⬆️";
      case "badge":
        return "🏆";
      case "perfect-score":
        return "⭐";
      case "streak":
        return "🔥";
      default:
        return "🎉";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <Confetti active={true} colors={getColors()} particleCount={80} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={() => {
              setIsVisible(false);
              onComplete?.();
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-md border border-primary/30 rounded-3xl p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {getIcon()}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {message}
              </motion.h2>
              {subMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  {subMessage}
                </motion.p>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-muted-foreground mt-4"
              >
                Tap to continue
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mini confetti burst for correct answers
export function CorrectAnswerBurst({ active }: { active: boolean }) {
  return (
    <ConfettiBurst
      active={active}
      particleCount={20}
      colors={["#1dd1a1", "#00d2d3", "#54a0ff", "#ffeaa7"]}
    />
  );
}
