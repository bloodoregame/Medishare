const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage for uploads in memory
const memStorage = multer.memoryStorage();
const audioUpload = multer({ storage: memStorage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
const imageUpload = multer({ storage: memStorage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// In-memory storage (same as our server storage.ts but in JS)
class MemoryStorage {
  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    
    this.userId = 1;
    this.trackId = 1;
    this.playlistId = 1;
    this.playlistTrackId = 1;
  }

  // User operations
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser) {
    const id = this.userId++;
    const user = { 
      ...insertUser, 
      id,
      avatarUrl: insertUser.avatarUrl || null 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Track operations
  async getTracks() {
    return Array.from(this.tracks.values());
  }
  
  async getTrackById(id) {
    return this.tracks.get(id);
  }
  
  async getTracksByUserId(userId) {
    return Array.from(this.tracks.values()).filter(
      (track) => track.userId === userId
    );
  }
  
  async createTrack(insertTrack) {
    const id = this.trackId++;
    const now = new Date();
    const track = { 
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
  
  async updateTrackPlayCount(id) {
    const track = this.tracks.get(id);
    if (!track) return undefined;
    
    const updatedTrack = {
      ...track,
      playCount: track.playCount + 1
    };
    
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }
  
  async searchTracks(query) {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(
      (track) => 
        track.title.toLowerCase().includes(lowercaseQuery) || 
        track.artist.toLowerCase().includes(lowercaseQuery) ||
        (track.description && track.description.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  async getTracksByGenre(genre) {
    return Array.from(this.tracks.values()).filter(
      (track) => track.genre === genre
    );
  }
  
  // Playlist operations
  async getPlaylists(userId) {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId || playlist.isPublic
    );
  }
  
  async getPlaylistById(id) {
    return this.playlists.get(id);
  }
  
  async createPlaylist(insertPlaylist) {
    const id = this.playlistId++;
    
    // Créez un objet qui est certain d'avoir tous les champs requis
    const playlist = { 
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
  async getPlaylistTracks(playlistId) {
    const playlistTrackEntries = Array.from(this.playlistTracks.values()).filter(
      (pt) => pt.playlistId === playlistId
    );
    
    return playlistTrackEntries.map(pt => 
      this.tracks.get(pt.trackId)
    ).filter((track) => track !== undefined);
  }
  
  async addTrackToPlaylist(insertPlaylistTrack) {
    const id = this.playlistTrackId++;
    const now = new Date();
    const playlistTrack = { ...insertPlaylistTrack, id, addedAt: now };
    this.playlistTracks.set(id, playlistTrack);
    return playlistTrack;
  }
  
  async removeTrackFromPlaylist(playlistId, trackId) {
    const entry = Array.from(this.playlistTracks.values()).find(
      (pt) => pt.playlistId === playlistId && pt.trackId === trackId
    );
    
    if (!entry) return false;
    
    return this.playlistTracks.delete(entry.id);
  }
}

// Initialize the storage
const dataStorage = new MemoryStorage();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await dataStorage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/tracks', async (req, res) => {
  try {
    const { userId, genre } = req.query;
    
    if (userId) {
      const tracks = await dataStorage.getTracksByUserId(parseInt(userId));
      return res.json(tracks);
    }
    
    if (genre && genre !== "Tout") {
      const tracks = await dataStorage.getTracksByGenre(genre);
      return res.json(tracks);
    }
    
    const tracks = await dataStorage.getTracks();
    return res.json(tracks);
  } catch (error) {
    console.error("Error getting tracks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await dataStorage.getTrackById(parseInt(req.params.id));
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    return res.json(track);
  } catch (error) {
    console.error("Error getting track:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/tracks/:id/play', async (req, res) => {
  try {
    const updated = await dataStorage.updateTrackPlayCount(parseInt(req.params.id));
    if (!updated) {
      return res.status(404).json({ message: "Track not found" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error updating play count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/playlists', async (req, res) => {
  try {
    const { userId } = req.query;
    const playlists = await dataStorage.getPlaylists(userId ? parseInt(userId) : null);
    return res.json(playlists);
  } catch (error) {
    console.error("Error getting playlists:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const playlist = await dataStorage.getPlaylistById(parseInt(req.params.id));
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.json(playlist);
  } catch (error) {
    console.error("Error getting playlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/playlists/:id/tracks', async (req, res) => {
  try {
    const tracks = await dataStorage.getPlaylistTracks(parseInt(req.params.id));
    return res.json(tracks);
  } catch (error) {
    console.error("Error getting playlist tracks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a serverless handler from the Express app
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};