"use client";

import { useState, useRef, useEffect } from "react";
import { AlertCircle, Calendar, CheckCircle2, Sparkles, X } from "lucide-react";

export function ImportantNotePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Important Note Badge Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all duration-150 cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Important Note</span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-100 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Wins Tracking Guidelines</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Guidelines Content */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-100">Daily Logging:</strong> Log your
                daily wins and the key concept applied to track your steady
                progress.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-100">Dynamic Dates:</strong> Dates are
                generated starting from your account registration date up to today.
                New days appear automatically each morning.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-100">Multiple Entries:</strong> You can
                record multiple wins and concepts for any single date.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-100">Editing:</strong> Click the{" "}
                <span className="text-indigo-400 font-semibold">Edit (✎)</span> icon
                on any day to add, modify, or remove your entries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
