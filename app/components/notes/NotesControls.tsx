"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NotesControlsProps {
  search: string;
  entriesPerPage: number;
  onSearchChange: (value: string) => void;
  onEntriesChange: (value: number) => void;
}

export function NotesControls({
  search,
  entriesPerPage,
  onSearchChange,
  onEntriesChange,
}: NotesControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Show</span>

        <select
          value={entriesPerPage}
          onChange={(e) => onEntriesChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

        <span>entries</span>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          className="pl-9"
        />
      </div>
    </div>
  );
}
