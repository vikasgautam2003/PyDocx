// "use client";

// import { useState } from "react";
// import { Send, User, Bot, RotateCcw } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
// import { useAgent } from "@/hooks/useAgent";

// interface ChatInterfaceProps {
//   fileId: string;
//   onChangePDF: () => void;
//   onCitationClick: (page: number, text: string) => void;
// }

// export function ChatInterface({ fileId, onChangePDF, onCitationClick }: ChatInterfaceProps) {
//   const [query, setQuery] = useState("");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(true);

//   const { steps, isThinking, chat } = useAgent();

//   const handleSend = () => {
//     if (!query.trim() || !fileId) return;
//     chat(query, fileId);
//     setQuery("");
//     setIsDrawerOpen(true);
//   };

//   const lastAnswer = steps.filter((s) => s.type === "answer").pop();

//   return (
//     <div className="flex flex-col h-full bg-white shadow-xl rounded-l-2xl border-l overflow-hidden">
//       <header className="p-4 border-b bg-white flex items-center justify-between z-10">
//         <div className="flex items-center gap-2">
//           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//           <h2 className="font-semibold text-slate-800">DocuNexus Agent</h2>
//         </div>
//         <Button variant="outline" size="sm" onClick={onChangePDF} className="gap-2 text-slate-600">
//           <RotateCcw className="h-3 w-3" />
//           New PDF
//         </Button>
//       </header>

//       <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth">
//         <ReasoningDrawer
//           steps={steps}
//           isOpen={isDrawerOpen}
//           onOpenChange={setIsDrawerOpen}
//         />

//         {lastAnswer && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="flex gap-4">
//               <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
//                 <Bot className="h-5 w-5" />
//               </div>

//               <div className="flex-1 space-y-3">
//                 <article className="prose prose-slate prose-sm max-w-none bg-white p-4 rounded-lg border shadow-sm">
//                   <ReactMarkdown>{lastAnswer.content}</ReactMarkdown>
//                 </article>

//                 {lastAnswer.citations && lastAnswer.citations.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {lastAnswer.citations.map((citation, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => onCitationClick(citation.page, citation.text)}
//                         className="flex items-center gap-1.5 text-xs font-medium bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
//                       >
//                         📄 Pg {citation.page}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 bg-white border-t">
//         <div className="relative flex items-center">
//           <Input
//             placeholder="Ask about this document..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             disabled={isThinking}
//             className="pr-12 py-6 text-base shadow-sm focus-visible:ring-indigo-500"
//           />
//           <Button
//             onClick={handleSend}
//             disabled={isThinking || !query.trim()}
//             size="icon"
//             className="absolute right-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//         <p className="text-[10px] text-slate-400 text-center mt-2">
//           AI can make mistakes. Check citations.
//         </p>
//       </div>
//     </div>
//   );
// }


















"use client";

import { useState, useEffect } from "react";
import { Send, Bot, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
import { useAgent } from "@/hooks/useAgent";

interface ChatInterfaceProps {
  fileId: string;
  onChangePDF: () => void;
  onCitationClick: (page: number, text: string) => void;
}

interface BriefingData {
  summary: string[];
  suggested_questions: string[];
}

export function ChatInterface({ fileId, onChangePDF, onCitationClick }: ChatInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);

  const { steps, isThinking, chat } = useAgent();

  useEffect(() => {
    if (!fileId) return;
    
    const fetchBriefing = async () => {
      setIsLoadingBriefing(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "analyze", file_id: fileId }),
        });
        if (res.ok) {
            const data = await res.json();
            setBriefing(data);
        }
      } catch (e) {
        console.error("Briefing failed", e);
      } finally {
        setIsLoadingBriefing(false);
      }
    };

    fetchBriefing();
  }, [fileId]);

  const handleSend = (text?: string) => {
    const input = text || query;
    if (!input.trim() || !fileId) return;
    chat(input, fileId);
    setQuery("");
    setIsDrawerOpen(true);
  };

  const lastAnswer = steps.filter((s) => s.type === "answer").pop();

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-l-2xl border-l overflow-hidden">
      <header className="p-4 border-b bg-white flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold text-slate-800">DocuNexus Agent</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onChangePDF} className="gap-2 text-slate-600">
          <RotateCcw className="h-3 w-3" />
          New PDF
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth">
        <ReasoningDrawer
          steps={steps}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />

        {!lastAnswer && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 animate-in fade-in duration-700">
                <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Bot className="h-8 w-8 text-white" />
                </div>

                {isLoadingBriefing ? (
                    <div className="flex items-center gap-2 text-slate-400">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <p>Analyzing document...</p>
                    </div>
                ) : briefing ? (
                    <div className="w-full max-w-md bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                                📊 Executive Summary
                            </h3>
                            <ul className="space-y-2.5">
                                {briefing.summary.map((point, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex gap-3 leading-relaxed">
                                        <span className="text-indigo-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Suggested Questions</p>
                            <div className="space-y-2">
                                {briefing.suggested_questions.map((q, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="w-full text-left text-sm p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 shadow-sm text-slate-700"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400">Ready to chat.</p>
                )}
            </div>
        )}

        {lastAnswer && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Bot className="h-5 w-5" />
              </div>

              <div className="flex-1 space-y-3">
                <article className="prose prose-slate prose-sm max-w-none bg-white p-4 rounded-lg border shadow-sm">
                  <ReactMarkdown>{lastAnswer.content}</ReactMarkdown>
                </article>

                {lastAnswer.citations && lastAnswer.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lastAnswer.citations.map((citation, idx) => (
                      <button
                        key={idx}
                        onClick={() => onCitationClick(citation.page, citation.text)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
                      >
                        📄 Pg {citation.page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="relative flex items-center">
          <Input
            placeholder="Ask about this document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isThinking}
            className="pr-12 py-6 text-base shadow-sm focus-visible:ring-indigo-500"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isThinking || !query.trim()}
            size="icon"
            className="absolute right-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          AI can make mistakes. Check citations.
        </p>
      </div>
    </div>
  );
}