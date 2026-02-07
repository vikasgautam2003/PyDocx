


// "use client";

// import { useState } from "react";
// import dynamic from "next/dynamic";
// // Keep your existing import paths
// import { UploadZone } from "@/app/components/upload-zone";
// import { ChatInterface } from "@/app/components/chat-interface";

// // Dynamic Import for PDF (Client-side only)
// const PDFViewer = dynamic(
//   () => import("@/app/components/pdf-viewer").then((mod) => mod.PDFViewer),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex h-full items-center justify-center text-slate-400">
//         Initializing PDF Viewer...
//       </div>
//     ),
//   }
// );

// export default function Home() {
//   const [fileId, setFileId] = useState<string | null>(null);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   // State for citations/highlighting
//   const [highlightText, setHighlightText] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const handleUploadComplete = (id: string, file: File) => {
//     setFileId(id);
//     setPdfUrl(URL.createObjectURL(file));
//     setCurrentPage(1);
//     setHighlightText(null);
//   };

//   const handleCitationClick = (page: number, text: string) => {
//     setCurrentPage(page);
//     setHighlightText(text);
//   };

//   // 1. STATE: NO FILE -> Show Upload Zone
//   if (!fileId) {
//     return (
//       <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
//         <div className="text-center mb-8 space-y-2">
//           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">DocuNexus 🧠</h1>
//           <p className="text-slate-500 text-lg">Chat with your documents using Local RAG.</p>
//         </div>
//         <UploadZone onUploadComplete={handleUploadComplete} />
//       </main>
//     );
//   }

//   // 2. STATE: FILE LOADED -> Split Screen Layout
//   return (
//     <main className="flex flex-col md:flex-row h-screen w-full bg-slate-100 overflow-hidden">
      
//       {/* LEFT PANEL (Top on mobile) 
//          - flex-1: Takes available space
//          - md:w-1/2: 50% width on desktop
//          - h-[50vh]: 50% height on mobile
//          - md:h-full: Full height on desktop
//       */}
//       <div className="w-full h-[45vh] md:h-full md:w-1/2 p-2 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-200/30">
//         <PDFViewer
//           url={pdfUrl}
//           pageNumber={currentPage}
//           onPageChange={setCurrentPage}
//           searchText={highlightText}
//         />
//       </div>

//       {/* RIGHT PANEL (Bottom on mobile) 
//       */}
//       <div className="w-full h-[55vh] md:h-full md:w-1/2 p-2 bg-white">
//         <ChatInterface
//           fileId={fileId}
//           onChangePDF={() => setFileId(null)}
//           onCitationClick={handleCitationClick}
//         />
//       </div>

//     </main>
//   );
// }


















"use client";

import { useState } from "react";
import { LandingView } from "@/app/components/home/landing-view";
import { WorkspaceView } from "@/app/components/home/workspace-view";

export default function Home() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleUploadComplete = (id: string, file: File) => {
    setFileId(id);
    setPdfUrl(URL.createObjectURL(file));
    setCurrentPage(1);
    setHighlightText(null);
  };

  const handleCitationClick = (page: number, text: string) => {
    setCurrentPage(page);
    setHighlightText(text);
  };

  if (!fileId) {
    return <LandingView onUploadComplete={handleUploadComplete} />;
  }

  return (
    <WorkspaceView
      fileId={fileId}
      pdfUrl={pdfUrl}
      currentPage={currentPage}
      highlightText={highlightText}
      setCurrentPage={setCurrentPage}
      setFileId={setFileId}
      onCitationClick={handleCitationClick}
    />
  );
}