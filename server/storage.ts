import { 
  users, type User, type InsertUser,
  tracks, type Track, type InsertTrack,
  playlists, type Playlist, type InsertPlaylist,
  playlistTracks, type PlaylistTrack, type InsertPlaylistTrack
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Track operations
  getTracks(): Promise<Track[]>;
  getTrackById(id: number): Promise<Track | undefined>;
  getTracksByUserId(userId: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  updateTrackPlayCount(id: number): Promise<Track | undefined>;
  searchTracks(query: string): Promise<Track[]>;
  getTracksByGenre(genre: string): Promise<Track[]>;
  
  // Playlist operations
  getPlaylists(userId: number): Promise<Playlist[]>;
  getPlaylistById(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Playlist track operations
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private playlistTracks: Map<number, PlaylistTrack>;
  
  private userId: number;
  private trackId: number;
  private playlistId: number;
  private playlistTrackId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    
    this.userId = 1;
    this.trackId = 1;
    this.playlistId = 1;
    this.playlistTrackId = 1;
    
    // Pour le déploiement, nous commençons avec une base de données vide
    // Les utilisateurs devront s'inscrire et ajouter leur propre contenu
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      avatarUrl: insertUser.avatarUrl || null 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Track operations
  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }
  
  async getTrackById(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }
  
  async getTracksByUserId(userId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => track.userId === userId
    );
  }
  
  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.trackId++;
    const now = new Date();
    const track: Track = { 
      ...insertTrack, 
      id, 
      uploadedAt: now, 
      playCount: 0,
      genre: insertTrack.genre || null,
      description: insertTrack.description || null,
      thumbnailUrl: insertTrack.thumbnailUrl || null,
      duration: insertTrack.duration || null
    };
    this.tracks.set(id, track);
    return track;
  }
  
  async updateTrackPlayCount(id: number): Promise<Track | undefined> {
    const track = this.tracks.get(id);
    if (!track) return undefined;
    
    const updatedTrack: Track = {
      ...track,
      playCount: track.playCount + 1
    };
    
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }
  
  async searchTracks(query: string): Promise<Track[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(
      (track) => 
        track.title.toLowerCase().includes(lowercaseQuery) || 
        track.artist.toLowerCase().includes(lowercaseQuery) ||
        (track.description && track.description.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  async getTracksByGenre(genre: string): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => track.genre === genre
    );
  }
  
  // Playlist operations
  async getPlaylists(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId || playlist.isPublic
    );
  }
  
  async getPlaylistById(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }
  
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistId++;
    
    // Créez un objet qui est certain d'avoir tous les champs requis
    const playlist: Playlist = { 
      id,
      name: insertPlaylist.name,
      userId: insertPlaylist.userId,
      // Valeur par défaut si non spécifiée (public par défaut)
      isPublic: insertPlaylist.isPublic !== undefined ? insertPlaylist.isPublic : true
    };
    
    this.playlists.set(id, playlist);
    return playlist;
  }
  
  // Playlist track operations
  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const playlistTrackEntries = Array.from(this.playlistTracks.values()).filter(
      (pt) => pt.playlistId === playlistId
    );
    
    return playlistTrackEntries.map(pt => 
      this.tracks.get(pt.trackId)
    ).filter((track): track is Track => track !== undefined);
  }
  
  async addTrackToPlaylist(insertPlaylistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.playlistTrackId++;
    const now = new Date();
    const playlistTrack: PlaylistTrack = { ...insertPlaylistTrack, id, addedAt: now };
    this.playlistTracks.set(id, playlistTrack);
    return playlistTrack;
  }
  
  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const entry = Array.from(this.playlistTracks.values()).find(
      (pt) => pt.playlistId === playlistId && pt.trackId === trackId
    );
    
    if (!entry) return false;
    
    return this.playlistTracks.delete(entry.id);
  }
}

export const storage = new MemStorage();
