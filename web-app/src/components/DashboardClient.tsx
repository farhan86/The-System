"use client";
import ProjectCreator from "@/components/ProjectCreator";
import { useRouter } from "next/navigation";

export default function DashboardClient({ firstName, stats, posts, PostCard, StatCard }: any) {
  const router = useRouter();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40 }}>
      {/* Main Content */}
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

        {/* Stat Widgets */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <StatCard label="Total Posts"     value={stats.totalPosts   ?? 0} accent />
          <StatCard label="Active Projects"  value={0} /> {/* We can update this once we have project stats */}
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

      {/* Sidebar - Project Creator */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ProjectCreator onCreated={() => router.refresh()} />
      </div>
    </div>
  );
}
