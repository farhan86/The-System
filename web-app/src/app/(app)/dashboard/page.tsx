import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats() {
  const BRIDGE_URL = process.env.API_BRIDGE_URL!;
  const SECRET = process.env.BRIDGE_SECRET!;
  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_stats", secret: SECRET }),
      cache: "no-store",
    });
    if (!res.ok) return { totalPosts: 0, totalMembers: 0 };
    return res.json();
  } catch {
    return { totalPosts: 0, totalMembers: 0 };
  }
}

async function getRecentPosts() {
  const BRIDGE_URL = process.env.API_BRIDGE_URL!;
  const SECRET = process.env.BRIDGE_SECRET!;
  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_posts", secret: SECRET, limit: 5 }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const [stats, posts] = await Promise.all([getStats(), getRecentPosts()]);
  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: "#f0f8ff" }}>
          Welcome back, <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.5)" }}>{firstName}</span> 👋
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 4 }}>Here&apos;s what&apos;s happening in The System today.</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Posts", value: stats.totalPosts ?? 0, accent: true },
          { label: "Notifications", value: 0, accent: false },
          { label: "Active Members", value: stats.totalMembers ?? 0, accent: false },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            style={{
              background: "rgba(14,12,28,0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(138,43,226,0.15)",
              transition: "border-color 0.3s, transform 0.2s",
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
            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,248,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{label}</p>
            <p style={{
              fontSize: 44, fontWeight: 900, margin: 0,
              color: accent ? "#457bff" : "#f0f8ff",
              textShadow: accent ? "0 0 20px rgba(69,123,255,0.5)" : "none",
            }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Board Activity */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "rgba(240,248,255,0.65)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8a2be2", display: "inline-block", boxShadow: "0 0 10px rgba(138,43,226,0.8)", animation: "pulse 2s infinite" }} />
          Recent Board Activity
        </h3>

        {posts.length === 0 ? (
          <div style={{
            padding: 40, borderRadius: 16, textAlign: "center",
            background: "rgba(14,12,28,0.5)", border: "1px dashed rgba(138,43,226,0.2)",
          }}>
            <p style={{ color: "rgba(240,248,255,0.25)", fontSize: 14 }}>No posts yet. Be the first to share knowledge on the Board!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((post: any) => (
              <div
                key={post.id}
                style={{
                  background: "rgba(14,12,28,0.7)", backdropFilter: "blur(20px)",
                  borderRadius: 14, padding: 20, cursor: "pointer",
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
                <p style={{ fontSize: 13, color: "rgba(240,248,255,0.4)", margin: "0 0 12px 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
