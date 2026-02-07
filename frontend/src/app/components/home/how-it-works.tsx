"use client";

import { MessageSquare, Upload, Search, FileText } from "lucide-react";

const STEPS = [
  {
    title: "Upload your documents",
    description: "Drag and drop any PDF contract, research paper, or report. We securely parse the text and generate vector embeddings instantly.",
    icon: Upload,
  },
  {
    title: "AI Analysis in seconds",
    description: "Our local RAG engine indexes your file. No data leaves your browser if you choose 'Local Mode', ensuring total privacy.",
    icon: Search,
  },
  {
    title: "Chat and extract insights",
    description: "Ask questions like 'What are the termination clauses?' or 'Summarize the Q3 financial results' and get cited answers.",
    icon: MessageSquare,
  },
  {
    title: "Export your findings",
    description: "Copy your chat history or export the summarized citations directly to a new PDF or Markdown file.",
    icon: FileText,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            How DocuNexus works
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From static PDF to interactive knowledge base in four simple steps.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* LEFT COLUMN: Steps */}
          <div className="flex-1 space-y-12">
            {STEPS.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                {/* Number Bubble */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </div>
                </div>
                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: CSS Laptop Mockup */}
          <div className="flex-1 w-full flex justify-center perspective-[2000px]">
            {/* Laptop Chassis */}
            <div className="relative w-full max-w-lg mx-auto transform transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
              
              {/* Screen Border */}
              <div className="bg-slate-800 rounded-t-2xl p-4 pb-0 shadow-2xl">
                {/* Camera Dot */}
                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mx-auto mb-2"></div>
                
                {/* Screen Content (The "App" Look) */}
                <div className="bg-slate-100 rounded-t-lg overflow-hidden h-[300px] md:h-[400px] border border-slate-200 flex">
                  {/* Mock Sidebar */}
                  <div className="w-1/4 bg-slate-50 border-r border-slate-200 hidden sm:block p-3 space-y-2">
                    <div className="h-2 w-16 bg-slate-200 rounded"></div>
                    <div className="h-8 w-full bg-teal-100 rounded-md"></div>
                    <div className="h-2 w-20 bg-slate-200 rounded"></div>
                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                  </div>
                  
                  {/* Mock Chat Area */}
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-600"></div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 w-3/4 text-xs text-slate-500">
                           Based on the uploaded contract, the termination clause requires 30 days notice...
                        </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full bg-slate-300"></div>
                        <div className="bg-teal-600 p-3 rounded-2xl rounded-tr-none shadow-sm w-2/3 text-xs text-white">
                           Can you summarize the liability section?
                        </div>
                    </div>
                     <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-600"></div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 w-3/4 text-xs text-slate-500">
                           The liability is limited to 2x the annual contract value...
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop Keyboard/Base */}
              <div className="bg-slate-900 h-4 md:h-6 rounded-b-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-slate-700 rounded-b-lg"></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}