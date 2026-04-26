"use client";
import ProjectCreator from "@/components/ProjectCreator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DashboardClient({ firstName, stats, posts, projects, PostCard, StatCard }: any) {
  const router = useRouter();
  const [projectFilter, setProjectFilter] = useState("Active");

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
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 md:gap-10 pb-10">
      
      {/* 1. WELCOME & STATS (Top on all devices) */}
      <div className="flex flex-col gap-6 md:gap-10 order-1">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Total Posts"     value={stats.totalPosts     ?? 0} accent href="/board" />
          <StatCard label="Active Projects"  value={stats.totalProjects  ?? 0} href="/timeline" />
          <StatCard label="Pending Tasks"   value={stats.pendingTasks   ?? 0} href="/tasks" />
          <StatCard label="Active Members"  value={stats.totalMembers   ?? 0} href="/members" />
        </div>
      </div>

      {/* 2. PROJECT TOOLS (Sidebar on desktop, Middle-low on mobile) */}
      <div className="flex flex-col gap-6 md:gap-8 order-3 lg:order-2">
        <ProjectCreator onCreated={() => router.refresh()} />
        
        <div className="bg-[rgba(14,12,28,0.6)] backdrop-blur-xl rounded-2xl p-5 border border-[rgba(138,43,226,0.15)] shadow-xl">
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

          <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-[rgba(240,248,255,0.2)]">No {projectFilter.toLowerCase()} projects.</p>
            ) : (
              filteredProjects.map((p: any) => (
                <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-semibold text-[#f0f8ff]">{p.name}</div>
                    <button 
                      onClick={() => toggleProjectStatus(p.id, p.status)}
                      className="bg-none border-none cursor-pointer text-[10px] text-[#457bff] opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {p.status === 'Completed' ? 'Activate' : 'Complete'}
                    </button>
                  </div>
                  <div className="flex justify-between mt-1.5 items-center">
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${p.status === 'Completed' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {p.status === 'Completed' ? 'Inactive' : 'Active'}
                    </span>
                    <span className="text-[9px] text-white/20 font-bold">{p.end_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. FEEDS & EFFICIENCY (Bottom-Middle) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 order-2 lg:order-3 lg:col-span-1">
        {/* Recent Board Activity */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white/60 mb-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#8a2be2] shadow-[0_0_10px_#8a2be2]" />
            Recent Activity
          </h3>
          <div className="flex flex-col gap-3">
            {posts.slice(0, 4).map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white/60 mb-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#457bff] shadow-[0_0_10px_#457bff]" />
            System Efficiency
          </h3>
          
          <div className="bg-[rgba(14,12,28,0.6)] backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col gap-6 shadow-2xl">
            <div className="relative">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Team Flow</div>
                  <div className="text-3xl font-black text-[#f0f8ff]">{completionRate}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/20 font-bold">{stats.doneTasks} / {totalTasks} Tasks</div>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.doneTasks / totalTasks) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.progressTasks / totalTasks) * 100}%` }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 opacity-60" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-[9px] text-white/30 uppercase mb-1">To Do</div>
                <div className="text-lg font-black text-white">{stats.todoTasks}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <div className="text-[9px] text-blue-400 uppercase mb-1">Doing</div>
                <div className="text-lg font-black text-blue-400">{stats.progressTasks}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <div className="text-[9px] text-emerald-400 uppercase mb-1">Done</div>
                <div className="text-lg font-black text-emerald-400">{stats.doneTasks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
