import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Pusher from "pusher";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { text, user } = await req.json();
    
    const message = {
      id: Date.now().toString(),
      text,
      user,
      timestamp: Date.now(),
    };

    // Initialize Pusher inside the request to avoid build-time instantiation errors
    // @ts-ignore
    const PusherClass = Pusher.default || Pusher;
    const pusher = new PusherClass({
      appId:   process.env.PUSHER_APP_ID!,
      key:     process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret:  process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS:  true,
    });

    await pusher.trigger("chat-channel", "new-message", message);

    return NextResponse.json({ message: "Sent" });
  } catch (err: any) {
    console.error("Pusher trigger error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
