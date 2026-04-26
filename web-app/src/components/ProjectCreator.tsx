"use client";
import { useState } from "react";

export default function ProjectCreator({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !end) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          start_date: start, 
          end_date: end,
          status: 'Active'
        }),
      });
      if (res.ok) {
        setName(""); setStart(""); setEnd("");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-[#f0f8ff] text-[13px] outline-none focus:border-[#457bff]/40 transition-colors mb-3";

  return (
    <div className="bg-[#0a0a14]/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-4 bg-[#457bff] rounded-full" />
        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-widest m-0">Project Initialization</h3>
      </div>
      
      <form onSubmit={submit}>
        <div className="flex flex-col">
           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 ml-1">Objective Title</label>
           <input placeholder="Enter project name..." value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 ml-1">Commencement</label>
            <input 
              type="date" 
              value={start} 
              onChange={e => setStart(e.target.value)} 
              onClick={(e) => e.currentTarget.showPicker?.()}
              className={inputClass} 
              required 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 ml-1">Deadline</label>
            <input 
              type="date" 
              value={end} 
              onChange={e => setEnd(e.target.value)} 
              onClick={(e) => e.currentTarget.showPicker?.()}
              className={inputClass} 
              required 
            />
          </div>
        </div>
        
        <button 
          disabled={loading} 
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#457bff]/20 to-[#8a2be2]/20 border border-[#457bff]/40 text-[#457bff] font-black text-[11px] uppercase tracking-widest hover:bg-[#457bff]/30 transition-all active:scale-[0.98] mt-2"
        >
          {loading ? "Processing..." : "Deploy Objective"}
        </button>
      </form>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.3; cursor: pointer; }
        input[type="date"] { color-scheme: dark; }
      `}</style>
    </div>
  );
}
