"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_name: string;
  project_name?: string;
  attachments?: { file_url: string; orig_filename: string }[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(14,12,28,0.75)] backdrop-blur-xl rounded-2xl p-5 md:p-6 cursor-pointer border border-[rgba(138,43,226,0.15)] hover:border-[rgba(138,43,226,0.4)] transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-base md:text-lg text-[#f0f8ff] m-0 leading-tight">{post.title}</h3>
          {post.project_name && (
            <span className="text-[10px] text-[#457bff] font-bold uppercase tracking-wider mt-1.5 block">
              Project: {post.project_name}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[rgba(240,248,255,0.25)] flex-shrink-0 ml-4">{timeAgo(post.created_at)}</span>
      </div>

      <p 
        className={`text-sm text-[rgba(240,248,255,0.5)] mb-4 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
        dangerouslySetInnerHTML={{ 
          __html: post.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
        }}
      />

      {post.attachments && post.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.attachments.map((att, i) => (
            <a key={i} href={att.file_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(69,123,255,0.1)] border border-[rgba(69,123,255,0.3)] text-[#6aabff] text-[11px] font-bold hover:bg-[rgba(69,123,255,0.2)] transition-all"
            >
              File: {att.orig_filename}
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6a0dad] to-[#457bff] flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
          {post.author_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span className="text-xs text-[rgba(240,248,255,0.4)] font-bold">{post.author_name}</span>
        <span className="text-[10px] text-[rgba(240,248,255,0.2)] ml-auto">
          {expanded ? "▲ Collapse" : "▼ Expand"}
        </span>
      </div>
    </motion.div>
  );
}

function Composer({ projects, onPosted }: { projects: Project[], onPosted: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setOpen(false); setError(null); setTitle(""); setContent(""); setFile(null); setProjectId(""); };

  const submit = async () => {
    if (!title.trim() || !content.trim()) { setError("Title and content are required."); return; }
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      if (projectId) fd.append("projectId", projectId);
      if (file) fd.append("file", file);
      const res = await fetch("/api/board", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Post failed");
      reset();
      onPosted();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="open-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className="w-full p-4 md:p-6 text-left bg-[rgba(14,12,28,0.7)] backdrop-blur-xl rounded-2xl border border-dashed border-[rgba(138,43,226,0.35)] text-[rgba(240,248,255,0.4)] text-sm transition-all hover:border-[rgba(138,43,226,0.7)] hover:text-[#f0f8ff]"
          >
            Click to share knowledge with the team...
          </motion.button>
        ) : (
          <motion.div key="composer" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[rgba(14,12,28,0.85)] backdrop-blur-2xl rounded-2xl p-6 border border-[rgba(138,43,226,0.4)] shadow-[0_0_40px_rgba(106,13,173,0.15)]"
          >
            <h3 className="text-base font-bold text-[#f0f8ff] mb-4">New Knowledge Post</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." className="md:col-span-2 bg-[rgba(10,21,67,0.4)] border border-[rgba(138,43,226,0.2)] rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
              <select value={projectId} onChange={e => setProjectId(e.target.value)} className="bg-[rgba(10,21,67,0.4)] border border-[rgba(138,43,226,0.2)] rounded-xl px-4 py-2.5 text-white text-sm outline-none cursor-pointer">
                <option value="">General (No Project)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Insights or findings..." rows={5} className="w-full bg-[rgba(10,21,67,0.4)] border border-[rgba(138,43,226,0.2)] rounded-xl px-4 py-3 text-white text-sm outline-none resize-none mb-3" />

            <div className="flex items-center gap-3 mb-6">
              <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold hover:bg-white/10">
                📎 {file ? file.name : "Attach a file"}
              </button>
              {file && <button onClick={() => setFile(null)} className="text-[10px] text-rose-500 font-bold uppercase">Remove</button>}
            </div>

            {error && <p className="text-xs text-rose-400 mb-4">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button onClick={reset} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm font-bold">Cancel</button>
              <button onClick={submit} disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a0dad] to-[#8a2be2] text-white text-sm font-bold shadow-[0_0_20px_rgba(138,43,226,0.4)] opacity-100 disabled:opacity-50">
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterProject, setFilterProject] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = filterProject ? `/api/board?projectId=${filterProject}` : "/api/board";
      const res = await fetch(url);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); fetchPosts(); }, [filterProject]);

  return (
    <div className="max-w-[760px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#f0f8ff] m-0">
            Knowledge <span className="text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.4)]">Board</span>
          </h2>
          <p className="text-sm text-[rgba(240,248,255,0.35)] mt-2">
            Share insights, research, and ideas with the team.
          </p>
        </div>
        
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="w-full md:w-48 bg-[rgba(14,12,28,0.5)] border border-[rgba(138,43,226,0.3)] rounded-xl px-4 py-2.5 text-[#f0f8ff] text-xs outline-none">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Composer projects={projects} onPosted={fetchPosts} />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 rounded-full mx-auto border-2 border-[rgba(138,43,226,0.2)] border-t-[#8a2be2] animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="p-10 rounded-2xl text-center bg-white/5 border border-dashed border-white/10">
          <p className="text-sm text-white/20">No posts found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
