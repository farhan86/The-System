"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_name: string;
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(14,12,28,0.75)", backdropFilter: "blur(20px)",
        borderRadius: 16, padding: 24, cursor: "pointer",
        border: "1px solid rgba(138,43,226,0.15)",
        transition: "border-color 0.25s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.4)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.15)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, color: "#f0f8ff", margin: 0 }}>{post.title}</h3>
        <span style={{ fontSize: 11, color: "rgba(240,248,255,0.25)", flexShrink: 0, marginLeft: 16 }}>{timeAgo(post.created_at)}</span>
      </div>

      <p style={{
        fontSize: 14, color: "rgba(240,248,255,0.5)", margin: "0 0 14px",
        overflow: expanded ? "visible" : "hidden",
        display: expanded ? "block" : "-webkit-box",
        WebkitLineClamp: expanded ? undefined : 3,
        WebkitBoxOrient: "vertical",
        lineHeight: 1.6,
      }}>
        {post.content}
      </p>

      {post.attachments && post.attachments.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {post.attachments.map((att, i) => (
            <a key={i} href={att.file_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 8, textDecoration: "none",
                background: "rgba(69,123,255,0.1)", border: "1px solid rgba(69,123,255,0.3)",
                color: "#6aabff", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(69,123,255,0.2)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(69,123,255,0.1)"}
            >
              📎 {att.orig_filename}
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "linear-gradient(135deg, #6a0dad, #457bff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
        }}>
          {post.author_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span style={{ fontSize: 12, color: "rgba(240,248,255,0.4)", fontWeight: 600 }}>{post.author_name}</span>
        <span style={{ fontSize: 11, color: "rgba(240,248,255,0.2)", marginLeft: "auto" }}>
          {expanded ? "▲ Collapse" : "▼ Expand"}
        </span>
      </div>
    </motion.div>
  );
}

function Composer({ onPosted }: { onPosted: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setOpen(false); setError(null); setTitle(""); setContent(""); setFile(null); };

  const submit = async () => {
    if (!title.trim() || !content.trim()) { setError("Title and content are both required."); return; }
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      if (file) fd.append("file", file);

      const res = await fetch("/api/board", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      reset();
      onPosted();
    } catch (e: any) {
      setError(e.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(10,21,67,0.4)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(138,43,226,0.2)",
    borderRadius: 10, padding: "10px 14px", color: "#f0f8ff",
    fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="open-btn"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            style={{
              width: "100%", padding: "16px 24px",
              background: "rgba(14,12,28,0.7)", backdropFilter: "blur(20px)",
              borderRadius: 14, border: "1px dashed rgba(138,43,226,0.35)",
              color: "rgba(240,248,255,0.4)", fontSize: 14, cursor: "pointer",
              textAlign: "left", transition: "all 0.25s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.7)"; (e.currentTarget as HTMLElement).style.color = "#f0f8ff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,43,226,0.35)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,248,255,0.4)"; }}
          >
            ✏️ &nbsp; Share knowledge with the team...
          </motion.button>
        ) : (
          <motion.div key="composer"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            style={{
              background: "rgba(14,12,28,0.85)", backdropFilter: "blur(24px)",
              borderRadius: 16, padding: 24,
              border: "1px solid rgba(138,43,226,0.4)",
              boxShadow: "0 0 40px rgba(106,13,173,0.15)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f8ff", margin: "0 0 18px" }}>New Knowledge Post</h3>

            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Post title..."
              style={{ ...inputStyle, marginBottom: 12 }}
              onFocus={e => (e.target.style.borderColor = "rgba(138,43,226,0.7)")}
              onBlur={e => (e.target.style.borderColor = "rgba(138,43,226,0.2)")}
            />

            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Share your insights, findings, or ideas..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical", marginBottom: 12, lineHeight: "1.6", fontFamily: "inherit" }}
              onFocus={e => (e.target.style.borderColor = "rgba(138,43,226,0.7)")}
              onBlur={e => (e.target.style.borderColor = "rgba(138,43,226,0.2)")}
            />

            <div style={{ marginBottom: 16 }}>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
              <button onClick={() => fileRef.current?.click()}
                style={{ padding: "7px 16px", borderRadius: 8, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,248,255,0.5)", fontSize: 12, fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"}
              >
                📎 {file ? file.name : "Attach a file"}
              </button>
              {file && (
                <button onClick={() => setFile(null)} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "rgba(251,113,133,0.6)", fontSize: 12 }}>
                  ✕ Remove
                </button>
              )}
            </div>

            {error && (
              <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(244,63,94,0.08)", borderRadius: 8 }}>
                ❌ {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={reset}
                style={{ padding: "9px 20px", borderRadius: 9, cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,248,255,0.4)", fontSize: 13, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={submit} disabled={loading}
                style={{
                  padding: "9px 24px", borderRadius: 9, cursor: loading ? "wait" : "pointer",
                  background: "linear-gradient(90deg, #6a0dad, #8a2be2)",
                  border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                  opacity: loading ? 0.7 : 1, boxShadow: "0 0 20px rgba(138,43,226,0.4)", transition: "opacity 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 35px rgba(138,43,226,0.7)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(138,43,226,0.4)")}
              >
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
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/board");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          Knowledge <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.4)" }}>Board</span>
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
          Share insights, research, and ideas with the team.
        </p>
      </div>

      <Composer onPosted={fetchPosts} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", margin: "0 auto", border: "3px solid rgba(138,43,226,0.2)", borderTopColor: "#8a2be2", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "rgba(240,248,255,0.25)", marginTop: 16, fontSize: 13 }}>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: 60, borderRadius: 16, textAlign: "center", background: "rgba(14,12,28,0.4)", border: "1px dashed rgba(138,43,226,0.2)" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📚</p>
          <p style={{ color: "rgba(240,248,255,0.3)", fontSize: 15, margin: 0 }}>No posts yet.</p>
          <p style={{ color: "rgba(240,248,255,0.2)", fontSize: 13 }}>Be the first to share knowledge with the team!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::placeholder { color: rgba(240,248,255,0.2) !important; }
      `}</style>
    </div>
  );
}
