"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";


interface UploadZoneProps{
    onUploadComplete: (fileId: string, file: File) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setProgress(10);

        const formData = new FormData();
        formData.append("file", file);


        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            setProgress(60);

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setProgress(100);


            toast.success("File Uploaded", {
                description: `${data.filename} is ready for chat.`,
            });



            onUploadComplete(data.id, file);
        } 
        catch (error) {
            toast.error("Upload Failed", {
                description: "Could not process the document. Please try again.",
            });
            setProgress(0);
            } finally {
            setIsUploading(false);
        }
    }

    return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <Card
        className={`p-10 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={(e) =>
            e.target.files?.[0] && handleUpload(e.target.files[0])
          }
        />

        <div className="p-4 rounded-full bg-blue-50 text-blue-500">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8" />
          )}
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-lg">
            {isUploading ? "Processing Document..." : "Drop your PDF here"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isUploading
              ? "Parsing vectors and generating embeddings"
              : "or click to browse (Max 10MB)"}
          </p>
        </div>

        {isUploading && <Progress value={progress} className="w-[60%] mt-4 h-2" />}
      </Card>
    </div>
  );
}
