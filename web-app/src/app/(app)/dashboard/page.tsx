import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatCard, PostCard } from "@/components/DashboardCards";
import DashboardClient from "@/components/DashboardClient";

async function getStats() {
  const BRIDGE_URL = process.env.API_BRIDGE_URL!;
  const SECRET = process.env.BRIDGE_SECRET!;
  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_stats", secret: SECRET }),
      cache: "no-store",
    });
    if (!res.ok) return { totalPosts: 0, totalMembers: 0 };
    return res.json();
  } catch {
    return { totalPosts: 0, totalMembers: 0 };
  }
}

async function getRecentPosts() {
  const BRIDGE_URL = process.env.API_BRIDGE_URL!;
  const SECRET = process.env.BRIDGE_SECRET!;
  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_posts", secret: SECRET, limit: 5 }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const [stats, posts] = await Promise.all([getStats(), getRecentPosts()]);
  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <DashboardClient 
      firstName={firstName}
      stats={stats}
      posts={posts}
      PostCard={PostCard}
      StatCard={StatCard}
    />
  );
}
