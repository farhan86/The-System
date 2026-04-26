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
      body: JSON.stringify({ project_id: selectedProject, title: newTaskTitle, status })
    });
    if (res.ok) {
      setNewTaskTitle("");
      setAddingTo(null);
      fetchData();
    }
  };

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#f0f8ff] m-0">
            Task <span className="text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.4)]">Board</span>
          </h2>
          <p className="text-sm text-[rgba(240,248,255,0.35)] mt-2">
            Manage and track progress across all project tasks.
          </p>
        </div>

        <select 
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="w-full md:w-auto bg-[rgba(14,12,28,0.5)] border border-[rgba(138,43,226,0.3)] rounded-xl px-4 py-3 text-[#f0f8ff] text-sm outline-none cursor-pointer"
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Kanban Columns - Horizontal scroll on mobile */}
      <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto pb-6 snap-x no-scrollbar">
        {columns.map(col => (
          <div key={col} className="min-w-[280px] md:min-w-0 flex-1 snap-center bg-[rgba(255,255,255,0.02)] rounded-3xl p-5 border border-[rgba(255,255,255,0.05)] min-h-[500px] md:min-h-[600px]">
            <h3 className="text-xs font-bold text-[rgba(240,248,255,0.3)] uppercase tracking-widest mb-6 flex justify-between items-center">
              {col}
              <span className="bg-[rgba(255,255,255,0.05)] px-2.5 py-1 rounded-full text-[10px]">
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {tasks.filter(t => t.status === col).map(task => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[rgba(14,12,28,0.8)] border border-[rgba(138,43,226,0.15)] rounded-2xl p-4 shadow-lg"
                  >
                    <div className="text-[#f0f8ff] text-sm font-semibold mb-3 leading-tight">{task.title}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#457bff] font-bold uppercase tracking-wide opacity-60">
                        {task.project_name || "General"}
                      </span>
                      <div className="flex gap-2">
                        {col !== "To Do" && <button onClick={() => updateStatus(task.id, columns[columns.indexOf(col)-1])} className={btnClass}>←</button>}
                        {col !== "Done" && <button onClick={() => updateStatus(task.id, columns[columns.indexOf(col)+1])} className={btnClass}>→</button>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedProject && (
                addingTo === col ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && createTask(col)} placeholder="Task title..." className="w-full bg-[#0e0c1c] border border-[#457bff] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
                    <div className="flex gap-2">
                      <button onClick={() => createTask(col)} className="flex-1 bg-[#457bff] rounded-lg text-white text-[11px] font-bold py-2 cursor-pointer">Add</button>
                      <button onClick={() => setAddingTo(null)} className="flex-1 bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-[11px] py-2 cursor-pointer">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingTo(col)} className="mt-2 bg-transparent border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl py-3 text-[rgba(240,248,255,0.2)] text-xs cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-all">
                    + Add Task
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const btnClass = "bg-[rgba(255,255,255,0.05)] border-none rounded-md text-[rgba(240,248,255,0.4)] text-xs cursor-pointer px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] transition-all";
