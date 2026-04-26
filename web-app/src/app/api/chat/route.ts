import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Pusher from "pusher";

const BRIDGE_URL = process.env.API_BRIDGE_URL!;
const BRIDGE_SECRET = process.env.BRIDGE_SECRET!;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_messages", secret: BRIDGE_SECRET, limit: 50 }),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { text, user } = await req.json();
    
    // 1. Save to Database via Bridge
    await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "save_message", 
        secret: BRIDGE_SECRET,
        user_name: user,
        text
      }),
    });

    const message = {
      id: Date.now().toString(),
      text,
      user,
      timestamp: Date.now(),
    };

    // 2. Trigger Pusher for real-time
    try {
      const appId = process.env.PUSHER_APP_ID;
      const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
      const secret = process.env.PUSHER_SECRET;
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

      if (appId && key && secret && cluster) {
        // @ts-ignore
        const PusherClass = Pusher.default || Pusher;
        const pusher = new PusherClass({
          appId, key, secret, cluster,
          useTLS: true,
        });
        await pusher.trigger("chat-channel", "new-message", message);
      }
    } catch (e) { console.error("Pusher chat trigger failed", e); }

    return NextResponse.json({ message: "Sent" });
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
