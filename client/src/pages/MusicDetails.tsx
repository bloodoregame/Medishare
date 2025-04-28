import { MainLayout } from "@/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Heart, 
  Share2, 
  ListPlus, 
  Clock, 
  Music, 
  Calendar, 
  User 
} from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { formatDuration, formatPlayCount, formatTimeAgo } from "@/lib/mock-data";

export default function MusicDetails() {
  const { id } = useParams();
  const trackId = id ? parseInt(id) : -1;
  const { playTrack, isPlaying, currentTrack, togglePlayPause } = useAudioPlayer();
  
  // Fetch track details from the API
  const { data: track, isLoading, error } = useQuery({
    queryKey: ['/api/tracks', trackId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/tracks/${trackId}`);
        if (!res.ok) throw new Error("Track not found");
        return await res.json();
      } catch (error) {
        console.error("Error fetching track:", error);
        throw error;
      }
    }
  });
  
  const isCurrentTrack = currentTrack?.id === trackId;
  
  const handlePlay = () => {
    if (track) {
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrack(track);
      }
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !track) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-2">Morceau introuvable</h2>
          <p className="text-muted-foreground">
            Le morceau que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </MainLayout>
    );
  }
  
  // Ensure uploadedAt is a Date object
  const uploadedDate = track.uploadedAt instanceof Date ? track.uploadedAt : new Date(track.uploadedAt);
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="md:w-96 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-muted flex-shrink-0">
            {track.thumbnailUrl ? (
              <img 
                src={track.thumbnailUrl} 
                alt={track.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Music className="h-12 w-12" />
              </div>
            )}
          </div>
          
          {/* Track info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{track.artist}</p>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 space-x-4">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {formatPlayCount(track.playCount)} écoutes
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatTimeAgo(uploadedDate)}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDuration(track.duration)}
              </span>
              <span className="flex items-center">
                <Music className="h-4 w-4 mr-1" />
                {track.genre || "Non classé"}
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                className="flex items-center gap-2" 
                onClick={handlePlay}
              >
                {isCurrentTrack && isPlaying ? (
                  <>
                    <span className="sr-only">Pause</span>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" />
                      <rect x="14" y="5" width="4" height="14" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" fill="white" />
                    Lecture
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Ajouter aux favoris
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <ListPlus className="h-5 w-5" />
                Ajouter à une playlist
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Partager
              </Button>
            </div>
            
            {/* Description */}
            {track.description && (
              <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {track.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
