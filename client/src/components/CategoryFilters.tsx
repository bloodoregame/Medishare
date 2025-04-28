import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { musicGenres } from "@/lib/mock-data";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="mb-6">
      <ScrollArea className="whitespace-nowrap py-2" orientation="horizontal">
        <div className="inline-flex space-x-2 px-4">
          {musicGenres.map((genre) => (
            <Button
              key={genre}
              variant="outline"
              size="sm"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium",
                selectedCategory === genre ? 
                  "bg-gray-100 dark:bg-muted border-gray-300 dark:border-gray-700" : 
                  "bg-white dark:bg-background border-gray-300 dark:border-gray-700"
              )}
              onClick={() => onCategoryChange(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
