"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR errors
    let channel: any;
    let pusher: any;

    const initPusher = async () => {
      // Fetch History
      try {
        const res = await fetch("/api/chat");
        const history = await res.json();
        setMessages(history);
      } catch (e) { console.error("History fetch failed", e); }

      const PusherJS = (await import("pusher-js")).default;
      // @ts-ignore
      const PClient = PusherJS.default || PusherJS;
      
      pusher = new PClient(
        process.env.NEXT_PUBLIC_PUSHER_KEY!,
        { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! }
      );

      channel = pusher.subscribe("chat-channel");
      channel.bind("new-message", (msg: Message) => {
        setMessages(prev => [...prev, msg]);
      });
    };

    initPusher();

    return () => { 
      if (channel) channel.unbind_all();
      if (pusher) pusher.unsubscribe("chat-channel");
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = {
      text: input,
      user: session?.user?.name || "Anonymous",
    };

    setInput("");
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
  };

  return (
    <div style={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f8ff", margin: 0 }}>
          System <span style={{ color: "#457bff", textShadow: "0 0 20px rgba(69,123,255,0.4)" }}>Chat</span>
        </h2>
      </div>

      <div style={{
        flex: 1, background: "rgba(14,12,28,0.6)", backdropFilter: "blur(20px)",
        borderRadius: 20, border: "1px solid rgba(138,43,226,0.15)",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(240,248,255,0.15)", marginTop: 40 }}>
              <p style={{ fontSize: 40 }}>💬</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  alignSelf: m.user === session?.user?.name ? "flex-end" : "flex-start",
                  maxWidth: "70%"
                }}
              >
                <div style={{ fontSize: 11, color: "rgba(240,248,255,0.3)", marginBottom: 4, marginLeft: 4 }}>{m.user}</div>
                <div style={{
                  padding: "10px 16px", borderRadius: 16,
                  background: m.user === session?.user?.name 
                    ? "linear-gradient(135deg, #6a0dad, #8a2be2)" 
                    : "rgba(255,255,255,0.05)",
                  color: "#f0f8ff", fontSize: 14, lineHeight: 1.5,
                  boxShadow: m.user === session?.user?.name ? "0 4px 15px rgba(138,43,226,0.2)" : "none"
                }}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form onSubmit={sendMessage} style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "12px 16px", color: "#f0f8ff", outline: "none"
            }}
          />
          <button type="submit" style={{
            background: "linear-gradient(135deg, #6a0dad, #457bff)",
            color: "#fff", border: "none", borderRadius: 12, padding: "0 24px",
            fontWeight: 700, cursor: "pointer"
          }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
