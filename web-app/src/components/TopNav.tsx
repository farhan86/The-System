"use client";
import { useSession, signOut } from "next-auth/react";

export default function TopNav() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div
      className="h-16 md:h-20 w-full flex-shrink-0 flex items-center justify-between px-4 md:px-8 z-10"
      style={{
        background: "rgba(10, 10, 20, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(138,43,226,0.12)",
      }}
    >
      {/* Left: current section hint */}
      <div className="flex items-center gap-3">
        <div className="text-[10px] md:text-[12px] font-semibold text-white/20 tracking-[0.2em] uppercase">
          The System
        </div>
        <button className="md:hidden text-white/10 hover:text-white/30 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#6a0dad] to-[#457bff] shadow-lg shadow-indigo-500/20 flex items-center justify-center text-[10px] md:text-xs font-black text-white flex-shrink-0 border border-white/10">
            {initials}
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs md:text-sm font-bold text-[#f0f8ff] leading-none mb-0.5">
              {user?.name ?? "..."}
            </span>
            <span className="hidden md:inline text-[10px] text-white/30 font-medium italic">
              {user?.email ?? ""}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 md:px-4 md:py-1.5 text-rose-400 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all hover:bg-rose-500/20 hover:border-rose-500/40 active:scale-95"
        >
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
        </button>
      </div>
    </div>
  );
}
