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
      className="h-20 w-full flex-shrink-0 flex items-center justify-between px-8 z-10"
      style={{
        background: "rgba(10, 10, 20, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(138,43,226,0.12)",
      }}
    >
      {/* Left: current section hint */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,248,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        The System
      </div>

      {/* Right: Settings + User */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Settings gear */}
        <button
          title="Settings"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(240,248,255,0.35)", transition: "color 0.2s, transform 0.4s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f0f8ff";
            (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,248,255,0.35)";
            (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg)";
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)" }} />

        {/* Avatar with initials */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #6a0dad, #457bff)",
          boxShadow: "0 0 15px rgba(106,13,173,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
          userSelect: "none",
        }}>
          {initials}
        </div>

        {/* User name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f8ff" }}>
            {user?.name ?? "..."}
          </span>
          <span style={{ fontSize: 10, color: "rgba(240,248,255,0.3)" }}>
            {user?.email ?? ""}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 8, padding: "6px 14px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, color: "rgba(251,113,133,0.7)",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.15)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,63,94,0.5)";
            (e.currentTarget as HTMLButtonElement).style.color = "#fb7185";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.08)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,63,94,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(251,113,133,0.7)";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
