"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: "Home" },
  { href: "/tasks",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, label: "Tasks" },
  { href: "/board",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/></svg>, label: "Board" },
  { href: "/activity",  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, label: "Inbox" },
  { href: "/chat",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>, label: "Chat" },
  { href: "/timeline",  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>, label: "Time" },
  { href: "/admin",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Admin" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      height: 70, background: "rgba(10, 10, 20, 0.98)",
      backdropFilter: "blur(30px)",
      borderTop: "1px solid rgba(138,43,226,0.3)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, padding: "0 5px",
      boxShadow: "0 -10px 40px rgba(0,0,0,0.5)"
    }}>
      {navItems.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 no-underline transition-all flex-1">
            <span className={`transition-all ${active ? "text-[#457bff] scale-110 drop-shadow-[0_0_8px_rgba(69,123,255,0.6)]" : "text-white/20"}`}>
              {icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? "text-white" : "text-white/20"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
