import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Home, 
  Flame, 
  History, 
  Clock, 
  Heart, 
  ListMusic 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { samplePlaylists } from "@/lib/mock-data";

const SidebarLink = ({ 
  icon: Icon, 
  text, 
  href, 
  active = false 
}: { 
  icon: React.ElementType; 
  text: string; 
  href: string; 
  active?: boolean;
}) => {
  return (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          active ? "bg-gray-100 dark:bg-muted" : ""
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        {text}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const [location] = useLocation();
  
  // Fetch user playlists
  const { data: playlists } = useQuery({
    queryKey: ['/api/playlists', { userId: 1 }],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // For now use sample data
      return samplePlaylists;
    }
  });
  
  // Fetch user subscriptions (channels)
  const { data: subscriptions } = useQuery({
    queryKey: ['/api/subscriptions'],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // For now, return sample users
      return [
        {
          id: 2,
          name: "Jazz Vibes",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
        },
        {
          id: 3,
          name: "Rock Legend",
          imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
        },
        {
          id: 1,
          name: "Electro Beats",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
        }
      ];
    }
  });
  
  return (
    <>
      <aside 
        className={cn(
          "fixed top-14 bottom-20 left-0 w-64 bg-white dark:bg-background border-r border-gray-200 dark:border-gray-800 transition-transform z-10 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          <div className="py-4">
            <nav className="px-3 space-y-1">
              <SidebarLink 
                icon={Home}
                text="Accueil" 
                href="/" 
                active={location === "/"} 
              />
              <SidebarLink 
                icon={Flame}
                text="Tendances" 
                href="/trending" 
                active={location === "/trending"} 
              />
              <SidebarLink 
                icon={History}
                text="Historique" 
                href="/history" 
                active={location === "/history"} 
              />
              <SidebarLink 
                icon={Clock}
                text="Récents" 
                href="/recent" 
                active={location === "/recent"} 
              />
              <SidebarLink 
                icon={Heart}
                text="Favoris" 
                href="/favorites" 
                active={location === "/favorites"} 
              />
              
              <div className="pt-4 pb-2">
                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vos playlists
                </h3>
              </div>
              
              {playlists?.map(playlist => (
                <SidebarLink 
                  key={playlist.id}
                  icon={ListMusic}
                  text={playlist.name} 
                  href={`/playlist/${playlist.id}`}
                  active={location === `/playlist/${playlist.id}`} 
                />
              ))}
              
              <div className="pt-4 pb-2">
                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Abonnements
                </h3>
              </div>
              
              {subscriptions?.map(subscription => (
                <Link key={subscription.id} href={`/channel/${subscription.id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden mr-2">
                      <img 
                        src={subscription.imageUrl} 
                        alt={subscription.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {subscription.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
}
