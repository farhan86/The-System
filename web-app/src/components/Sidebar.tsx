"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/activity",  icon: "🔔", label: "Activity" },
  { href: "/board",     icon: "📝", label: "Board" },
  { href: "/timeline",  icon: "📅", label: "Timeline" },
  { href: "/chat",      icon: "💬", label: "Live Chat" },
  { href: "/admin",     icon: "🛡️", label: "Admin" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-20 lg:w-64 h-full flex flex-col py-8 rounded-none flex-shrink-0"
      style={{
        background: "rgba(10, 10, 20, 0.7)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(138,43,226,0.15)",
      }}
    >
      {/* Logo */}
      <div className="px-6 mb-12 hidden lg:block">
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>
          <span style={{ color: "#f0f8ff" }}>The </span>
          <span style={{
            color: "#457bff",
            textShadow: "0 0 12px rgba(69,123,255,0.8), 0 0 30px rgba(138,43,226,0.6)",
          }}>
            System
          </span>
        </h2>
        <p style={{ fontSize: 9, color: "rgba(240,248,255,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 4 }}>
          Knowledge Hub
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 12px" }}>
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "11px 14px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: active
                  ? "linear-gradient(90deg, rgba(138,43,226,0.25), rgba(69,123,255,0.15))"
                  : "transparent",
                border: `1px solid ${active ? "rgba(138,43,226,0.5)" : "transparent"}`,
                boxShadow: active ? "0 0 20px rgba(138,43,226,0.15)" : "none",
                color: active ? "#f0f8ff" : "rgba(240,248,255,0.45)",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(106,13,173,0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.25)";
                  (e.currentTarget as HTMLElement).style.color = "#f0f8ff";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(240,248,255,0.45)";
                }
              }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 8, fontSize: 15,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: active ? "rgba(138,43,226,0.3)" : "rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}>
                {icon}
              </span>
              <span className="hidden lg:inline" style={{ fontWeight: 600, fontSize: 14 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
