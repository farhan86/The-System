import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import RealtimeNotifications from "@/components/RealtimeNotifications";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-transparent">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      
      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 h-screen relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        <RealtimeNotifications />
      </div>
    </div>
  );
}
