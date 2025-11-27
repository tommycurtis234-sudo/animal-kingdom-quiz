import { useDifficulty, type Difficulty } from "@/contexts/difficulty-context";
import { Button } from "@/components/ui/button";
import { Baby, GraduationCap } from "lucide-react";

const difficulties: { value: Difficulty; label: string; icon: typeof Baby }[] = [
  { value: "kids", label: "Kids", icon: Baby },
  { value: "adults", label: "Adults", icon: GraduationCap },
];

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useDifficulty();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {difficulties.map((diff) => {
        const Icon = diff.icon;
        const isActive = difficulty === diff.value;
        return (
          <Button
            key={diff.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setDifficulty(diff.value)}
            className="flex items-center gap-1.5"
            aria-label={`${diff.label} mode`}
            aria-pressed={isActive}
            data-testid={`difficulty-${diff.value}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{diff.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
