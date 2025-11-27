import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Difficulty = "kids" | "adults";

interface DifficultyContextType {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

const DIFFICULTY_STORAGE_KEY = "animal-quiz-difficulty";

export function DifficultyProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficultyState] = useState<Difficulty>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(DIFFICULTY_STORAGE_KEY);
      if (saved && ["kids", "adults"].includes(saved)) {
        return saved as Difficulty;
      }
    }
    return "kids";
  });

  useEffect(() => {
    localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
  }, [difficulty]);

  const setDifficulty = (diff: Difficulty) => {
    setDifficultyState(diff);
  };

  return (
    <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  );
}

export function useDifficulty() {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error("useDifficulty must be used within a DifficultyProvider");
  }
  return context;
}
