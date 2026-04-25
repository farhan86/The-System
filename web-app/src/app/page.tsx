"use client";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    if (mode === "signup") {
      // Signup: user is created with is_approved=false, pending admin review
      setMessage("✅ Registration submitted! You'll receive access once approved by the admin.");
    } else {
      // Login — will wire up to NextAuth signIn() in Phase 2
      setMessage("🔐 Login integration coming in Phase 2.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[--color-primary] opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-[--color-secondary] opacity-10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight pb-2 leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary] to-[--color-secondary]">System</span>
          </h1>
          <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">Knowledge & Collaboration Hub</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 space-y-6">
          {/* Tab Toggle */}
          <div className="flex rounded-lg bg-[--color-muted] p-1 gap-1">
            <button
              onClick={() => { setMode("login"); setMessage(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === "login" ? "bg-[--color-primary] text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); setMessage(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === "signup" ? "bg-[--color-primary] text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full bg-[--color-muted] border border-[--color-border] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[--color-primary] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-[--color-muted] border border-[--color-border] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[--color-primary] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[--color-muted] border border-[--color-border] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[--color-primary] transition-colors"
              />
            </div>

            {message && (
              <p className={`text-sm p-3 rounded-lg ${message.startsWith("✅") ? "bg-[--color-secondary]/10 text-[--color-secondary]" : "bg-[--color-primary]/10 text-[--color-primary]"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[--color-primary] to-[--color-secondary] hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] disabled:opacity-50"
            >
              {loading ? "Processing..." : mode === "login" ? "Enter The System" : "Request Access"}
            </button>
          </form>

          {mode === "signup" && (
            <p className="text-xs text-white/30 text-center leading-relaxed">
              Sign-up requests require admin approval before access is granted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
