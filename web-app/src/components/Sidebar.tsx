"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: "Dashboard" },
  { href: "/tasks",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, label: "Tasks" },
  { href: "/activity",  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, label: "Activity" },
  { href: "/board",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/></svg>, label: "Board" },
  { href: "/timeline",  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>, label: "Timeline" },
  { href: "/chat",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>, label: "Chat" },
  { href: "/admin",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Admin" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-20 lg:w-64 h-full flex flex-col py-8 flex-shrink-0"
      style={{
        background: "rgba(10, 10, 20, 0.7)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(138,43,226,0.15)",
      }}
    >
      <div className="px-6 mb-12 hidden lg:block">
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>
          <span style={{ color: "#f0f8ff" }}>The </span>
          <span style={{
            color: "#457bff",
            textShadow: "0 0 12px rgba(69,123,255,0.8)",
          }}>
            System
          </span>
        </h2>
        <p style={{ fontSize: 9, color: "rgba(240,248,255,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 4 }}>
          Security & Command
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 12px" }}>
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all border ${
                active 
                ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(138,43,226,0.1)]" 
                : "border-transparent text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/30"}`}>
                {icon}
              </span>
              <span className="hidden lg:inline font-bold text-xs uppercase tracking-widest">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
