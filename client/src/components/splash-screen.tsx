import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SplashScreenProps {
  isReady: boolean;
  onDismiss: () => void;
}

export function SplashScreen({ isReady, onDismiss }: SplashScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary text-primary-foreground"
      data-testid="splash-screen"
    >
      <div className="flex flex-col items-center gap-8 p-6 text-center max-w-md">
        {/* App Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Animal Kingdom
          </h1>
          <p className="text-2xl md:text-3xl font-display font-medium opacity-90">
            Quiz
          </p>
        </div>

        {/* Animal Icon (decorative) */}
        <div className="relative w-32 h-32 opacity-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Status */}
        {!isReady ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="w-10 h-10 animate-spin"
              data-testid="loader-spinner"
            />
            <p className="text-lg font-medium" data-testid="text-loading-status">
              Loading packs…
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={onDismiss}
              className="px-8 py-6 text-lg font-semibold min-h-14"
              data-testid="button-start-quiz"
            >
              Tap to Start
            </Button>
            <p className="text-sm opacity-75" data-testid="text-ready-status">
              Ready to explore!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
