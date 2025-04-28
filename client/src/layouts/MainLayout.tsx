import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { UploadModal } from "@/components/UploadModal";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  return (
    <>
      <Header onOpenUploadModal={() => setIsUploadModalOpen(true)} />
      
      <div className="flex pt-14">
        <Sidebar />
        
        <main className="flex-1 pt-2 pb-24 lg:ml-64">
          <div className="px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
      
      <AudioPlayer />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}
