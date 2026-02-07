// "use client";

// import { useState } from "react";
// import { UploadZone } from "@/app/components/upload-zone";
// import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
// import { useAgent } from "@/hooks/useAgent";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
// import dynamic from "next/dynamic";


// const PDFViewer = dynamic(
//   () => import("@/app/components/pdf-viewer").then((mod) => mod.PDFViewer),
//   { 
//     ssr: false,
//     loading: () => (
//       <div className="flex h-full items-center justify-center text-slate-400">
//         Loading PDF Engine...
//       </div>
//     )
//   }
// );



// export default function Home() {
//   const [fileId, setFileId] = useState<string | null>(null);
//   const [query, setQuery] = useState("");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(true);

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   const { steps, isThinking, chat } = useAgent();

//   const handleSend = () => {
//     if (!query.trim() || !fileId) return;
//     chat(query, fileId);
//     setQuery("");
//     setIsDrawerOpen(true);
//   };

//   const handleUploadComplete = (id: string, file: File) => {
//     setFileId(id);
//     setPdfUrl(URL.createObjectURL(file));
//   }

//   if (!fileId) {
//     return (
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
//         <h1 className="text-4xl font-bold tracking-tight mb-2">DocuNexus 🧠</h1>
//         <p className="text-slate-500 mb-8">Upload a PDF to start the Ghost Agent.</p>
//         <UploadZone onUploadComplete={handleUploadComplete} />
//       </main>
//     );
//   }

//   const lastAnswer = steps.filter(s => s.type === "answer").pop();

//   return (
//     <main className="flex min-h-screen bg-white">
//       <div className="hidden lg:block w-1/2 border-r bg-slate-100 p-4">
//         <div className="h-full flex items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
//           <PDFViewer url={pdfUrl} />
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col h-screen max-w-3xl mx-auto">
//         <header className="p-4 border-b flex items-center justify-between">
//           <h2 className="font-semibold">DocuNexus Chat</h2>
//           <Button variant="ghost" size="sm" onClick={() => setFileId(null)}>
//             Change PDF
//           </Button>
//         </header>

//         <div className="flex-1 overflow-y-auto p-4 space-y-6">
//           <ReasoningDrawer
//             steps={steps}
//             isOpen={isDrawerOpen}
//             onOpenChange={setIsDrawerOpen}
//           />

//           {lastAnswer && (
//             <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
//                 AI
//               </div>
//               <div className="space-y-2">
//                 <div className="prose prose-slate max-w-none">
//                   <p>{lastAnswer.content}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t bg-white">
//           <div className="flex gap-2">
//             <Input
//               placeholder="Ask the Ghost Agent..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               disabled={isThinking}
//             />
//             <Button onClick={handleSend} disabled={isThinking}>
//               <Send className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }













"use client";

import { useState } from "react";
import { UploadZone } from "@/app/components/upload-zone";
import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
import { useAgent } from "@/hooks/useAgent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@/app/components/pdf-viewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading PDF Engine...
      </div>
    ),
  }
);

export default function Home() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { steps, isThinking, chat } = useAgent();

  const handleSend = () => {
    if (!query.trim() || !fileId) return;
    chat(query, fileId);
    setQuery("");
    setIsDrawerOpen(true);
  };

  const handleUploadComplete = (id: string, file: File) => {
    setFileId(id);
    setPdfUrl(URL.createObjectURL(file));
    setCurrentPage(1);
  };

  const handleCitationClick = (page: number) => {
    setCurrentPage(page);
  };

  if (!fileId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">DocuNexus 🧠</h1>
        <p className="text-slate-500 mb-8">Upload a PDF to start the Ghost Agent.</p>
        <UploadZone onUploadComplete={handleUploadComplete} />
      </main>
    );
  }

  const lastAnswer = steps.filter((s) => s.type === "answer").pop();

  return (
    <main className="flex min-h-screen bg-white">
      <div className="hidden lg:block w-1/2 border-r bg-slate-100 p-4">
        <PDFViewer
          url={pdfUrl}
          pageNumber={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen max-w-3xl mx-auto">
        <header className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">DocuNexus Chat</h2>
          <Button variant="ghost" size="sm" onClick={() => setFileId(null)}>
            Change PDF
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ReasoningDrawer
            steps={steps}
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />

          {lastAnswer && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                AI
              </div>

              <div className="space-y-2">
                <div className="prose prose-slate max-w-none">
                  <p>{lastAnswer.content}</p>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleCitationClick(1)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded border transition-colors"
                  >
                    Reference: Page 1
                  </button>

                  <button
                    onClick={() => handleCitationClick(3)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded border transition-colors"
                  >
                    Reference: Page 3
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              placeholder="Ask the Ghost Agent..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isThinking}
            />
            <Button onClick={handleSend} disabled={isThinking}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
