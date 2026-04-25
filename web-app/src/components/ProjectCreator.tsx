"use client";
import { useState } from "react";

export default function ProjectCreator({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !end) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          start_date: start, 
          end_date: end,
          status: 'Active'
        }),
      });
      if (res.ok) {
        setName(""); setStart(""); setEnd("");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "8px 12px", color: "#f0f8ff", fontSize: 13, outline: "none",
    marginBottom: 10
  };

  return (
    <div style={{
      background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
      borderRadius: 16, padding: 20, border: "1px solid rgba(138,43,226,0.15)"
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f8ff", margin: "0 0 16px" }}>🚀 Create New Project</h3>
      <form onSubmit={submit}>
        <input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: "rgba(240,248,255,0.3)", display: "block", marginBottom: 4 }}>START DATE</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: "rgba(240,248,255,0.3)", display: "block", marginBottom: 4 }}>END DATE</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={inputStyle} required />
          </div>
        </div>
        <button disabled={loading} style={{
          width: "100%", padding: "10px", borderRadius: 8, background: "rgba(69,123,255,0.1)",
          border: "1px solid rgba(69,123,255,0.3)", color: "#6aabff", fontWeight: 700, fontSize: 12,
          cursor: "pointer", marginTop: 6
        }}>
          {loading ? "Creating..." : "Initialize Project"}
        </button>
      </form>
      <style>{`input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }`}</style>
    </div>
  );
}
