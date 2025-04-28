import { useState, useRef, useEffect } from "react";
import { Track } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
}

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 0.7, // Default volume at 70%
    isMuted: false,
    isRepeat: false,
    isShuffle: false
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners
      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setState(prev => ({
            ...prev,
            duration: audioRef.current?.duration || 0
          }));
        }
      });
      
      audioRef.current.addEventListener("ended", () => {
        if (state.isRepeat) {
          // Replay the current track
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } else {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            currentTime: 0
          }));
        }
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", () => {});
        audioRef.current.removeEventListener("ended", () => {});
      }
    };
  }, [state.isRepeat]);
  
  // Update the audio source when currentTrack changes
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.audioUrl;
      audioRef.current.load();
      
      if (state.isPlaying) {
        audioRef.current.play();
        startProgressTimer();
      }
      
      // Update play count
      if (state.currentTrack.id) {
        apiRequest("POST", `/api/tracks/${state.currentTrack.id}/play`)
          .catch(error => console.error("Failed to update play count:", error));
      }
    }
  }, [state.currentTrack]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setState(prev => ({ ...prev, isPlaying: false }));
        });
        startProgressTimer();
      } else {
        audioRef.current.pause();
        stopProgressTimer();
      }
    }
  }, [state.isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);
  
  const startProgressTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setState(prev => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0
        }));
      }
    }, 1000);
  };
  
  const stopProgressTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Player controls
  const playTrack = (track: Track) => {
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0
    }));
  };
  
  const togglePlayPause = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  };
  
  const setVolume = (value: number) => {
    setState(prev => ({ ...prev, volume: value, isMuted: false }));
  };
  
  const toggleMute = () => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };
  
  const toggleRepeat = () => {
    setState(prev => ({ ...prev, isRepeat: !prev.isRepeat }));
  };
  
  const toggleShuffle = () => {
    setState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  };
  
  return {
    ...state,
    playTrack,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle
  };
}
