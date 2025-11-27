import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";

interface AudioContextType {
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleSpeech: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playCoinPickup: () => void;
  playBadgeEarned: () => void;
  playLevelComplete: () => void;
  playHint: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  playAnimalSound: (soundUrl: string) => void;
}

const AudioCtx = createContext<AudioContextType | undefined>(undefined);

const SOUND_STORAGE_KEY = "animal-quiz-sound";
const MUSIC_STORAGE_KEY = "animal-quiz-music";
const SPEECH_STORAGE_KEY = "animal-quiz-speech";

class SoundManager {
  private audioContext: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicTimers: number[] = [];
  private isMusicPlaying = false;
  private currentAnimalAudio: HTMLAudioElement | null = null;
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }
  
  ensureResumed(): void {
    try {
      const ctx = this.getContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    } catch {
      // Ignore errors during resume
    }
  }
  
  private playTone(
    frequency: number, 
    duration: number, 
    type: OscillatorType = "sine", 
    volume: number = 0.3,
    delay: number = 0,
    attack: number = 0.01,
    decay: number = 0.1
  ) {
    try {
      const ctx = this.getContext();
      this.ensureResumed();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      const startTime = ctx.currentTime + delay;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
      gainNode.gain.setValueAtTime(volume, startTime + duration - decay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch {
      console.warn("Audio playback failed");
    }
  }
  
  private playChord(frequencies: number[], duration: number, type: OscillatorType = "sine", volume: number = 0.15, delay: number = 0) {
    frequencies.forEach(freq => {
      this.playTone(freq, duration, type, volume / frequencies.length, delay);
    });
  }
  
  playCorrect() {
    const baseVolume = 0.12;
    this.playTone(523.25, 0.12, "sine", baseVolume, 0);
    this.playTone(1046.5, 0.12, "sine", baseVolume * 0.5, 0);
    this.playTone(659.25, 0.12, "sine", baseVolume, 0.08);
    this.playTone(1318.5, 0.12, "sine", baseVolume * 0.5, 0.08);
    this.playTone(783.99, 0.18, "sine", baseVolume, 0.16);
    this.playTone(1567.98, 0.18, "sine", baseVolume * 0.5, 0.16);
  }
  
  playIncorrect() {
    this.playTone(311.13, 0.15, "triangle", 0.12, 0);
    this.playTone(293.66, 0.25, "triangle", 0.1, 0.1);
  }
  
  playClick() {
    this.playTone(1200, 0.03, "sine", 0.08, 0, 0.005, 0.02);
    this.playTone(600, 0.02, "sine", 0.04, 0, 0.005, 0.015);
  }
  
  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((note, i) => {
      this.playTone(note, 0.2, "sine", 0.1, i * 0.1);
      this.playTone(note * 2, 0.2, "sine", 0.05, i * 0.1);
    });
    this.playChord([523.25, 659.25, 783.99, 1046.5], 0.4, "sine", 0.15, 0.4);
  }
  
  playCoinPickup() {
    this.playTone(987.77, 0.08, "sine", 0.1, 0, 0.01, 0.03);
    this.playTone(1318.51, 0.1, "sine", 0.1, 0.06, 0.01, 0.04);
  }
  
  playBadgeEarned() {
    const fanfare = [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 0.08 },
      { freq: 783.99, delay: 0.16 },
      { freq: 1046.5, delay: 0.24 },
      { freq: 783.99, delay: 0.36 },
      { freq: 1046.5, delay: 0.44 },
    ];
    fanfare.forEach(({ freq, delay }) => {
      this.playTone(freq, 0.15, "sine", 0.12, delay);
      this.playTone(freq * 1.5, 0.15, "sine", 0.06, delay);
    });
    this.playChord([523.25, 783.99, 1046.5, 1318.51], 0.5, "sine", 0.1, 0.55);
  }
  
  playLevelComplete() {
    const melody = [
      { freq: 392, delay: 0 },
      { freq: 523.25, delay: 0.1 },
      { freq: 659.25, delay: 0.2 },
      { freq: 783.99, delay: 0.3 },
      { freq: 1046.5, delay: 0.45 },
    ];
    melody.forEach(({ freq, delay }) => {
      this.playTone(freq, 0.2, "sine", 0.1, delay);
      this.playTone(freq * 2, 0.2, "sine", 0.05, delay);
    });
    this.playChord([523.25, 659.25, 783.99, 1046.5], 0.6, "sine", 0.12, 0.6);
  }
  
  playHint() {
    this.playTone(880, 0.1, "sine", 0.08, 0, 0.01, 0.05);
    this.playTone(1108.73, 0.12, "sine", 0.08, 0.08, 0.01, 0.06);
  }
  
  playAnimalSound(soundUrl: string) {
    try {
      // Stop any currently playing animal sound
      if (this.currentAnimalAudio) {
        this.currentAnimalAudio.pause();
        this.currentAnimalAudio = null;
      }
      
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      this.currentAnimalAudio = audio;
      
      audio.play().catch(err => {
        console.warn("Animal sound playback failed:", err);
      });
      
      audio.onended = () => {
        this.currentAnimalAudio = null;
      };
    } catch {
      console.warn("Animal sound playback failed");
    }
  }
  
  stopAnimalSound() {
    if (this.currentAnimalAudio) {
      this.currentAnimalAudio.pause();
      this.currentAnimalAudio = null;
    }
  }
  
  startMusic() {
    if (this.isMusicPlaying) return;
    
    try {
      const ctx = this.getContext();
      this.ensureResumed();
      
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(0, ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
      this.musicGain.connect(ctx.destination);
      
      this.isMusicPlaying = true;
      
      const bassNotes = [130.81, 146.83, 164.81, 196];
      const playBassLoop = (noteIndex: number) => {
        if (!this.isMusicPlaying || !this.musicGain) return;
        
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.connect(oscGain);
        oscGain.connect(this.musicGain);
        
        osc.frequency.value = bassNotes[noteIndex % bassNotes.length];
        osc.type = "sine";
        
        const now = ctx.currentTime;
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        oscGain.gain.setValueAtTime(0.3, now + 1.8);
        oscGain.gain.linearRampToValueAtTime(0, now + 2);
        
        osc.start(now);
        osc.stop(now + 2);
        
        const timerId = window.setTimeout(() => playBassLoop(noteIndex + 1), 2000);
        this.musicTimers.push(timerId);
      };
      
      const padChords = [
        [261.63, 329.63, 392],
        [293.66, 369.99, 440],
        [329.63, 415.30, 493.88],
        [392, 493.88, 587.33]
      ];
      
      const playPadLoop = (chordIndex: number) => {
        if (!this.isMusicPlaying || !this.musicGain) return;
        
        padChords[chordIndex % padChords.length].forEach(freq => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          
          osc.connect(oscGain);
          oscGain.connect(this.musicGain!);
          
          osc.frequency.value = freq;
          osc.type = "sine";
          
          const now = ctx.currentTime;
          oscGain.gain.setValueAtTime(0, now);
          oscGain.gain.linearRampToValueAtTime(0.08, now + 1);
          oscGain.gain.setValueAtTime(0.08, now + 3);
          oscGain.gain.linearRampToValueAtTime(0, now + 4);
          
          osc.start(now);
          osc.stop(now + 4);
        });
        
        const timerId = window.setTimeout(() => playPadLoop(chordIndex + 1), 4000);
        this.musicTimers.push(timerId);
      };
      
      playBassLoop(0);
      playPadLoop(0);
      
    } catch {
      console.warn("Music playback failed");
    }
  }
  
  stopMusic() {
    this.isMusicPlaying = false;
    
    // Clear all music timers
    this.musicTimers.forEach(timerId => window.clearTimeout(timerId));
    this.musicTimers = [];
    
    if (this.musicGain) {
      try {
        const ctx = this.getContext();
        this.musicGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      } catch {
        // Ignore errors during fade out
      }
      this.musicGain = null;
    }
  }
}

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }
  
  speak(text: string) {
    if (!this.synth) return;
    
    // Cancel any ongoing speech
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher for friendly tone
    utterance.volume = 0.8;
    
    // Try to use a friendly voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google"))
    ) || voices.find(v => v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
  
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
  
  isSupported(): boolean {
    return this.synth !== null;
  }
}

const soundManager = new SoundManager();
const speechManager = new SpeechManager();

export function AudioProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== "false";
    }
    return true;
  });
  
  const [musicEnabled, setMusicEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(MUSIC_STORAGE_KEY);
      return saved === "true";
    }
    return false;
  });
  
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SPEECH_STORAGE_KEY);
      return saved === "true";
    }
    return false;
  });
  
  const hasInteracted = useRef(false);
  
  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  }, [soundEnabled]);
  
  useEffect(() => {
    localStorage.setItem(MUSIC_STORAGE_KEY, String(musicEnabled));
  }, [musicEnabled]);
  
  useEffect(() => {
    localStorage.setItem(SPEECH_STORAGE_KEY, String(speechEnabled));
  }, [speechEnabled]);
  
  useEffect(() => {
    if (musicEnabled && hasInteracted.current) {
      soundManager.startMusic();
    } else {
      soundManager.stopMusic();
    }
    return () => soundManager.stopMusic();
  }, [musicEnabled]);
  
  const toggleSound = useCallback(() => {
    hasInteracted.current = true;
    soundManager.ensureResumed();
    setSoundEnabled(prev => !prev);
  }, []);
  
  const toggleMusic = useCallback(() => {
    hasInteracted.current = true;
    soundManager.ensureResumed();
    setMusicEnabled(prev => !prev);
  }, []);
  
  const toggleSpeech = useCallback(() => {
    hasInteracted.current = true;
    setSpeechEnabled(prev => !prev);
  }, []);
  
  const playCorrect = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playCorrect();
    }
  }, [soundEnabled]);
  
  const playIncorrect = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playIncorrect();
    }
  }, [soundEnabled]);
  
  const playClick = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playClick();
    }
  }, [soundEnabled]);
  
  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playSuccess();
    }
  }, [soundEnabled]);
  
  const playCoinPickup = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playCoinPickup();
    }
  }, [soundEnabled]);
  
  const playBadgeEarned = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playBadgeEarned();
    }
  }, [soundEnabled]);
  
  const playLevelComplete = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playLevelComplete();
    }
  }, [soundEnabled]);
  
  const playHint = useCallback(() => {
    if (soundEnabled) {
      hasInteracted.current = true;
      soundManager.playHint();
    }
  }, [soundEnabled]);
  
  const speak = useCallback((text: string) => {
    if (speechEnabled) {
      speechManager.speak(text);
    }
  }, [speechEnabled]);
  
  const stopSpeaking = useCallback(() => {
    speechManager.stop();
  }, []);
  
  const playAnimalSound = useCallback((soundUrl: string) => {
    if (soundEnabled && soundUrl) {
      hasInteracted.current = true;
      soundManager.playAnimalSound(soundUrl);
    }
  }, [soundEnabled]);
  
  return (
    <AudioCtx.Provider value={{
      soundEnabled,
      musicEnabled,
      speechEnabled,
      toggleSound,
      toggleMusic,
      toggleSpeech,
      playCorrect,
      playIncorrect,
      playClick,
      playSuccess,
      playCoinPickup,
      playBadgeEarned,
      playLevelComplete,
      playHint,
      speak,
      stopSpeaking,
      playAnimalSound,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
