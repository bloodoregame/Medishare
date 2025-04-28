import { cn } from "@/lib/utils";

interface WaveformProps {
  progress: number; // 0 to 1
  className?: string;
}

export function Waveform({ progress, className }: WaveformProps) {
  // Generate random heights for waveform bars
  const generateRandomHeight = () => {
    return Math.floor(Math.random() * 70) + 30; // 30% to 100%
  };
  
  // Number of bars to display
  const totalBars = 100;
  
  // Calculate the current position
  const currentPosition = Math.floor(progress * totalBars);
  
  return (
    <div className={cn("w-full h-10 flex items-end space-x-0.5", className)}>
      {Array.from({ length: totalBars }).map((_, index) => {
        // Determine if the bar is before, at, or after the current position
        let barClass = "";
        
        if (index < currentPosition) {
          barClass = "bg-primary"; // Played part
        } else if (index === currentPosition) {
          barClass = "bg-primary"; // Current position
        } else {
          barClass = "bg-gray-400 dark:bg-gray-600"; // Unplayed part
        }
        
        return (
          <div
            key={index}
            className={cn("flex-1 rounded-sm", barClass)}
            style={{ height: `${generateRandomHeight()}%` }}
          ></div>
        );
      })}
    </div>
  );
}
