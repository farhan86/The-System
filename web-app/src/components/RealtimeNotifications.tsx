"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RealtimeNotifications() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [notification, setNotification] = useState<{ title: string; text: string } | null>(null);

  useEffect(() => {
    let pusher: any;

    const init = async () => {
      const PusherJS = (await import("pusher-js")).default;
      // @ts-ignore
      const PClient = PusherJS.default || PusherJS;

      const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

      if (!key || !cluster) {
        console.warn("Pusher keys missing. Notifications disabled.");
        return;
      }

      pusher = new PClient(key, { cluster });

      const channel = pusher.subscribe("chat-channel");
      
      channel.bind("new-message", (data: any) => {
        // Only show if we aren't already on the chat page AND it's not our own message
        if (pathname !== "/chat" && data.user !== session?.user?.name) {
          setNotification({ title: `Message from ${data.user}`, text: data.text });
          setTimeout(() => setNotification(null), 5000);
        }
      });

      const boardChannel = pusher.subscribe("board-channel");
      boardChannel.bind("new-post", (data: any) => {
        if (pathname !== "/board" && data.author !== session?.user?.name) {
          setNotification({ title: `New Knowledge Posted`, text: `${data.author}: ${data.title}` });
          setTimeout(() => setNotification(null), 6000);
        }
      });
    };

    if (session) init();

    return () => { if (pusher) pusher.unsubscribe("chat-channel"); };
  }, [session, pathname]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            width: 320, padding: 16, borderRadius: 16,
            background: "rgba(14,12,28,0.9)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(138,43,226,0.4)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            cursor: "pointer"
          }}
          onClick={() => setNotification(null)}
        >
          <div style={{ fontWeight: 700, color: "#f0f8ff", fontSize: 14, marginBottom: 4 }}>
            💬 {notification.title}
          </div>
          <div style={{ color: "rgba(240,248,255,0.6)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {notification.text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
