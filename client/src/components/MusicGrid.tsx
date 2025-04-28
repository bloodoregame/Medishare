import { MusicCard } from "@/components/MusicCard";
import { Track } from "@shared/schema";

interface MusicGridProps {
  title: string;
  tracks: Track[];
}

export function MusicGrid({ title, tracks }: MusicGridProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-center text-muted-foreground py-8">
          Aucun morceau trouvé.
        </p>
      </section>
    );
  }
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tracks.map(track => (
          <MusicCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
}
