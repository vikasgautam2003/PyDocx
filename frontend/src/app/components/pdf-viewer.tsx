// "use client";

// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
// import { Button } from "@/components/ui/button";


// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PDFViewerProps {
//   url: string | null;
// }


// export function PDFViewer({ url }: PDFViewerProps) {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [pageNumber, setPageNumber] = useState<number>(1);
//     const [scale, setScale] = useState<number>(1.0);


//     const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//         setNumPages(numPages);
//     }


//     if (!url) return <div className="text-slate-400">No PDF Loaded</div>;

//     return (
//     <div className="flex flex-col h-full bg-slate-100 rounded-lg overflow-hidden border">
//       <div className="flex items-center justify-between p-2 bg-white border-b shadow-sm z-10">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
//             disabled={pageNumber <= 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>

//           <span className="text-sm font-medium text-slate-600">
//             Page {pageNumber} of {numPages}
//           </span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
//             disabled={pageNumber >= numPages}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="flex items-center gap-1">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
//           >
//             <ZoomOut className="h-4 w-4" />
//           </Button>

//           <span className="text-xs text-slate-500 w-12 text-center">
//             {Math.round(scale * 100)}%
//           </span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setScale((s) => Math.min(s + 0.2, 2.0))}
//           >
//             <ZoomIn className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto p-4 flex justify-center">
//         <Document
//           file={url}
//           onLoadSuccess={onDocumentLoadSuccess}
//           className="shadow-lg"
//         >
//           <Page
//             pageNumber={pageNumber}
//             scale={scale}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//             className="border"
//           />
//         </Document>
//       </div>
//     </div>
//   );
// }










"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string | null;
  pageNumber: number;
  onPageChange: (page: number) => void;
}

export function PDFViewer({ url, pageNumber, onPageChange }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (!url) return <div className="text-slate-400">No PDF Loaded</div>;

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-lg overflow-hidden border">
      <div className="flex items-center justify-between p-2 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium text-slate-600">
            Page {pageNumber} of {numPages}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.min(pageNumber + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-xs text-slate-500 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.min(s + 0.2, 2.0))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess} className="shadow-lg">
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="border"
          />
        </Document>
      </div>
    </div>
  );
}

