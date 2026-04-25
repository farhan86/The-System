export default function TopNav() {
  return (
    <div className="h-20 w-full flex-shrink-0 glass-panel border-b border-[#ffffff0a] border-t-0 border-l-0 border-r-0 flex items-center justify-between px-8 z-10 rounded-none">
      <div className="font-semibold text-white/40 text-sm tracking-widest uppercase">
        Authentication Hub Mode
      </div>
      <div className="flex items-center gap-8">
        <button className="text-white/40 hover:text-white transition-colors hover:rotate-90 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        <div className="flex items-center gap-4 border-l border-white/10 pl-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[--color-primary] to-[--color-secondary] shadow-[0_0_15px_rgba(138,43,226,0.5)]"></div>
          <button className="text-sm font-semibold text-white/50 hover:text-[#f43f5e] transition-colors tracking-wide">LOGOUT</button>
        </div>
      </div>
    </div>
  );
}
