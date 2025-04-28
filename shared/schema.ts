import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatarUrl: true,
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  userId: integer("user_id").notNull(),
  genre: text("genre"),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  playCount: integer("play_count").notNull().default(0),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  uploadedAt: true,
  playCount: true,
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
});

export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull(),
  trackId: integer("track_id").notNull(),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).omit({
  id: true, 
  addedAt: true
});

// Types exported for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;

export type PlaylistTrack = typeof playlistTracks.$inferSelect;
export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
