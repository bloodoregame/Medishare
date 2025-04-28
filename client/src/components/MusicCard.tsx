import { cn } from "@/lib/utils";
import { Play, Music, User } from "lucide-react";
import { Track } from "@shared/schema";
import { formatDuration, formatPlayCount, formatTimeAgo } from "@/lib/mock-data";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface MusicCardProps {
  track: Track;
  className?: string;
}

export function MusicCard({ track, className }: MusicCardProps) {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  
  const handlePlay = () => {
    playTrack(track);
  };
  
  // Assurez-vous que uploadedAt est un objet Date
  const uploadedDate = track.uploadedAt ? 
    (track.uploadedAt instanceof Date ? track.uploadedAt : new Date(track.uploadedAt)) 
    : null;
  
  return (
    <div 
      className={cn("music-card group cursor-pointer", className)}
      onClick={handlePlay}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-muted">
        {track.thumbnailUrl ? (
          <img 
            src={track.thumbnailUrl} 
            alt={track.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-primary bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center">
            <Play className="h-6 w-6 text-white" fill="white" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
          {track.duration ? formatDuration(track.duration) : "0:00"}
        </div>
        {isCurrentTrack && isPlaying && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-sm">
            En lecture
          </div>
        )}
      </div>
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{track.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{track.artist}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {formatPlayCount(track.playCount)} écoutes • {formatTimeAgo(uploadedDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
