import { Track, User, Playlist } from "@shared/schema";

// Sample users
export const sampleUsers: User[] = [
  {
    id: 1,
    username: "electro_beats",
    password: "password123", // In a real app, this would be hashed
    displayName: "Electro Beats",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    username: "jazz_vibes",
    password: "password123",
    displayName: "Jazz Vibes",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    username: "rock_legend",
    password: "password123",
    displayName: "Rock Legend",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  }
];

// Sample tracks
export const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Electronic Dreams (Original Mix)",
    artist: "Electro Beats",
    userId: 1,
    genre: "Electronic",
    description: "A futuristic electronic track with driving beats and atmospheric synths.",
    audioUrl: "/samples/electronic-dreams.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 222, // 3:42 in seconds
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    playCount: 28000
  },
  {
    id: 2,
    title: "Midnight Piano Sonata",
    artist: "Classic Vibes",
    userId: 2,
    genre: "Classical",
    description: "A beautiful piano sonata performed at midnight in an empty concert hall.",
    audioUrl: "/samples/midnight-piano.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 255, // 4:15 in seconds
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    playCount: 15000
  },
  {
    id: 3,
    title: "Festival Anthem",
    artist: "Rock Legend",
    userId: 3,
    genre: "Rock",
    description: "An energetic rock track that gets the crowd going at festivals.",
    audioUrl: "/samples/festival-anthem.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 208, // 3:28 in seconds
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    playCount: 42000
  },
  {
    id: 4,
    title: "Urban Flow",
    artist: "Beat Master",
    userId: 2,
    genre: "Hip-Hop",
    description: "A hip-hop track with smooth beats and urban vibes.",
    audioUrl: "/samples/urban-flow.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 175, // 2:55 in seconds
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    playCount: 32000
  },
  {
    id: 5,
    title: "Acoustic Journey",
    artist: "String Theory",
    userId: 3,
    genre: "Acoustic",
    description: "A soothing acoustic guitar track that takes you on a journey.",
    audioUrl: "/samples/acoustic-journey.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 250, // 4:10 in seconds
    uploadedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    playCount: 5000
  },
  {
    id: 6,
    title: "House Party Mix",
    artist: "DJ Groove",
    userId: 1,
    genre: "House",
    description: "An upbeat house track perfect for parties.",
    audioUrl: "/samples/house-party.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 225, // 3:45 in seconds
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    playCount: 12000
  },
  {
    id: 7,
    title: "Night Sky (Live Version)",
    artist: "Aurora Sound",
    userId: 2,
    genre: "Pop",
    description: "A live version of the hit song 'Night Sky' with amazing vocals.",
    audioUrl: "/samples/night-sky-live.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 322, // 5:22 in seconds
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    playCount: 8000
  },
  {
    id: 8,
    title: "Retro Groove",
    artist: "Vintage Vinyl",
    userId: 3,
    genre: "Funk",
    description: "A funky retro track with groovy bass lines and rhythmic beats.",
    audioUrl: "/samples/retro-groove.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 196, // 3:16 in seconds
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    playCount: 7000
  },
  {
    id: 9,
    title: "Smooth Jazz Session",
    artist: "Jazz Masters",
    userId: 2,
    genre: "Jazz",
    description: "A smooth jazz session with saxophone, piano, and drums.",
    audioUrl: "/samples/smooth-jazz.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 373, // 6:13 in seconds
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    playCount: 18000
  },
  {
    id: 10,
    title: "Studio Session",
    artist: "Sound Waves",
    userId: 1,
    genre: "Indie",
    description: "A studio session recording with raw and authentic sounds.",
    audioUrl: "/samples/studio-session.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    duration: 296, // 4:56 in seconds
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    playCount: 11000
  }
];

// Sample playlists
export const samplePlaylists: Playlist[] = [
  {
    id: 1,
    name: "Mes favoris",
    userId: 1,
    isPublic: true
  },
  {
    id: 2,
    name: "Rock classique",
    userId: 3,
    isPublic: true
  },
  {
    id: 3,
    name: "Électro mix",
    userId: 1,
    isPublic: true
  }
];

// Music genres
export const musicGenres = [
  "Tout",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Électronique",
  "Jazz",
  "Classique",
  "R&B",
  "Indie",
  "Metal",
];

// Sidebar links
export const sidebarLinks = [
  { icon: "ri-home-line", text: "Accueil", path: "/" },
  { icon: "ri-fire-line", text: "Tendances", path: "/trending" },
  { icon: "ri-history-line", text: "Historique", path: "/history" },
  { icon: "ri-time-line", text: "Récents", path: "/recent" },
  { icon: "ri-heart-line", text: "Favoris", path: "/favorites" },
];

// Format duration
export const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Format play count
export const formatPlayCount = (count: number | null | undefined): string => {
  if (!count) return "0";
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Format time ago
export const formatTimeAgo = (date: Date | null | undefined): string => {
  if (!date) return "Date inconnue";
  
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSeconds < 60) {
    return `Il y a ${diffSeconds} secondes`;
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  return `Il y a ${diffMonths} mois`;
};
