"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesHeaderProps {
  onAdd: () => void;
}

export function NotesHeader({ onAdd }: NotesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <FileText className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Notes Page
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Capture references, thoughts, and links in one place with quick
            inline updates.
          </p>
        </div>
      </div>

      <Button
        onClick={onAdd}
        className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Add Note
      </Button>
    </div>
  );
}
