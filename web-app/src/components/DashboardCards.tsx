"use client";

export function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      style={{
        background: "rgba(14,12,28,0.7)",
        backdropFilter: "blur(20px)",
        borderRadius: 16,
        padding: 24,
        border: "1px solid rgba(138,43,226,0.15)",
        transition: "border-color 0.3s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.4)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.15)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,248,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </p>
      <p style={{
        fontSize: 44, fontWeight: 900, margin: 0,
        color: accent ? "#457bff" : "#f0f8ff",
        textShadow: accent ? "0 0 20px rgba(69,123,255,0.5)" : "none",
      }}>
        {value}
      </p>
    </div>
  );
}

export function PostCard({ post }: { post: any }) {
  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div
      style={{
        background: "rgba(14,12,28,0.7)",
        backdropFilter: "blur(20px)",
        borderRadius: 14,
        padding: 20,
        cursor: "pointer",
        border: "1px solid rgba(138,43,226,0.12)",
        transition: "border-color 0.3s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.35)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <h4 style={{ fontWeight: 700, fontSize: 15, color: "#f0f8ff", margin: 0 }}>{post.title}</h4>
        <span style={{ fontSize: 11, color: "rgba(240,248,255,0.25)", flexShrink: 0, marginLeft: 12 }}>{timeAgo(post.created_at)}</span>
      </div>
      <p style={{
        fontSize: 13, color: "rgba(240,248,255,0.4)", margin: "0 0 12px 0",
        overflow: "hidden", display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>
        {post.content}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #6a0dad, #457bff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#fff",
        }}>
          {post.author_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span style={{ fontSize: 12, color: "rgba(240,248,255,0.45)" }}>{post.author_name}</span>
      </div>
    </div>
  );
}
