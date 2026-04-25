import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatCard, PostCard } from "@/components/DashboardCards";

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

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const [stats, posts] = await Promise.all([getStats(), getRecentPosts()]);
  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {/* Welcome Header */}
      <div>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          Welcome back,{" "}
          <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.5)" }}>
            {firstName}
          </span>{" "}
          👋
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
          Here&apos;s what&apos;s happening in The System today.
        </p>
      </div>

      {/* Stat Widgets — client components handle hover */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard label="Total Posts"     value={stats.totalPosts   ?? 0} accent />
        <StatCard label="Notifications"   value={0} />
        <StatCard label="Active Members"  value={stats.totalMembers ?? 0} />
      </div>

      {/* Recent Board Activity */}
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "rgba(240,248,255,0.6)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px 0" }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#8a2be2", display: "inline-block",
            boxShadow: "0 0 10px rgba(138,43,226,0.8)",
          }} />
          Recent Board Activity
        </h3>

        {posts.length === 0 ? (
          <div style={{
            padding: 40, borderRadius: 16, textAlign: "center",
            background: "rgba(14,12,28,0.5)",
            border: "1px dashed rgba(138,43,226,0.2)",
          }}>
            <p style={{ color: "rgba(240,248,255,0.25)", fontSize: 14, margin: 0 }}>
              No posts yet. Be the first to share knowledge on the Board!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
