"use client";

import { useState } from "react";
import { Send, User, Bot, RotateCcw } from "lucide-react";
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

export function ChatInterface({ fileId, onChangePDF, onCitationClick }: ChatInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const { steps, isThinking, chat } = useAgent();

  const handleSend = () => {
    if (!query.trim() || !fileId) return;
    chat(query, fileId);
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
            onClick={handleSend}
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







// // "use client";

// // import { useState } from "react";
// // import { Send, Bot, RotateCcw } from "lucide-react";
// // import ReactMarkdown from "react-markdown";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
// // import { useAgent } from "@/hooks/useAgent";

// // interface ChatInterfaceProps {
// //   fileId: string;
// //   onChangePDF: () => void;
// //   onCitationClick: (page: number, text: string) => void;
// // }

// // export function ChatInterface({
// //   fileId,
// //   onChangePDF,
// //   onCitationClick,
// // }: ChatInterfaceProps) {
// //   const [query, setQuery] = useState("");
// //   const [isDrawerOpen, setIsDrawerOpen] = useState(true);

// //   const { steps, isThinking, chat } = useAgent();

// //   const handleSend = () => {
// //     if (!query.trim() || !fileId) return;
// //     chat(query, fileId);
// //     setQuery("");
// //     setIsDrawerOpen(true);
// //   };

// //   const lastAnswer = steps.filter((s) => s.type === "answer").pop();

// //   return (
// //     <div
// //       className="
// //       flex flex-col h-full
// //       bg-gradient-to-br from-neutral-100 via-white to-neutral-200
// //       backdrop-blur-xl
// //       border-l border-white/40
// //       rounded-l-3xl
// //       shadow-[0_20px_60px_rgba(0,0,0,0.08)]
// //       overflow-hidden
// //     "
// //     >
// //       {/* ---------------- Header ---------------- */}
// //       <header
// //         className="
// //         px-6 py-4
// //         bg-white/70 backdrop-blur-xl
// //         border-b border-neutral-200/60
// //         flex items-center justify-between
// //       "
// //       >
// //         <div className="flex items-center gap-3">
// //           <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
// //           <h2 className="text-[15px] font-semibold tracking-tight text-neutral-800">
// //             DocuNexus
// //           </h2>
// //         </div>

// //         <Button
// //           variant="ghost"
// //           size="sm"
// //           onClick={onChangePDF}
// //           className="
// //             gap-2
// //             text-neutral-600
// //             hover:bg-neutral-200/60
// //             rounded-xl
// //           "
// //         >
// //           <RotateCcw className="h-4 w-4" />
// //           New PDF
// //         </Button>
// //       </header>

// //       {/* ---------------- Body ---------------- */}
// //       <div
// //         className="
// //         flex-1 overflow-y-auto
// //         px-6 py-6 space-y-8
// //         scroll-smooth
// //       "
// //       >
// //         <ReasoningDrawer
// //           steps={steps}
// //           isOpen={isDrawerOpen}
// //           onOpenChange={setIsDrawerOpen}
// //         />

// //         {lastAnswer && (
// //           <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
// //             <div className="flex gap-4">
// //               {/* Avatar */}
// //               <div
// //                 className="
// //                 h-9 w-9 rounded-2xl
// //                 bg-black text-white
// //                 flex items-center justify-center
// //                 shadow-md
// //                 shrink-0
// //               "
// //               >
// //                 <Bot className="h-5 w-5" />
// //               </div>

// //               {/* Message */}
// //               <div className="flex-1 space-y-4">
// //                 <article
// //                   className="
// //                   prose prose-neutral prose-sm max-w-none
// //                   bg-white/80 backdrop-blur-lg
// //                   rounded-2xl px-5 py-4
// //                   border border-white/60
// //                   shadow-[0_6px_20px_rgba(0,0,0,0.06)]
// //                 "
// //                 >
// //                   <ReactMarkdown>{lastAnswer.content}</ReactMarkdown>
// //                 </article>

// //                 {/* Citations */}
// //                 {lastAnswer.citations &&
// //                   lastAnswer.citations.length > 0 && (
// //                     <div className="flex flex-wrap gap-2">
// //                       {lastAnswer.citations.map((citation, idx) => (
// //                         <button
// //                           key={idx}
// //                           onClick={() =>
// //                             onCitationClick(citation.page, citation.text)
// //                           }
// //                           className="
// //                           text-xs font-medium
// //                           px-3 py-1.5
// //                           rounded-full
// //                           bg-white
// //                           border border-neutral-300
// //                           hover:border-neutral-400
// //                           hover:shadow-sm
// //                           transition-all
// //                         "
// //                         >
// //                           Pg {citation.page}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   )}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ---------------- Composer ---------------- */}
// //       <div
// //         className="
// //         p-5
// //         bg-white/70 backdrop-blur-xl
// //         border-t border-neutral-200/60
// //       "
// //       >
// //         <div
// //           className="
// //           relative flex items-center
// //           rounded-2xl
// //           bg-white
// //           shadow-[0_8px_24px_rgba(0,0,0,0.08)]
// //           border border-neutral-200
// //         "
// //         >
// //           <Input
// //             placeholder="Ask about this document…"
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             onKeyDown={(e) => e.key === "Enter" && handleSend()}
// //             disabled={isThinking}
// //             className="
// //               border-0
// //               shadow-none
// //               focus-visible:ring-0
// //               py-6 pr-14
// //               text-[15px]
// //               bg-transparent
// //             "
// //           />

// //           <Button
// //             onClick={handleSend}
// //             disabled={isThinking || !query.trim()}
// //             size="icon"
// //             className="
// //               absolute right-2
// //               h-9 w-9
// //               rounded-xl
// //               bg-black
// //               hover:bg-neutral-800
// //               shadow-md
// //             "
// //           >
// //             <Send className="h-4 w-4 text-white" />
// //           </Button>
// //         </div>

// //         <p className="text-[10px] text-neutral-400 text-center mt-3">
// //           AI may be incorrect. Verify citations.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }
