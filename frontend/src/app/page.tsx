















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