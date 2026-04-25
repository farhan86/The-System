import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-transparent">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 h-screen relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
