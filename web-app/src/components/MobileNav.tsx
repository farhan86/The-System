"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Home" },
  { href: "/tasks",     icon: "✅", label: "Tasks" },
  { href: "/board",     icon: "📝", label: "Board" },
  { href: "/activity",  icon: "🔔", label: "Inbox" },
  { href: "/chat",      icon: "💬", label: "Chat" },
  { href: "/timeline",  icon: "📅", label: "Time" },
  { href: "/admin",     icon: "🛡️", label: "Admin" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      height: 75, background: "rgba(10, 10, 20, 0.98)",
      backdropFilter: "blur(30px)",
      borderTop: "1px solid rgba(138,43,226,0.3)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, padding: "0 5px",
      boxShadow: "0 -10px 40px rgba(0,0,0,0.5)"
    }}>
      {navItems.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 2, textDecoration: "none", color: active ? "#457bff" : "rgba(240,248,255,0.3)",
            transition: "all 0.2s", flex: 1
          }}>
            <span style={{ 
              fontSize: 18, 
              filter: active ? "drop-shadow(0 0 8px rgba(69,123,255,0.8))" : "none",
              transform: active ? "scale(1.1)" : "scale(1)"
            }}>{icon}</span>
            <span style={{ 
              fontSize: 9, 
              fontWeight: 800, 
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: active ? "#f0f8ff" : "inherit"
            }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
