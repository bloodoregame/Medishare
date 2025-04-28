import { cn } from "@/lib/utils";
import { 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Repeat, 
  Shuffle, 
  Heart, 
  Volume, 
  Volume1, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { formatDuration } from "@/lib/mock-data";
import { Waveform } from "@/components/Waveform";
import { useEffect, useState } from "react";

export function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    duration, 
    currentTime, 
    volume, 
    isMuted, 
    isRepeat, 
    isShuffle,
    togglePlayPause, 
    seekTo, 
    setVolume, 
    toggleMute, 
    toggleRepeat, 
    toggleShuffle 
  } = useAudioPlayer();
  
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Format the duration and current time
  const formattedDuration = formatDuration(duration);
  const formattedCurrentTime = formatDuration(currentTime);
  
  // Calculate progress percentage for the slider
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    seekTo((value[0] / 100) * duration);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  
  // Get the appropriate volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted) return VolumeX;
    if (volume < 0.1) return VolumeX;
    if (volume < 0.5) return Volume;
    if (volume < 0.8) return Volume1;
    return Volume2;
  };
  
  const VolumeIcon = getVolumeIcon();
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-background border-t border-gray-200 dark:border-gray-800 shadow-md z-30 flex items-center justify-center text-muted-foreground">
        Aucun morceau sélectionné
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-gray-200 dark:border-gray-800 shadow-md z-30">
      <div className="flex flex-col">
        {/* Progress bar */}
        <div className="px-4 pt-2">
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            className="audio-progress h-1"
            onValueChange={handleProgressChange}
          />
        </div>
        
        {/* Time indicators */}
        <div className="flex justify-between px-4 text-xs text-gray-500 dark:text-gray-400 -mt-1">
          <span>{formattedCurrentTime}</span>
          <span>{formattedDuration}</span>
        </div>
        
        {/* Player controls */}
        <div className="px-4 py-2 flex items-center">
          <div className="flex-shrink-0 w-12 sm:w-16 h-12 sm:h-16 rounded overflow-hidden mr-3">
            <img 
              src={currentTrack.thumbnailUrl} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-sm sm:text-base font-semibold truncate">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-primary"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="default"
              size="icon"
              className="bg-primary hover:bg-red-600 rounded-full w-10 h-10"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" fill="white" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" fill="white" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-primary"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden md:flex items-center ml-4 space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("hover:text-primary", isRepeat ? "text-primary" : "")}
              onClick={toggleRepeat}
            >
              <Repeat className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("hover:text-primary", isShuffle ? "text-primary" : "")}
              onClick={toggleShuffle}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("hover:text-primary", isFavorited ? "text-primary" : "text-gray-400")}
              onClick={toggleFavorite}
            >
              <Heart className="h-5 w-5" fill={isFavorited ? "currentColor" : "none"} />
            </Button>
            
            <div className="flex items-center ml-2 space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-primary"
                onClick={toggleMute}
              >
                <VolumeIcon className="h-5 w-5" />
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                min={0}
                max={100}
                step={1}
                className="volume-slider w-20 h-1"
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio waveform visualization */}
      <div className="h-10 px-4 pb-2 hidden sm:block">
        <Waveform progress={progress / 100} />
      </div>
    </div>
  );
}
