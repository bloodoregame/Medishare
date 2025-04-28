import { createContext, useContext, ReactNode } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Track } from "@shared/schema";

// Define the context type
interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

// Create the context with a default value
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Provider component
export default function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

// Custom hook to use the audio player context
export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
}
