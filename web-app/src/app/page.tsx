export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-700">
      <div className="text-center max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 pb-2 leading-tight text-glow">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary] to-[--color-secondary]">System</span>
        </h1>
        
        <p className="text-xl text-white/50 font-light leading-relaxed">
          The central hub for our team to share insights, upload documents, and discuss AI concepts synchronously and asynchronously.
        </p>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(138,43,226,0.3)]">
            Explore Board
          </button>
          
          {/* Using visual absolute centering for the Live Chat button */}
          <button className="relative w-48 py-4 rounded-full glass-panel glass-panel-hover text-white font-semibold flex items-center justify-center overflow-hidden group">
            <span className="absolute left-6 flex h-3 w-3 group-hover:scale-110 transition-transform">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[--color-secondary] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[--color-secondary]"></span>
            </span>
            Live Chat
          </button>
        </div>

        <div className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
           <div className="glass-panel p-8 glass-panel-hover cursor-default group">
             <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-[--color-secondary] transition-colors">Deep Documentation</h3>
             <p className="text-sm text-white/40 leading-relaxed">Create rich-text posts attached with raw files and PDF documents directly to interserver storage.</p>
           </div>
           <div className="glass-panel p-8 glass-panel-hover cursor-default group">
             <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-[--color-secondary] transition-colors">Instant Chatting</h3>
             <p className="text-sm text-white/40 leading-relaxed">Hop over to the real-time chat corridor powered by Pusher websockets for immediate idea bouncing.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
