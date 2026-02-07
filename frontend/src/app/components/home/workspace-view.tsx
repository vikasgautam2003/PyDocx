"use client";

import dynamic from "next/dynamic";
import { ChatInterface } from "@/app/components/chat-interface";

// Dynamic Import kept inside the view that needs it
const PDFViewer = dynamic(
  () => import("@/app/components/pdf-viewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-slate-400">
        Initializing PDF Viewer...
      </div>
    ),
  }
);

interface WorkspaceViewProps {
  fileId: string;
  pdfUrl: string | null;
  currentPage: number;
  highlightText: string | null;
  setCurrentPage: (page: number) => void;
  setFileId: (id: string | null) => void;
  onCitationClick: (page: number, text: string) => void;
}

export function WorkspaceView({
  fileId,
  pdfUrl,
  currentPage,
  highlightText,
  setCurrentPage,
  setFileId,
  onCitationClick,
}: WorkspaceViewProps) {
  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-slate-100 overflow-hidden">
      {/* LEFT PANEL (PDF) */}
      <div className="w-full h-[45vh] md:h-full md:w-1/2 p-2 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-200/30">
        <PDFViewer
          url={pdfUrl}
          pageNumber={currentPage}
          onPageChange={setCurrentPage}
          searchText={highlightText}
        />
      </div>

      {/* RIGHT PANEL (Chat) */}
      <div className="w-full h-[55vh] md:h-full md:w-1/2 p-2 bg-white">
        <ChatInterface
          fileId={fileId}
          onChangePDF={() => setFileId(null)}
          onCitationClick={onCitationClick}
        />
      </div>
    </main>
  );
}