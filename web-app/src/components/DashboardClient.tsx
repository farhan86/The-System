"use client";
import ProjectCreator from "@/components/ProjectCreator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DashboardClient({ firstName, stats, posts, projects, PostCard, StatCard }: any) {
  const router = useRouter();
  const [projectFilter, setProjectFilter] = useState("Active"); // 'Active', 'Inactive', 'All'

  const filteredProjects = projects.filter((p: any) => {
    if (projectFilter === "All") return true;
    if (projectFilter === "Active") return p.status !== "Completed";
    if (projectFilter === "Inactive") return p.status === "Completed";
    return true;
  });

  const toggleProjectStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Active" : "Completed";
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_project_status", id, status: newStatus })
    });
    router.refresh();
  };

  const totalTasks = (stats.todoTasks || 0) + (stats.progressTasks || 0) + (stats.doneTasks || 0);
  const completionRate = totalTasks > 0 ? Math.round((stats.doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 md:gap-10">
      {/* Main Content */}
      <div className="flex flex-col gap-8 md:gap-10">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#f0f8ff] m-0">
            Welcome back,{" "}
            <span className="text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.5)]">
              {firstName}
            </span>{" "}
            👋
          </h2>
          <p className="text-sm text-[rgba(240,248,255,0.35)] mt-2">
            Here&apos;s what&apos;s happening in The System today.
          </p>
        </div>

        {/* Stat Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Posts"     value={stats.totalPosts     ?? 0} accent href="/board" />
          <StatCard label="Active Projects"  value={stats.totalProjects  ?? 0} href="/timeline" />
          <StatCard label="Pending Tasks"   value={stats.pendingTasks   ?? 0} href="/tasks" />
          <StatCard label="Active Members"  value={stats.totalMembers   ?? 0} href="/members" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Board Activity */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold text-[rgba(240,248,255,0.6)] mb-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#8a2be2] inline-block [box-shadow:0_0_10px_rgba(138,43,226,0.8)]" />
              Recent Activity
            </h3>

            {posts.length === 0 ? (
              <div className="p-10 rounded-2xl text-center bg-[rgba(14,12,28,0.5)] border border-dashed border-[rgba(138,43,226,0.2)]">
                <p className="text-sm text-[rgba(240,248,255,0.25)] m-0">No activity yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Task Breakdown */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold text-[rgba(240,248,255,0.6)] mb-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#457bff] inline-block [box-shadow:0_0_10px_rgba(69,123,255,0.8)]" />
              System Efficiency
            </h3>
            
            <div className="bg-[rgba(14,12,28,0.6)] backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-[rgba(138,43,226,0.15)] flex flex-col gap-6 shadow-2xl">
              <div className="relative">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="text-[10px] md:text-[11px] font-bold text-[rgba(240,248,255,0.3)] uppercase tracking-widest">Overall Progress</div>
                    <div className="text-2xl md:text-3xl font-black text-[#f0f8ff]">{completionRate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[rgba(240,248,255,0.2)]">{stats.doneTasks} of {totalTasks} Tasks</div>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(stats.doneTasks / totalTasks) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] [box-shadow:0_0_15px_rgba(34,197,94,0.4)]" 
                  />
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(stats.progressTasks / totalTasks) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#457bff] to-[#6aabff] opacity-80" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                  <div className="text-[9px] text-[rgba(240,248,255,0.25)] uppercase mb-1">To Do</div>
                  <div className="text-base md:text-lg font-extrabold text-[#f0f8ff]">{stats.todoTasks}</div>
                </div>
                <div className="p-3 rounded-xl bg-[rgba(69,123,255,0.05)] border border-[rgba(69,123,255,0.1)]">
                  <div className="text-[9px] text-[rgba(69,123,255,0.5)] uppercase mb-1">In Progress</div>
                  <div className="text-base md:text-lg font-extrabold text-[#457bff]">{stats.progressTasks}</div>
                </div>
                <div className="p-3 rounded-xl bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.1)]">
                  <div className="text-[9px] text-[rgba(34,197,94,0.5)] uppercase mb-1">Done</div>
                  <div className="text-base md:text-lg font-extrabold text-[#22c55e]">{stats.doneTasks}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[rgba(138,43,226,0.05)] border border-[rgba(138,43,226,0.1)] text-center">
                <p className="text-[10px] md:text-[11px] text-[rgba(240,248,255,0.4)] m-0">
                  Team output is <span className="text-[#8a2be2] font-extrabold">Steady</span>. 
                  {stats.pendingTasks > 10 ? " High workload." : " Balanced sprints."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Project Creator & List */}
      <div className="flex flex-col gap-6 md:gap-8 order-first lg:order-last">
        <ProjectCreator onCreated={() => router.refresh()} />
        
        <div className="bg-[rgba(14,12,28,0.6)] backdrop-blur-xl rounded-2xl p-5 border border-[rgba(138,43,226,0.15)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#f0f8ff] m-0">📁 Projects</h3>
            <div className="flex gap-1">
              {["Active", "Inactive", "All"].map(f => (
                <button 
                  key={f}
                  onClick={() => setProjectFilter(f)}
                  className={`text-[9px] px-2 py-1 rounded cursor-pointer transition-all border ${
                    projectFilter === f 
                    ? "bg-[rgba(69,123,255,0.2)] text-[#457bff] border-[rgba(69,123,255,0.4)]" 
                    : "bg-transparent text-[rgba(240,248,255,0.2)] border-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-[rgba(240,248,255,0.2)]">No {projectFilter.toLowerCase()} projects.</p>
            ) : (
              filteredProjects.map((p: any) => (
                <div key={p.id} className="p-3 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-semibold text-[#f0f8ff]">{p.name}</div>
                    <button 
                      onClick={() => toggleProjectStatus(p.id, p.status)}
                      className="bg-none border-none cursor-pointer text-[10px] text-[rgba(69,123,255,0.4)] hover:text-[#457bff] transition-colors"
                    >
                      {p.status === 'Completed' ? 'Activate' : 'Complete'}
                    </button>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className={`text-[10px] font-bold ${p.status === 'Completed' ? 'text-[#fb7185]' : 'text-[#22c55e]'}`}>
                      {p.status === 'Completed' ? 'Inactive' : 'Active'}
                    </span>
                    <span className="text-[10px] text-[rgba(240,248,255,0.2)]">{p.end_date}</span>
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
