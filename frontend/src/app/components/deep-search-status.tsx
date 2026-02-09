// "use client";

// import { useState, useEffect } from "react";
// import { Globe, CheckCircle2, Loader2, Search, FileText, Sparkles } from "lucide-react";
// import { cn } from "@/lib/utils"; // Assuming you have a cn utility, or just use template literals

// interface DeepSearchStatusProps {
//   isActive: boolean;
//   className?: string;
// }

// export function DeepSearchStatus({ isActive, className }: DeepSearchStatusProps) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);

//   // The steps to display in the UI
//   const steps = [
//     { icon: Search, text: "Analyzing query & context..." },
//     { icon: Globe, text: "Searching authoritative sources..." },
//     { icon: FileText, text: "Reading & verifying content..." },
//     { icon: Sparkles, text: "Synthesizing comprehensive answer..." },
//   ];

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
    
//     if (isActive) {
//       setIsVisible(true);
//       setCurrentStep(0);
      
//       // Cycle through steps every 1.5s
//       interval = setInterval(() => {
//         setCurrentStep((prev) => {
//           if (prev < steps.length - 1) return prev + 1;
//           return prev; // Stay on last step until isActive becomes false
//         });
//       }, 1500);
      
//     } else {
//       // When stopped, wait a moment then hide
//       const timeout = setTimeout(() => setIsVisible(false), 1000);
//       return () => clearTimeout(timeout);
//     }

//     return () => clearInterval(interval);
//   }, [isActive]);

//   if (!isVisible) return null;

//   return (
//     <div className={cn("w-full max-w-md my-4 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
//       <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-lg backdrop-blur-md dark:border-sky-900/30 dark:bg-slate-900/80">
        
//         {/* Animated Background Gradient */}
//         <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 opacity-50 dark:from-sky-950/20 dark:to-indigo-950/20 animate-gradient-x" />

//         {/* Header */}
//         <div className="mb-4 flex items-center gap-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
//              <Globe className={cn("h-4 w-4", isActive ? "animate-spin-slow" : "")} />
//           </div>
//           <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
//             Deep Research Agent
//           </span>
//           {isActive && (
//              <span className="ml-auto flex h-2 w-2">
//                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
//                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
//              </span>
//           )}
//         </div>

//         {/* Steps List */}
//         <div className="space-y-3 pl-1">
//           {steps.map((step, idx) => {
//             const isCompleted = currentStep > idx;
//             const isCurrent = currentStep === idx;
//             const isPending = currentStep < idx;

//             return (
//               <div 
//                 key={idx} 
//                 className={cn(
//                   "flex items-center gap-3 transition-all duration-500",
//                   isPending ? "opacity-40 blur-[0.5px]" : "opacity-100"
//                 )}
//               >
//                 {/* Icon Status */}
//                 <div className="relative flex h-5 w-5 items-center justify-center">
//                   {isCompleted ? (
//                     <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in duration-300" />
//                   ) : isCurrent ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
//                   ) : (
//                     <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
//                   )}
//                 </div>

//                 {/* Text */}
//                 <span className={cn(
//                   "text-xs transition-colors duration-300",
//                   isCurrent ? "font-medium text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"
//                 )}>
//                   {step.text}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import { useState, useEffect } from "react";
import { Globe, CheckCircle2, Loader2, Search, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepSearchStatusProps {
  isActive: boolean;
  className?: string;
}

export function DeepSearchStatus({ isActive, className }: DeepSearchStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    { icon: Search, text: "Analyzing query intent..." },
    { icon: Globe, text: "Scanning global knowledge base..." },
    { icon: BookOpen, text: "Reading trusted sources..." },
    { icon: Sparkles, text: "Synthesizing intelligence..." },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);

      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full max-w-lg my-6 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-blue-200/60 bg-white/60 p-5 shadow-xl shadow-blue-900/5 backdrop-blur-xl dark:border-blue-800/50 dark:bg-slate-900/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100/40 via-blue-50/30 to-indigo-100/40 dark:from-sky-900/20 dark:via-blue-900/10 dark:to-indigo-900/20 animate-pulse-slow" />

        <div className="mb-5 flex items-center justify-between border-b border-blue-100/50 pb-3 dark:border-blue-800/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Globe className={cn("h-5 w-5", isActive ? "animate-spin-slow" : "")} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Deep Research Agent
              </h3>
              <p className="text-[10px] font-medium text-blue-500 uppercase tracking-wider">
                Authorized Web Access
              </p>
            </div>
          </div>

          {isActive && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-[10px] font-bold border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              <Loader2 className="h-3 w-3 animate-spin" />
              PROCESSING
            </div>
          )}
        </div>

        <div className="relative space-y-5 pl-2">
          <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div
                key={idx}
                className={cn(
                  "relative flex items-center gap-4 transition-all duration-500",
                  isPending ? "opacity-40 grayscale" : "opacity-100"
                )}
              >
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                      : isCurrent
                      ? "border-blue-500 bg-white text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:bg-slate-900"
                      : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 animate-in zoom-in" />
                  ) : isCurrent ? (
                    <step.icon className="h-4 w-4 animate-pulse" />
                  ) : (
                    <step.icon className="h-3.5 w-3.5" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex-1 rounded-lg px-3 py-1.5 transition-all duration-300",
                    isCurrent
                      ? "bg-white/80 shadow-sm ring-1 ring-blue-100 dark:bg-slate-800 dark:ring-blue-900"
                      : ""
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isCurrent
                        ? "text-blue-700 dark:text-blue-300"
                        : isCompleted
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-slate-400"
                    )}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
