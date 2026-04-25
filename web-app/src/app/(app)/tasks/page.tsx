"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  project_name?: string;
  assigned_name?: string;
}

interface Project {
  id: number;
  name: string;
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [tRes, pRes] = await Promise.all([
      fetch(selectedProject ? `/api/tasks?projectId=${selectedProject}` : "/api/tasks"),
      fetch("/api/projects")
    ]);
    const tData = await tRes.json();
    const pData = await pRes.json();
    setTasks(Array.isArray(tData) ? tData : []);
    const activeOnly = Array.isArray(pData) ? pData.filter((p: any) => p.status !== 'Completed') : [];
    setProjects(activeOnly);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [selectedProject]);

  const updateStatus = async (taskId: number, newStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ action: "update_task_status", task_id: taskId, status: newStatus })
    });
  };

  const createTask = async (status: string) => {
    if (!newTaskTitle || !selectedProject) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ 
        project_id: selectedProject, 
        title: newTaskTitle,
        status 
      })
    });
    if (res.ok) {
      setNewTaskTitle("");
      setAddingTo(null);
      fetchData();
    }
  };

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
            Task <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.4)" }}>Board</span>
          </h2>
          <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
            Manage and track progress across all project tasks.
          </p>
        </div>

        <select 
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          style={{
            background: "rgba(14,12,28,0.5)", border: "1px solid rgba(138,43,226,0.3)",
            borderRadius: 10, padding: "10px 16px", color: "#f0f8ff", outline: "none", cursor: "pointer"
          }}
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {columns.map(col => (
          <div key={col} style={{ 
            background: "rgba(255,255,255,0.02)", borderRadius: 20, padding: 20,
            border: "1px solid rgba(255,255,255,0.05)", minHeight: 600
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(240,248,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
              {col}
              <span style={{ background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 10, fontSize: 10 }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AnimatePresence>
                {tasks.filter(t => t.status === col).map(task => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      background: "rgba(14,12,28,0.8)", border: "1px solid rgba(138,43,226,0.15)",
                      borderRadius: 12, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}
                  >
                    <div style={{ color: "#f0f8ff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{task.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "rgba(69,123,255,0.6)", fontWeight: 700 }}>{task.project_name || "General"}</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {col !== "To Do" && <button onClick={() => updateStatus(task.id, columns[columns.indexOf(col)-1])} style={btnStyle}>←</button>}
                        {col !== "Done" && <button onClick={() => updateStatus(task.id, columns[columns.indexOf(col)+1])} style={btnStyle}>→</button>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedProject && (
                addingTo === col ? (
                  <div style={{ marginTop: 8 }}>
                    <input 
                      autoFocus
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && createTask(col)}
                      placeholder="Task title..."
                      style={{
                        width: "100%", background: "#0e0c1c", border: "1px solid #457bff",
                        borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none"
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => createTask(col)} style={{ flex: 1, background: "#457bff", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 700, padding: 6, cursor: "pointer" }}>Add</button>
                      <button onClick={() => setAddingTo(null)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 11, padding: 6, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingTo(col)}
                    style={{
                      marginTop: 8, background: "transparent", border: "1px dashed rgba(255,255,255,0.1)",
                      borderRadius: 10, padding: 10, color: "rgba(240,248,255,0.2)", fontSize: 12, cursor: "pointer"
                    }}
                  >
                    + Add Task
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 4, 
  color: "rgba(240,248,255,0.4)", fontSize: 10, cursor: "pointer", padding: "2px 6px"
};
