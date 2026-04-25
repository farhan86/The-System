export default function Dashboard() {
  const recentPosts = [
    { id: 1, author: "Farhan", title: "Attention Mechanism Deep Dive", time: "2h ago", excerpt: "Breaking down multi-head self-attention from scratch..." },
    { id: 2, author: "Kalo", title: "RAG Pipeline Benchmarks", time: "5h ago", excerpt: "Comparing naive RAG vs. graph-RAG on our test dataset..." },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold text-white/90">Welcome back 👋</h2>
        <p className="text-white/40 mt-1">Here&apos;s what&apos;s happening in The System today.</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 glass-panel-hover cursor-default">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Total Posts</p>
          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary] to-[--color-secondary]">0</p>
        </div>
        <div className="glass-panel p-6 glass-panel-hover cursor-default">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Notifications</p>
          <p className="text-4xl font-extrabold text-white/90">0</p>
        </div>
        <div className="glass-panel p-6 glass-panel-hover cursor-default">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Active Members</p>
          <p className="text-4xl font-extrabold text-white/90">2</p>
        </div>
      </div>

      {/* Recent Board Activity */}
      <div>
        <h3 className="text-xl font-semibold text-white/70 mb-5 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[--color-primary] animate-pulse inline-block"></span>
          Recent Board Activity
        </h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <div key={post.id} className="glass-panel p-6 glass-panel-hover cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white/90">{post.title}</h4>
                <span className="text-xs text-white/30 ml-4 whitespace-nowrap">{post.time}</span>
              </div>
              <p className="text-sm text-white/40 line-clamp-2">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[--color-primary] to-[--color-secondary]"></div>
                <span className="text-xs text-white/50">{post.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
