import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as ftp from "basic-ftp";

const BRIDGE_URL = process.env.API_BRIDGE_URL!;
const BRIDGE_SECRET = process.env.BRIDGE_SECRET!;

// ── GET: Fetch all posts with attachments ─────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "get_posts_full", 
        secret: BRIDGE_SECRET, 
        limit: 50,
        project_id: projectId 
      }),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}

// ── POST: Create a new post, optionally upload a file via FTP ─────────────────
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const title     = formData.get("title")     as string;
    const content   = formData.get("content")   as string;
    const projectId = formData.get("projectId") as string;
    const file      = formData.get("file")      as File | null;
    const authorId  = (session.user as any).id;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    let fileUrl: string | null = null;
    let origFilename: string | null = null;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      origFilename = file.name;

      const client = new ftp.Client();
      client.ftp.verbose = false;
      try {
        await client.access({
          host:     process.env.FTP_HOST!,
          user:     process.env.FTP_USER!,
          password: process.env.FTP_PASS!,
          secure:   false,
        });
        await client.ensureDir("/public_html/uploads");
        const { Readable } = await import("stream");
        await client.uploadFrom(Readable.from(buffer), safeName);
        fileUrl = `https://${process.env.FTP_HOST}/uploads/${safeName}`;
      } finally {
        client.close();
      }
    }

    const bridgeRes = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:        "create_post",
        secret:        BRIDGE_SECRET,
        author_id:     authorId,
        project_id:    projectId,
        title,
        content,
        file_url:      fileUrl,
        orig_filename: origFilename,
      }),
    });

    const result = await bridgeRes.json();
    if (!bridgeRes.ok) return NextResponse.json({ message: result.message }, { status: 500 });

    // 3. Trigger Pusher for Board Update
    try {
      const appId = process.env.PUSHER_APP_ID;
      const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
      const secret = process.env.PUSHER_SECRET;
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

      if (appId && key && secret && cluster) {
        // @ts-ignore
        const PusherClass = (await import("pusher")).default || (await import("pusher"));
        const pusher = new PusherClass({
          appId, key, secret, cluster,
          useTLS: true,
        });
        await pusher.trigger("board-channel", "new-post", { title, author: session.user?.name });
      }
    } catch (e) { console.error("Pusher board trigger failed", e); }

    return NextResponse.json({ message: "Post created", postId: result.postId }, { status: 201 });
  } catch (err: any) {
    console.error("Board POST error:", err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
