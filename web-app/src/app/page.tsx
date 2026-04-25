"use client";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    await new Promise(r => setTimeout(r, 800));
    if (mode === "signup") {
      setMessage({ text: "Registration submitted! You'll receive access once approved by the admin.", type: "success" });
    } else {
      setMessage({ text: "Login integration will be wired in Phase 2.", type: "info" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Animated ambient background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(138,43,226,0.25) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)", filter: "blur(40px)", animation: "pulse 4s ease-in-out infinite" }} />

      <div className="w-full max-w-md px-6 z-10">

        {/* Logo — force explicit colors to fix gradient rendering */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight pb-3 leading-tight">
            <span className="text-white">The </span>
            <span style={{ background: "linear-gradient(90deg, #8a2be2, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              System
            </span>
          </h1>
          <p className="text-white/35 text-xs mt-2 tracking-[0.3em] uppercase">Knowledge & Collaboration Hub</p>
        </div>

        {/* Card with glow border */}
        <div className="relative rounded-2xl p-[1px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(138,43,226,0.6), rgba(0,229,255,0.3), rgba(138,43,226,0.1))" }}>
          <div className="rounded-2xl p-8 space-y-6" style={{ background: "rgba(10, 10, 20, 0.92)", backdropFilter: "blur(24px)" }}>

            {/* Tab Toggle */}
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.05)" }}>
              {(["login", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setMode(tab); setMessage(null); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 capitalize relative overflow-hidden"
                  style={{
                    background: mode === tab ? "linear-gradient(90deg, #8a2be2, #7c3aed)" : "transparent",
                    color: mode === tab ? "#fff" : "rgba(255,255,255,0.35)",
                    boxShadow: mode === tab ? "0 4px 20px rgba(138,43,226,0.4)" : "none",
                    transform: mode === tab ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {tab === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form — animates when switching */}
            <form onSubmit={handleSubmit} className="space-y-5" key={mode}>

              {/* Name field fades in on signup */}
              <div
                style={{
                  maxHeight: mode === "signup" ? "100px" : "0px",
                  opacity: mode === "signup" ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease"
                }}
              >
                <label className="block text-[10px] font-semibold text-white/40 mb-1.5 tracking-[0.2em] uppercase">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required={mode === "signup"}
                  placeholder="Your name"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(138,43,226,0.7)";
                    e.target.style.boxShadow = "0 0 20px rgba(138,43,226,0.2)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 mb-1.5 tracking-[0.2em] uppercase">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300 placeholder:text-white/20"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(138,43,226,0.7)";
                    e.target.style.boxShadow = "0 0 20px rgba(138,43,226,0.2)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 mb-1.5 tracking-[0.2em] uppercase">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300 placeholder:text-white/25"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(0,229,255,0.7)";
                    e.target.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Status message */}
              {message && (
                <div
                  className="text-sm p-3.5 rounded-xl leading-relaxed"
                  style={{
                    background: message.type === "success" ? "rgba(0,229,255,0.08)" : "rgba(138,43,226,0.08)",
                    border: `1px solid ${message.type === "success" ? "rgba(0,229,255,0.3)" : "rgba(138,43,226,0.3)"}`,
                    color: message.type === "success" ? "#00e5ff" : "#b57aff",
                  }}
                >
                  {message.type === "success" ? "✅ " : "🔐 "}{message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-widest uppercase relative overflow-hidden transition-all duration-300 disabled:opacity-50"
                style={{
                  background: "linear-gradient(90deg, #8a2be2, #00e5ff)",
                  boxShadow: "0 0 30px rgba(138,43,226,0.4)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(138,43,226,0.7), 0 0 20px rgba(0,229,255,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px) scale(1.01)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(138,43,226,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : mode === "login" ? "Enter The System" : "Request Access"}
              </button>
            </form>

            {mode === "signup" && (
              <p className="text-[11px] text-white/20 text-center leading-relaxed">
                All sign-up requests require manual admin approval before access is granted.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
