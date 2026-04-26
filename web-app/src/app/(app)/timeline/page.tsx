"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function GanttPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        const activeOnly = Array.isArray(data) ? data.filter((p: any) => p.status !== 'Completed') : [];
        setProjects(activeOnly);
        setLoading(false);
      });
  }, []);

  const dates = projects.flatMap(p => [new Date(p.start_date), new Date(p.end_date)]);
  const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
  const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 7);

  const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);

  const getPos = (dateStr: string) => {
    const date = new Date(dateStr);
    return ((date.getTime() - minDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#f0f8ff] m-0">
          Project <span className="text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.4)]">Timeline</span>
        </h2>
        <p className="text-sm text-[rgba(240,248,255,0.35)] mt-2">
          Visual roadmap of all active and upcoming projects.
        </p>
      </div>

      <div className="bg-[rgba(14,12,28,0.6)] backdrop-blur-2xl rounded-3xl border border-[rgba(138,43,226,0.15)] p-4 md:p-8 overflow-x-auto no-scrollbar shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-white/20">Loading timeline...</div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-white/20 italic">No active projects found. Create one to see the roadmap!</div>
        ) : (
          <div className="min-w-[800px]">
            {/* Timeline Header */}
            <div className="flex border-b border-white/5 mb-6 pb-3">
              <div className="w-[180px] font-bold text-white/30 text-[10px] uppercase tracking-widest">Project</div>
              <div className="flex-1 relative h-5">
                <span className="absolute left-0 text-[10px] text-white/20 font-bold">{minDate.toLocaleDateString()}</span>
                <span className="absolute right-0 text-[10px] text-white/20 font-bold">{maxDate.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Bars */}
            <div className="flex flex-col gap-5">
              {projects.map((p, i) => {
                const start = getPos(p.start_date);
                const end = getPos(p.end_date);
                const width = Math.max(end - start, 5); // Ensure min width for visibility

                return (
                  <div key={p.id} className="flex items-center">
                    <div className="w-[180px] font-bold text-[#f0f8ff] text-sm pr-4 truncate">{p.name}</div>
                    <div className="flex-1 relative h-8 bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${width}%`, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                        style={{ left: `${start}%` }}
                        className={`absolute top-1 bottom-1 rounded-md px-3 flex items-center shadow-lg ${
                          p.status === 'Completed' 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-green-500/20' 
                          : 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-blue-500/20'
                        }`}
                      >
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate">
                          {p.status}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll Tip for Mobile */}
      <div className="mt-4 text-center md:hidden">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">← Swipe horizontally to view timeline →</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
