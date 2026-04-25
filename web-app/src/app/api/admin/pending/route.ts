import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BRIDGE_URL = process.env.API_BRIDGE_URL!;
const BRIDGE_SECRET = process.env.BRIDGE_SECRET!;

export async function GET() {
  const session = await getServerSession(authOptions);
  // Optional: Add admin-only check here if you add a 'role' column to users
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_pending_users", secret: BRIDGE_SECRET }),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
