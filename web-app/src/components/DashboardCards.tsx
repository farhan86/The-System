"use client";
import Link from "next/link";

export function StatCard({ label, value, accent, href }: { label: string; value: number; accent?: boolean, href?: string }) {
  const content = (
    <div className="bg-[#0a0a14]/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/5 transition-all cursor-pointer hover:border-[#457bff]/30 hover:-translate-y-1 group">
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 group-hover:text-white/40 transition-colors">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className={`text-4xl font-black m-0 leading-none tracking-tighter ${accent ? "text-[#457bff] [text-shadow:0_0_20px_rgba(69,123,255,0.4)]" : "text-white"}`}>
          {value}
        </p>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[#457bff] text-lg">→</span>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href} className="no-underline">{content}</Link> : content;
}

export function PostCard({ post }: { post: any }) {
  function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "recently";
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const postId = post.id || post.post_id || post.ID;
  return (
    <Link href={`/board?postId=${postId}`} className="no-underline block">
      <div className="bg-[#0a0a14]/40 backdrop-blur-xl rounded-xl p-5 border border-white/5 transition-all cursor-pointer hover:border-[#8a2be2]/30 hover:-translate-y-0.5 group">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-bold text-sm text-[#f0f8ff] m-0 group-hover:text-[#457bff] transition-colors">{post.title}</h4>
            {post.project_name && (
              <span className="text-[9px] text-[#457bff] font-black uppercase tracking-tighter mt-1 block opacity-60">
                {post.project_name}
              </span>
            )}
          </div>
          <span className="text-[10px] text-white/20 font-bold ml-4">{timeAgo(post.created_at)}</span>
        </div>
        <p 
          className="text-[12px] text-white/40 leading-relaxed mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
          }}
        />
        <div className="flex items-center gap-2.5 border-t border-white/5 pt-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6a0dad] to-[#457bff] flex items-center justify-center text-[9px] font-black text-white border border-white/10">
            {post.author_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-[11px] text-white/30 font-bold">{post.author_name}</span>
        </div>
      </div>
    </Link>
  );
}
