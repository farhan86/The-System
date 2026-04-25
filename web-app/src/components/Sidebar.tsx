import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-20 lg:w-64 h-full glass-panel border-r border-[#ffffff0a] border-t-0 border-l-0 border-b-0 flex flex-col items-center lg:items-start py-8 rounded-none transition-all duration-300">
      <div className="px-4 lg:px-8 mb-12 hidden lg:block w-full">
        <h2 className="text-3xl font-extrabold text-glow tracking-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary] to-[--color-secondary]">System</span></h2>
      </div>
      
      <nav className="flex flex-col gap-4 w-full px-4 lg:px-6 mt-8 lg:mt-0">
        <Link href="/dashboard" className="flex items-center gap-4 p-3 rounded-xl text-white/50 hover:text-white hover:bg-[--color-glass-strong] transition-all group">
          <div className="w-8 h-8 rounded-lg bg-[--color-muted] group-hover:bg-[--color-primary] flex items-center justify-center transition-colors shadow-lg">📊</div>
          <span className="hidden lg:inline font-medium">Dashboard</span>
        </Link>
        <Link href="/activity" className="flex items-center gap-4 p-3 rounded-xl text-white/50 hover:text-white hover:bg-[--color-glass-strong] transition-all group">
          <div className="w-8 h-8 rounded-lg bg-[--color-muted] group-hover:bg-[--color-primary] flex items-center justify-center transition-colors shadow-lg">🔔</div>
          <span className="hidden lg:inline font-medium">Activity</span>
        </Link>
        <Link href="/board" className="flex items-center gap-4 p-3 rounded-xl text-white/50 hover:text-white hover:bg-[--color-glass-strong] transition-all group">
          <div className="w-8 h-8 rounded-lg bg-[--color-muted] group-hover:bg-[--color-primary] flex items-center justify-center transition-colors shadow-lg">📝</div>
          <span className="hidden lg:inline font-medium">Board</span>
        </Link>
        <Link href="/chat" className="flex items-center gap-4 p-3 rounded-xl text-white/50 hover:text-white hover:bg-[--color-glass-strong] transition-all group">
          <div className="w-8 h-8 rounded-lg bg-[--color-muted] group-hover:bg-[--color-secondary] flex items-center justify-center transition-colors shadow-lg">💬</div>
          <span className="hidden lg:inline font-medium">Live Chat</span>
        </Link>
      </nav>
    </div>
  );
}
