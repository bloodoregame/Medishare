import { MainLayout } from "@/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { MusicGrid } from "@/components/MusicGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Track, User } from "@shared/schema";
import { useParams } from "wouter";
import { User as UserIcon } from "lucide-react";

export default function UserProfile() {
  // Get user ID from URL params
  const { id } = useParams();
  const userId = id ? parseInt(id) : 1; // Default to 1 if no ID is provided
  
  // Fetch user info from the API
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("User not found");
        return await res.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    }
  });
  
  // Fetch user tracks from the API
  const { data: userTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['/api/tracks', { userId }],
    queryFn: async () => {
      try {
        // Ideally, we'd have an endpoint like /api/users/:id/tracks
        // For now, fetch all tracks and filter by userId
        const res = await fetch(`/api/tracks?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch tracks");
        const tracks = await res.json();
        return tracks.filter((track: Track) => track.userId === userId);
      } catch (error) {
        console.error("Error fetching user tracks:", error);
        return [];
      }
    },
    enabled: !!user // Only fetch tracks if user exists
  });
  
  // Fetch user playlists from the API
  const { data: userPlaylists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['/api/playlists', { userId }],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/playlists?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch playlists");
        return await res.json();
      } catch (error) {
        console.error("Error fetching user playlists:", error);
        return [];
      }
    },
    enabled: !!user // Only fetch playlists if user exists
  });
  
  const isLoading = isLoadingUser || isLoadingTracks || isLoadingPlaylists;
  
  if (isLoading && !userError) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (userError || !user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-2">Utilisateur introuvable</h2>
          <p className="text-muted-foreground">
            L'utilisateur que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </MainLayout>
    );
  }
  
  // Process playlists and their tracks
  const populatedPlaylists = userPlaylists && userPlaylists.length > 0 
    ? userPlaylists.map((playlist: any) => {
        return {
          ...playlist,
          tracks: [] // This would be populated by fetching /api/playlists/:id/tracks in a real app
        };
      })
    : [];
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pt-6">
        {/* Profile header */}
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 overflow-hidden mr-6">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.displayName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>
            
            <div className="flex gap-3">
              <Button>S'abonner</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </div>
        
        {/* User content tabs */}
        <Tabs defaultValue="tracks">
          <TabsList className="mb-6">
            <TabsTrigger value="tracks">Morceaux</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracks">
            {userTracks && userTracks.length > 0 ? (
              <MusicGrid title="Tous les morceaux" tracks={userTracks} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Aucun morceau publié pour le moment.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="playlists">
            {populatedPlaylists && populatedPlaylists.length > 0 ? (
              <>
                {populatedPlaylists.map((playlist: any) => (
                  <MusicGrid 
                    key={playlist.id} 
                    title={playlist.name} 
                    tracks={playlist.tracks || []} 
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Aucune playlist créée pour le moment.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-gray-50 dark:bg-muted p-6 rounded-lg">
              <h2 className="font-bold text-lg mb-4">À propos de {user.displayName}</h2>
              <p className="mb-4">
                {user.bio || "Cet utilisateur n'a pas encore ajouté de biographie."}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-1">Date d'inscription</h3>
                  <p className="text-gray-600 dark:text-gray-400">Avril 2024</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Localisation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Non spécifiée</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Genre favori</h3>
                  <p className="text-gray-600 dark:text-gray-400">Non spécifié</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Total des écoutes</h3>
                  <p className="text-gray-600 dark:text-gray-400">0</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
