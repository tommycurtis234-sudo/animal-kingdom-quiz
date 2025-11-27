import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, AudioLines, AudioWaveform } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AudioControls() {
  const { soundEnabled, toggleSound, speechEnabled, toggleSpeech } = useAudio();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
            data-testid="button-sound-toggle"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{soundEnabled ? "Sound On" : "Sound Off"}</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSpeech}
            aria-label={speechEnabled ? "Turn off question reading" : "Read questions aloud"}
            data-testid="button-speech-toggle"
          >
            {speechEnabled ? (
              <AudioLines className="h-4 w-4" />
            ) : (
              <AudioWaveform className="h-4 w-4 opacity-50" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{speechEnabled ? "Reading On" : "Reading Off"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
