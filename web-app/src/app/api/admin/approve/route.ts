import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BRIDGE_URL = process.env.API_BRIDGE_URL!;
const BRIDGE_SECRET = process.env.BRIDGE_SECRET!;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "approve_user", 
        secret: BRIDGE_SECRET,
        user_id: userId 
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    return NextResponse.json({ message: "Approved" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
