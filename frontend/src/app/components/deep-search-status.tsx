"use client";

import { useState, useEffect } from "react";
import { Globe, CheckCircle2, Loader2, Search, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, or just use template literals

interface DeepSearchStatusProps {
  isActive: boolean;
  className?: string;
}

export function DeepSearchStatus({ isActive, className }: DeepSearchStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // The steps to display in the UI
  const steps = [
    { icon: Search, text: "Analyzing query & context..." },
    { icon: Globe, text: "Searching authoritative sources..." },
    { icon: FileText, text: "Reading & verifying content..." },
    { icon: Sparkles, text: "Synthesizing comprehensive answer..." },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);
      
      // Cycle through steps every 1.5s
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev; // Stay on last step until isActive becomes false
        });
      }, 1500);
      
    } else {
      // When stopped, wait a moment then hide
      const timeout = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <div className={cn("w-full max-w-md my-4 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-lg backdrop-blur-md dark:border-sky-900/30 dark:bg-slate-900/80">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 opacity-50 dark:from-sky-950/20 dark:to-indigo-950/20 animate-gradient-x" />

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
             <Globe className={cn("h-4 w-4", isActive ? "animate-spin-slow" : "")} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Deep Research Agent
          </span>
          {isActive && (
             <span className="ml-auto flex h-2 w-2">
               <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
               <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
             </span>
          )}
        </div>

        {/* Steps List */}
        <div className="space-y-3 pl-1">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center gap-3 transition-all duration-500",
                  isPending ? "opacity-40 blur-[0.5px]" : "opacity-100"
                )}
              >
                {/* Icon Status */}
                <div className="relative flex h-5 w-5 items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in duration-300" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>

                {/* Text */}
                <span className={cn(
                  "text-xs transition-colors duration-300",
                  isCurrent ? "font-medium text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"
                )}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}