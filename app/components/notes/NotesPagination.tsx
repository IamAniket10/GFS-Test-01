"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesPaginationProps {
  currentPage: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  totalEntries: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function NotesPagination({
  currentPage,
  totalPages,
  startEntry,
  endEntry,
  totalEntries,
  onPrevious,
  onNext,
}: NotesPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={onPrevious}
          className="gap-1 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Button>

        <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={onNext}
          className="gap-1 text-xs"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
