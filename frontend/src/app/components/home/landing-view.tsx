"use client";

import { Sparkles, ShieldCheck, Zap, MessageSquareText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/app/components/upload-zone"; // Assuming your UploadZone logic is here
import { HowItWorks } from "@/app/components/home/how-it-works";
import { TrustStrip } from "@/app/components/home/trust-strip";


interface LandingViewProps {
  onUploadComplete: (fileId: string, file: File) => void;
}

export function LandingView({ onUploadComplete }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFC] relative overflow-hidden font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 text-white p-1.5 rounded-lg">
            <FileText className="h-5 w-5 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">DocuNexus</span>
        </div>
    
        
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Copy Section */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mx-auto lg:mx-0">
              <Sparkles className="h-4 w-4" />
              <span>New: Local RAG Analysis 2.0</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Chat with your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                documents
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform static PDFs into interactive conversations. 
              DocuNexus uses advanced vectorization to help you find answers, 
              summarize reports, and extract data in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-500" />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="flex-1 w-full max-w-xl relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            {/* Decorative Badges */}
            <div className="absolute -top-6 -right-6 z-20 bg-white p-3 rounded-xl shadow-xl shadow-slate-200/50 flex items-center gap-3 animate-pulse border border-slate-100 hidden md:flex">
                <div className="bg-orange-100 p-2 rounded-lg">
                    <MessageSquareText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                    <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-10 bg-slate-100 rounded"></div>
                </div>
            </div>

            {/* Actual Upload Component */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
               <UploadZone onUploadComplete={onUploadComplete} />
            </div>
          </div>

        </div>
      </main>
<TrustStrip />
      
      <HowItWorks />
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-slate-400 text-sm">
            <p>© 2026 DocuNexus Inc.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-teal-600">Privacy</a>
                <a href="#" className="hover:text-teal-600">Terms</a>
            </div>
        </div>
      </footer>
    </div>
  );
}