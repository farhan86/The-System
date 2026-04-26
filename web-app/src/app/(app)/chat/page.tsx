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
    let channel: any;
    let pusher: any;
    const initPusher = async () => {
      try {
        const res = await fetch("/api/chat");
        const history = await res.json();
        setMessages(history);
      } catch (e) { console.error("History fetch failed", e); }
      const PusherJS = (await import("pusher-js")).default;
      // @ts-ignore
      const PClient = PusherJS.default || PusherJS;
      pusher = new PClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
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
    const msg = { text: input, user: session?.user?.name || "Anonymous" };
    setInput("");
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] max-w-[1000px] mx-auto pb-4">
      <div className="mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#f0f8ff] m-0">
          System <span className="text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.4)]">Chat</span>
        </h2>
      </div>

      <div className="flex-1 flex flex-col bg-[rgba(14,12,28,0.6)] backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 no-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-white/10 mt-10">
              <p className="text-4xl">💬</p>
              <p className="text-sm font-bold uppercase tracking-widest">Start the conversation</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((m) => {
              const isMe = m.user === session?.user?.name;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                >
                  <span className="text-[9px] font-black uppercase text-white/30 mb-1 ml-1">{m.user}</span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    isMe 
                    ? "bg-gradient-to-br from-[#6a0dad] to-[#8a2be2] text-white rounded-tr-none" 
                    : "bg-white/5 text-[#f0f8ff] border border-white/5 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <form onSubmit={sendMessage} className="p-3 md:p-5 border-t border-white/5 flex gap-2 md:gap-4 bg-white/2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#457bff]/50 transition-all"
          />
          <button type="submit" className="bg-gradient-to-r from-[#6a0dad] to-[#457bff] text-white rounded-xl px-6 md:px-8 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all">
            Send
          </button>
        </form>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
