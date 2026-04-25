"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMessage(null);
    setMode(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    await new Promise(r => setTimeout(r, 900));
    if (mode === "signup") {
      setMessage({ text: "Request submitted. You'll receive access once the admin approves your account.", type: "success" });
    } else {
      setMessage({ text: "Login backend wires up in Phase 2.", type: "info" });
    }
    setLoading(false);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(10, 21, 67, 0.5)",
    border: "1px solid rgba(138,43,226,0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#f0f8ff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  };

  const inputFocused: React.CSSProperties = {
    borderColor: "rgba(138,43,226,0.8)",
    boxShadow: "0 0 0 3px rgba(106,13,173,0.2), 0 0 20px rgba(138,43,226,0.15)",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(106,13,173,0.3) 0%, transparent 65%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,83,158,0.25) 0%, transparent 65%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div className="ring-pulse" style={{ position: "absolute", top: "30%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative", zIndex: 10 }}>

        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", margin: 0, paddingBottom: 4 }}>
            <span style={{ color: "#f0f8ff" }}>The </span>
            <span className="gradient-text">System</span>
          </h1>
          <p style={{ color: "rgba(240,248,255,0.3)", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", marginTop: 8 }}>
            Knowledge &amp; Collaboration Hub
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          style={{
            borderRadius: 20,
            padding: 1,
            background: "linear-gradient(135deg, rgba(138,43,226,0.7) 0%, rgba(69,123,255,0.4) 50%, rgba(106,13,173,0.3) 100%)",
            boxShadow: "0 0 60px rgba(106,13,173,0.25), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="glass" style={{ borderRadius: 19, padding: 32 }}>

            {/* ── Tab Toggle ── */}
            <div style={{ display: "flex", background: "rgba(10,10,15,0.6)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 28, position: "relative" }}>
              {/* Animated slider */}
              <motion.div
                layout
                layoutId="tab-bg"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                style={{
                  position: "absolute",
                  top: 4, bottom: 4,
                  left: mode === "login" ? 4 : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                  borderRadius: 9,
                  background: "linear-gradient(90deg, #6a0dad, #8a2be2)",
                  boxShadow: "0 4px 20px rgba(138,43,226,0.5)",
                }}
              />
              {(["login", "signup"] as Mode[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => switchMode(tab)}
                  style={{
                    flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer",
                    fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "capitalize",
                    color: mode === tab ? "#f0f8ff" : "rgba(240,248,255,0.35)",
                    position: "relative", zIndex: 1,
                    transition: "color 0.3s ease",
                  }}
                >
                  {tab === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* ── Form — AnimatePresence for slide transition ── */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signup" ? -30 : 30 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Name field — only in signup */}
                {mode === "signup" && (
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(240,248,255,0.4)", marginBottom: 6, letterSpacing: "0.2em", textTransform: "uppercase" }}>Full Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      style={{ ...inputBase, ...(focused === "name" ? inputFocused : {}) }}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(240,248,255,0.4)", marginBottom: 6, letterSpacing: "0.2em", textTransform: "uppercase" }}>Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    style={{ ...inputBase, ...(focused === "email" ? inputFocused : {}) }}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(240,248,255,0.4)", marginBottom: 6, letterSpacing: "0.2em", textTransform: "uppercase" }}>Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    style={{ ...inputBase, ...(focused === "password" ? { ...inputFocused, borderColor: "rgba(69,123,255,0.8)", boxShadow: "0 0 0 3px rgba(45,83,158,0.2), 0 0 20px rgba(69,123,255,0.15)" } : {}) }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                {/* Status message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        padding: "12px 14px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                        background: message.type === "success" ? "rgba(69,123,255,0.1)" : "rgba(138,43,226,0.1)",
                        border: `1px solid ${message.type === "success" ? "rgba(69,123,255,0.35)" : "rgba(138,43,226,0.35)"}`,
                        color: message.type === "success" ? "#6aabff" : "#b57aff",
                      }}
                    >
                      {message.type === "success" ? "✅ " : "🔐 "}{message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-monarch"
                  style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "wait" : "pointer",
                    fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff",
                    marginTop: 4, opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Processing...
                    </span>
                  ) : mode === "login" ? "Enter The System" : "Request Access"}
                </button>
              </motion.form>
            </AnimatePresence>

            {mode === "signup" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 11, color: "rgba(240,248,255,0.2)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}
              >
                All registrations require manual admin approval before access is granted.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(240,248,255,0.2); }
      `}</style>
    </div>
  );
}
