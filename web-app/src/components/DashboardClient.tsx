"use client";
import ProjectCreator from "@/components/ProjectCreator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DashboardClient({ firstName, stats, posts, projects, PostCard, StatCard }: any) {
  const router = useRouter();
  const [projectFilter, setProjectFilter] = useState("Active");
  const [efficiencyProjectId, setEfficiencyProjectId] = useState<string>("all");

  const filteredProjects = projects.filter((p: any) => {
    if (projectFilter === "All") return true;
    if (projectFilter === "Active") return p.status !== "Completed";
    if (projectFilter === "Inactive") return p.status === "Completed";
    return true;
  });

  const efficiencyStats = efficiencyProjectId === "all" 
    ? {
        todo: stats.todoTasks || 0,
        progress: stats.progressTasks || 0,
        done: stats.doneTasks || 0
      }
    : (() => {
        const p = projects.find((p: any) => p.id.toString() === efficiencyProjectId);
        return {
          todo: p?.todo_tasks || 0,
          progress: p?.progress_tasks || 0,
          done: p?.done_tasks || 0
        };
      })();

  const effTotal = efficiencyStats.todo + efficiencyStats.progress + efficiencyStats.done;
  const effRate = effTotal > 0 ? Math.round((efficiencyStats.done / effTotal) * 100) : 0;

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
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-8 md:gap-10 pb-10">
      
      {/* LEFT COLUMN: PRIMARY WORKSPACE */}
      <div className="flex flex-col gap-8 order-1">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#f0f8ff] m-0 flex items-center gap-3">
              Welcome back, <span className="text-[#457bff] tracking-tight">{firstName}</span> 
            </h2>
            <p className="text-sm text-white/30 mt-1 font-medium">
              System core is active. Monitoring {projects.length} concurrent projects.
            </p>
          </div>
        </div>

        {/* Core Metrics - Dense Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Posts"     value={stats.totalPosts     ?? 0} accent href="/board" />
          <StatCard label="Active Projects"  value={stats.totalProjects  ?? 0} href="/timeline" />
          <StatCard label="Pending Tasks"   value={stats.pendingTasks   ?? 0} href="/tasks" />
          <StatCard label="Active Members"  value={stats.totalMembers   ?? 0} href="/members" />
        </div>

        {/* Content Feed Grid - Tightened */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* Activity Feed */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#8a2be2] rounded-full" />
                Live Feed
              </h3>
              <span className="text-[10px] text-white/10 font-bold">LATEST 4 POSTS</span>
            </div>
            <div className="flex flex-col gap-4">
              {posts.slice(0, 4).map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Efficiency Analytics */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#457bff] rounded-full" />
                Performance
              </h3>
              <select 
                value={efficiencyProjectId} 
                onChange={(e) => setEfficiencyProjectId(e.target.value)}
                className="bg-transparent text-[10px] font-black text-[#457bff] uppercase border-none outline-none cursor-pointer hover:text-white transition-colors"
              >
                <option value="all">Global System</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id.toString()}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-[#0a0a14]/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 flex flex-col gap-6 shadow-2xl">
              <div className="relative">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Completion Index</div>
                    <div className="text-4xl font-black text-[#f0f8ff] tracking-tighter">{effRate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/10 font-black uppercase">{efficiencyStats.done} / {effTotal} COMPLETED</div>
                  </div>
                </div>
                
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${effTotal > 0 ? (efficiencyStats.done / effTotal) * 100 : 0}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${effTotal > 0 ? (efficiencyStats.progress / effTotal) * 100 : 0}%` }} className="h-full bg-[#457bff] opacity-20" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[9px] text-white/20 font-black uppercase mb-1">To Do</div>
                  <div className="text-xl font-black text-white/80">{efficiencyStats.todo}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                  <div className="text-[9px] text-blue-400 font-black uppercase mb-1">Doing</div>
                  <div className="text-xl font-black text-blue-400">{efficiencyStats.progress}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                  <div className="text-[9px] text-emerald-400 font-black uppercase mb-1">Done</div>
                  <div className="text-xl font-black text-emerald-400">{efficiencyStats.done}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: MANAGEMENT (Sidebar) */}
      <div className="flex flex-col gap-6 order-2 lg:order-last border-l border-white/5 lg:pl-8">
        
        {/* Creator Module */}
        <div className="flex flex-col gap-3">
           <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-1">Initialize Module</h3>
           <ProjectCreator onCreated={() => router.refresh()} />
        </div>
        
        {/* Project Registry */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Registry</h3>
            <div className="flex gap-1">
              {["Active", "Inactive", "All"].map(f => (
                <button 
                  key={f}
                  onClick={() => setProjectFilter(f)}
                  className={`text-[8px] px-2 py-1 rounded-md font-black transition-all border ${
                    projectFilter === f 
                    ? "bg-[#457bff]/20 text-[#457bff] border-[#457bff]/40" 
                    : "bg-transparent text-white/10 border-white/5"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto no-scrollbar">
            {filteredProjects.length === 0 ? (
              <p className="text-[11px] text-white/10 font-bold italic px-1">No matches in registry.</p>
            ) : (
              filteredProjects.map((p: any) => (
                <div key={p.id} className="group relative p-4 bg-[#0a0a14]/40 rounded-xl border border-white/5 hover:border-[#457bff]/30 transition-all overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#457bff] transition-colors">{p.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Completed' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                         <span className={`text-[9px] font-black uppercase tracking-tighter ${p.status === 'Completed' ? 'text-rose-500/60' : 'text-emerald-500/60'}`}>
                           {p.status}
                         </span>
                      </div>
                    </div>
                    
                    {/* ENHANCED UX: Status Toggle Button */}
                    <button 
                      onClick={() => toggleProjectStatus(p.id, p.status)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                        p.status === 'Completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {p.status === 'Completed' ? 'Re-Activate' : 'Complete'}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-[9px] text-white/10 font-bold border-t border-white/5 pt-3">
                    <span className="uppercase">Deadline</span>
                    <span>{p.end_date}</span>
                  </div>
                </div>
              ))
            )}
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
