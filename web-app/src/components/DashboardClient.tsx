"use client";
import ProjectCreator from "@/components/ProjectCreator";
import { useRouter } from "next/navigation";

export default function DashboardClient({ firstName, stats, posts, projects, PostCard, StatCard }: any) {
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
          <StatCard label="Total Posts"     value={stats.totalPosts     ?? 0} accent href="/board" />
          <StatCard label="Total Projects"  value={stats.totalProjects  ?? 0} href="/timeline" />
          <StatCard label="Pending Tasks"   value={stats.pendingTasks   ?? 0} href="/tasks" />
          <StatCard label="Active Members"  value={stats.totalMembers   ?? 0} href="/members" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Recent Board Activity */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "rgba(240,248,255,0.6)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px 0" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#8a2be2", display: "inline-block",
                boxShadow: "0 0 10px rgba(138,43,226,0.8)",
              }} />
              Recent Activity
            </h3>

            {posts.length === 0 ? (
              <div style={{ padding: 40, borderRadius: 16, textAlign: "center", background: "rgba(14,12,28,0.5)", border: "1px dashed rgba(138,43,226,0.2)" }}>
                <p style={{ color: "rgba(240,248,255,0.25)", fontSize: 14, margin: 0 }}>No activity yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Task Breakdown */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "rgba(240,248,255,0.6)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px 0" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#457bff", display: "inline-block",
                boxShadow: "0 0 10px rgba(69,123,255,0.8)",
              }} />
              Task Breakdown
            </h3>
            
            <div style={{
              background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
              borderRadius: 20, padding: 24, border: "1px solid rgba(138,43,226,0.15)",
              display: "flex", flexDirection: "column", gap: 20
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "rgba(240,248,255,0.5)" }}>Efficiency</span>
                  <span style={{ color: "#457bff", fontWeight: 700 }}>{stats.pendingTasks === 0 ? "100%" : "Optimizing..."}</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                   <div style={{ width: stats.pendingTasks === 0 ? "100%" : "40%", height: "100%", background: "#457bff", borderRadius: 3, boxShadow: "0 0 10px #457bff" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 10, color: "rgba(240,248,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>Pending</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f8ff" }}>{stats.pendingTasks}</div>
                </div>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 10, color: "rgba(240,248,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>Active Projects</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#457bff" }}>{stats.totalProjects}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Project Creator & List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ProjectCreator onCreated={() => router.refresh()} />
        
        <div style={{
          background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
          borderRadius: 16, padding: 20, border: "1px solid rgba(138,43,226,0.15)"
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f8ff", margin: "0 0 16px" }}>📁 All Projects</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.length === 0 ? (
              <p style={{ color: "rgba(240,248,255,0.2)", fontSize: 12 }}>No projects yet.</p>
            ) : (
              projects.map((p: any) => (
                <div key={p.id} style={{
                  padding: "10px 14px", background: "rgba(255,255,255,0.03)", 
                  borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ color: "#f0f8ff", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: p.status === 'Completed' ? '#22c55e' : '#457bff' }}>● {p.status}</span>
                    <span style={{ fontSize: 10, color: "rgba(240,248,255,0.2)" }}>{p.end_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
