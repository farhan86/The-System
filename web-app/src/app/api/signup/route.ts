import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const BRIDGE_URL = process.env.API_BRIDGE_URL || "https://lspgf.com/api/db_bridge.php";
    const SECRET = process.env.BRIDGE_SECRET;

    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "signup",
        secret: SECRET,
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Signup failed" }, { status: res.status });
    }

    return NextResponse.json({ message: data.message }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
