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
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // Calculate chart range
  const dates = projects.flatMap(p => [new Date(p.start_date), new Date(p.end_date)]);
  const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
  const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  
  // Padding for visual
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 7);

  const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);

  const getPos = (dateStr: string) => {
    const date = new Date(dateStr);
    return ((date.getTime() - minDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100;
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          Project <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.4)" }}>Timeline</span>
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
          Visual roadmap of all active and upcoming projects.
        </p>
      </div>

      <div style={{ 
        background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
        borderRadius: 24, border: "1px solid rgba(138,43,226,0.15)",
        padding: 32, overflowX: "auto"
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(240,248,255,0.2)" }}>Loading timeline...</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(240,248,255,0.2)" }}>No projects found. Create one in the dashboard!</div>
        ) : (
          <div style={{ minWidth: 800 }}>
            {/* Timeline Header */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 20, paddingBottom: 10 }}>
              <div style={{ width: 200, fontWeight: 700, color: "rgba(240,248,255,0.3)", fontSize: 12, textTransform: "uppercase" }}>Project Name</div>
              <div style={{ flex: 1, position: "relative", height: 20 }}>
                <span style={{ position: "absolute", left: 0, fontSize: 10, color: "rgba(240,248,255,0.2)" }}>{minDate.toLocaleDateString()}</span>
                <span style={{ position: "absolute", right: 0, fontSize: 10, color: "rgba(240,248,255,0.2)" }}>{maxDate.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {projects.map((p, i) => {
                const start = getPos(p.start_date);
                const end = getPos(p.end_date);
                const width = end - start;

                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 200, fontWeight: 600, color: "#f0f8ff", fontSize: 14 }}>{p.name}</div>
                    <div style={{ flex: 1, position: "relative", height: 32, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${width}%`, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        style={{
                          position: "absolute", left: `${start}%`, top: 4, bottom: 4,
                          background: p.status === 'Completed' ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #6a0dad, #457bff)',
                          borderRadius: 6, boxShadow: "0 0 15px rgba(69,123,255,0.3)",
                          display: "flex", alignItems: "center", padding: "0 10px",
                          fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden"
                        }}
                      >
                        {p.status}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
