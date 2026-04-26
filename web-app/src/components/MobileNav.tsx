"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Home" },
  { href: "/tasks",     icon: "✅", label: "Tasks" },
  { href: "/board",     icon: "📝", label: "Board" },
  { href: "/chat",      icon: "💬", label: "Chat" },
  { href: "/timeline",  icon: "📅", label: "Time" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      height: 70, background: "rgba(10, 10, 20, 0.95)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(138,43,226,0.3)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, padding: "0 10px"
    }}>
      {navItems.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, textDecoration: "none", color: active ? "#457bff" : "rgba(240,248,255,0.4)",
            transition: "all 0.2s"
          }}>
            <span style={{ 
              fontSize: 20, opacity: active ? 1 : 0.6,
              textShadow: active ? "0 0 10px rgba(69,123,255,0.5)" : "none"
            }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
