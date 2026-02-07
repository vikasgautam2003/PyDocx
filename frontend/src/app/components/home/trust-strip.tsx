"use client";

// Simple SVG placeholders for logos to avoid external image dependencies
const LOGOS = [
  { name: "Acme Corp", width: 100 },
  { name: "Global Dynamics", width: 140 },
  { name: "Starlight Fin", width: 110 },
  { name: "Nexus Systems", width: 130 },
  { name: "Umbrella Inc", width: 120 },
];

export function TrustStrip() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-slate-400 mb-8 uppercase tracking-wider">
          Trusted by over 10,000 researchers and legal teams
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50">
          {LOGOS.map((logo, i) => (
            <div 
                key={i} 
                className="text-2xl font-black text-slate-800 tracking-tighter hover:grayscale-0 hover:opacity-100 hover:text-teal-900 transition-all duration-300 cursor-default select-none"
            >
                {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}