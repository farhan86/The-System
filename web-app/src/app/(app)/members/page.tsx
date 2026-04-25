"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Member {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the bridge action directly or via a new API route
    // Since I added get_all_users to the bridge, I should use the admin/pending route 
    // or create a specific one. Let's reuse api/admin/pending but I'll update that route.
    
    fetch("/api/admin/pending?all=true")
      .then(res => res.json())
      .then(data => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          System <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.4)" }}>Team</span>
        </h2>
        <p style={{ color: "rgba(240,248,255,0.35)", marginTop: 6, fontSize: 14 }}>
          Directory of all active members in the system.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "rgba(240,248,255,0.2)" }}>Loading team...</div>
        ) : members.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "rgba(240,248,255,0.2)" }}>No active members found.</div>
        ) : (
          members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: "rgba(14,12,28,0.7)", backdropFilter: "blur(20px)",
                borderRadius: 20, padding: 24, border: "1px solid rgba(138,43,226,0.15)",
                display: "flex", alignItems: "center", gap: 20
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                background: "linear-gradient(135deg, #6a0dad, #457bff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "#fff"
              }}>
                {member.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <div style={{ color: "#f0f8ff", fontWeight: 700, fontSize: 16 }}>{member.name}</div>
                <div style={{ color: "rgba(240,248,255,0.4)", fontSize: 13 }}>{member.email}</div>
                <div style={{ fontSize: 10, color: "rgba(69,123,255,0.6)", marginTop: 6, fontWeight: 700, textTransform: "uppercase" }}>Member since {new Date(member.created_at).getFullYear()}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
