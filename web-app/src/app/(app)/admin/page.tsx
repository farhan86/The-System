"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: number) => {
    setActioningId(userId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } finally {
      setActioningId(null);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          Admin <span style={{ color: "#fb7185", textShadow: "0 0 20px rgba(251,113,133,0.3)" }}>Terminal</span>
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
          Review and approve pending access requests.
        </p>
      </div>

      <div style={{
        background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(240,248,255,0.2)" }}>Loading pending requests...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
            <p style={{ color: "rgba(240,248,255,0.3)", fontSize: 15 }}>No pending approvals.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, color: "#f0f8ff" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", textAlign: "left" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>User</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Email</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Requested</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map(user => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "linear-gradient(135deg, #fb7185, #8a2be2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 800
                          }}>
                            {user.name[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "rgba(240,248,255,0.5)" }}>{user.email}</td>
                      <td style={{ padding: "16px 24px", color: "rgba(240,248,255,0.3)" }}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button
                          onClick={() => approveUser(user.id)}
                          disabled={actioningId === user.id}
                          style={{
                            padding: "8px 20px", borderRadius: 8,
                            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                            color: "#4ade80", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,197,94,0.2)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(34,197,94,0.1)")}
                        >
                          {actioningId === user.id ? "..." : "Approve"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
