import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, Image } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { musicGenres } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const clearForm = () => {
    setTitle("");
    setArtist("");
    setGenre("");
    setDescription("");
    setAudioFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };
  
  const handleClose = () => {
    clearForm();
    onClose();
  };
  
  // Handle audio file selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an audio file
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier audio (MP3, WAV, FLAC).",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 50MB.",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
    }
  };
  
  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner une image (JPG, PNG).",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille de l'image ne doit pas dépasser 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!audioFile) throw new Error("No audio file selected");
      if (!title) throw new Error("Title is required");
      if (!artist) throw new Error("Artist is required");
      
      setIsUploading(true);
      
      // First, upload the thumbnail if there is one
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append("thumbnail", thumbnailFile);
        
        const thumbnailResponse = await apiRequest("POST", "/api/upload/thumbnail", thumbnailFormData);
        const thumbnailData = await thumbnailResponse.json();
        thumbnailUrl = thumbnailData.thumbnailUrl;
      }
      
      // Then upload the audio with track metadata
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("userId", "1"); // Hardcoded for now, would come from authentication
      
      if (genre) formData.append("genre", genre);
      if (description) formData.append("description", description);
      if (thumbnailUrl) formData.append("thumbnailUrl", thumbnailUrl);
      
      const response = await apiRequest("POST", "/api/tracks/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
      toast({
        title: "Morceau importé !",
        description: "Votre morceau a été importé avec succès.",
      });
      handleClose();
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Erreur d'importation",
        description: "Une erreur est survenue lors de l'importation. Veuillez réessayer.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer de la musique</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Audio file upload */}
          <div className="mb-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              {audioFile ? audioFile.name : "Glissez-déposez votre fichier audio ici"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              MP3, WAV, FLAC (max 50MB)
            </p>
            <input
              type="file"
              ref={audioInputRef}
              onChange={handleAudioChange}
              accept="audio/mpeg,audio/wav,audio/flac"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => audioInputRef.current?.click()}
            >
              Parcourir les fichiers
            </Button>
          </div>
          
          {/* Title */}
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* Artist */}
          <div>
            <Label htmlFor="artist">Artiste</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>
          
          {/* Genre */}
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un genre" />
              </SelectTrigger>
              <SelectContent>
                {musicGenres.filter(g => g !== "Tout").map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-20"
            />
          </div>
          
          {/* Thumbnail */}
          <div>
            <Label htmlFor="thumbnail">Miniature</Label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-muted">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex items-center justify-center overflow-hidden">
                  {thumbnailPreview ? (
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
                    accept="image/jpeg,image/png,image/svg+xml"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    Importer une image
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG (recommandé: 1280×720)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!audioFile || !title || !artist || isUploading}
            >
              {isUploading ? "Importation..." : "Publier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
