import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  Upload, 
  Bell, 
  Sun, 
  Moon 
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useSidebar } from "@/hooks/use-sidebar";

interface HeaderProps {
  onOpenUploadModal: () => void;
}

export function Header({ onOpenUploadModal }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { openSidebar } = useSidebar();
  const [location, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-background z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={openSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/" className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-primary"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <polygon points="10,8 16,12 10,16" fill="white" />
            </svg>
            <span className="ml-2 text-xl font-bold">MusiTube</span>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input
              type="text"
              placeholder="Rechercher de la musique..."
              className="w-full py-2 pl-4 pr-10 rounded-full bg-gray-100 dark:bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost"
            className="flex items-center space-x-1 p-2"
            onClick={onOpenUploadModal}
          >
            <Upload className="h-5 w-5" />
            <span className="hidden md:inline">Importer</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Rechercher de la musique..."
            className="w-full py-2 pl-4 pr-10 rounded-full bg-gray-100 dark:bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit"
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </header>
  );
}
