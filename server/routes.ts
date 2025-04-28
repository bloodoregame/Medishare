import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertTrackSchema, insertUserSchema, insertPlaylistSchema, insertPlaylistTrackSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";

// Configure storage for audio files
const audioStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads/audio');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads/images');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const audioUpload = multer({ 
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .mp3, .wav and .flac formats are allowed'));
    }
  }
});

const imageUpload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .png and .svg formats are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // User routes
  app.post('/api/users/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const newUser = await storage.createUser(userData);
      // Don't send password back to client
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });
  
  // Track routes
  app.get('/api/tracks', async (req: Request, res: Response) => {
    try {
      let tracks;
      
      if (req.query.search) {
        const query = req.query.search as string;
        tracks = await storage.searchTracks(query);
      } else if (req.query.genre) {
        const genre = req.query.genre as string;
        tracks = await storage.getTracksByGenre(genre);
      } else if (req.query.userId) {
        const userId = parseInt(req.query.userId as string);
        tracks = await storage.getTracksByUserId(userId);
      } else {
        tracks = await storage.getTracks();
      }
      
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tracks' });
    }
  });
  
  app.get('/api/tracks/:id', async (req: Request, res: Response) => {
    try {
      const trackId = parseInt(req.params.id);
      const track = await storage.getTrackById(trackId);
      
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch track' });
    }
  });
  
  app.post('/api/tracks/upload', audioUpload.single('audio'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No audio file uploaded' });
      }
      
      const trackData = {
        title: req.body.title,
        artist: req.body.artist,
        userId: parseInt(req.body.userId),
        genre: req.body.genre || null,
        description: req.body.description || null,
        audioUrl: `/uploads/audio/${req.file.filename}`,
        thumbnailUrl: req.body.thumbnailUrl || null,
        duration: req.body.duration ? parseInt(req.body.duration) : null
      };
      
      const validatedData = insertTrackSchema.parse(trackData);
      const newTrack = await storage.createTrack(validatedData);
      
      res.status(201).json(newTrack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to upload track' });
    }
  });
  
  app.post('/api/tracks/:id/play', async (req: Request, res: Response) => {
    try {
      const trackId = parseInt(req.params.id);
      const track = await storage.updateTrackPlayCount(trackId);
      
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update play count' });
    }
  });
  
  app.post('/api/upload/thumbnail', imageUpload.single('thumbnail'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
      
      res.json({ 
        thumbnailUrl: `/uploads/images/${req.file.filename}` 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload thumbnail' });
    }
  });
  
  // Playlist routes
  app.get('/api/playlists', async (req: Request, res: Response) => {
    try {
      if (!req.query.userId) {
        return res.status(400).json({ message: 'userId parameter is required' });
      }
      
      const userId = parseInt(req.query.userId as string);
      const playlists = await storage.getPlaylists(userId);
      
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch playlists' });
    }
  });
  
  app.get('/api/playlists/:id', async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylistById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch playlist' });
    }
  });
  
  app.get('/api/playlists/:id/tracks', async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylistById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      const tracks = await storage.getPlaylistTracks(playlistId);
      
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch playlist tracks' });
    }
  });
  
  app.post('/api/playlists', async (req: Request, res: Response) => {
    try {
      const playlistData = insertPlaylistSchema.parse(req.body);
      const newPlaylist = await storage.createPlaylist(playlistData);
      
      res.status(201).json(newPlaylist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create playlist' });
    }
  });
  
  app.post('/api/playlists/:id/tracks', async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylistById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      const playlistTrackData = {
        playlistId,
        trackId: req.body.trackId
      };
      
      const validatedData = insertPlaylistTrackSchema.parse(playlistTrackData);
      const newPlaylistTrack = await storage.addTrackToPlaylist(validatedData);
      
      res.status(201).json(newPlaylistTrack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add track to playlist' });
    }
  });
  
  app.delete('/api/playlists/:playlistId/tracks/:trackId', async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.playlistId);
      const trackId = parseInt(req.params.trackId);
      
      const removed = await storage.removeTrackFromPlaylist(playlistId, trackId);
      
      if (!removed) {
        return res.status(404).json({ message: 'Track not found in playlist' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove track from playlist' });
    }
  });
  
  return httpServer;
}

// Need to import express for the middleware
import express from "express";
