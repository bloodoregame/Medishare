import { MainLayout } from "@/layouts/MainLayout";
import { MusicGrid } from "@/components/MusicGrid";
import { CategoryFilters } from "@/components/CategoryFilters";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Track } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  
  // Fetch tracks from the API
  const { data: tracks, isLoading, error } = useQuery({
    queryKey: ['/api/tracks'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/tracks');
        if (!res.ok) throw new Error('Failed to fetch tracks');
        return await res.json();
      } catch (error) {
        console.error("Error fetching tracks:", error);
        return [];
      }
    }
  });
  
  // Filter tracks by genre if a category is selected
  const filteredTracks = tracks && selectedCategory !== "Tout"
    ? tracks.filter((track: Track) => track.genre === selectedCategory)
    : tracks;
  
  // Sort tracks for different sections
  const trendingTracks = filteredTracks && filteredTracks.length > 0
    ? [...filteredTracks].sort((a: Track, b: Track) => b.playCount - a.playCount).slice(0, 4)
    : [];
  
  const recentTracks = filteredTracks && filteredTracks.length > 0
    ? [...filteredTracks].sort((a: Track, b: Track) => {
        const dateA = new Date(a.uploadedAt);
        const dateB = new Date(b.uploadedAt);
        return dateB.getTime() - dateA.getTime();
      }).slice(0, 4)
    : [];
  
  const recommendedTracks = filteredTracks && filteredTracks.length > 0
    ? [...filteredTracks].sort(() => 0.5 - Math.random()).slice(0, 4)
    : [];
  
  return (
    <MainLayout>
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-center">
          <div className="max-w-md">
            <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground">Impossible de charger les morceaux. Veuillez réessayer ultérieurement.</p>
          </div>
        </div>
      ) : (
        <>
          <MusicGrid title="Tendances" tracks={trendingTracks} />
          <MusicGrid title="Ajouts récents" tracks={recentTracks} />
          <MusicGrid title="Recommandé pour vous" tracks={recommendedTracks} />
        </>
      )}
    </MainLayout>
  );
}
