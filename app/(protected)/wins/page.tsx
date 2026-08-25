"use client";

import { useWins } from "@/hooks/useWins";
import { ImportantNotePopover } from "@/app/components/todays_win/ImportantNotePopover";
import { MonthWinsAccordion } from "@/app/components/todays_win/MonthWinsAccordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WinsPage() {
  const {
    loading,
    saving,
    availableMonths,
    getDaysForMonth,
    saveDay,
    refresh,
  } = useWins();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <Trophy className="h-5 w-5" />
            </div>
            Today&apos;s Wins Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-0.5">
            Log your daily wins for this month.
          </p>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refresh()}
            disabled={loading}
            className="h-8 px-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Refresh wins data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </Button>

          {/* Important Note Guidelines Popover */}
          <ImportantNotePopover />
        </div>
      </div>

      {/* 2. Loading State */}
      {loading ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36 bg-slate-800" />
              <Skeleton className="h-5 w-16 bg-slate-800" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-10 w-full bg-slate-900" />
              <Skeleton className="h-10 w-full bg-slate-900" />
              <Skeleton className="h-10 w-full bg-slate-900" />
            </div>
          </div>
        </div>
      ) : (
        /* 3. Month Accordion List */
        <div className="space-y-5">
          {availableMonths.map((month) => {
            const days = getDaysForMonth(month.key);

            return (
              <MonthWinsAccordion
                key={month.key}
                monthKey={month.key}
                monthLabel={month.label}
                isCurrentMonth={month.isCurrentMonth}
                defaultExpanded={month.isCurrentMonth}
                days={days}
                onSaveDay={saveDay}
                isSaving={saving}
              />
            );
          })}

          {/* 4. Bottom "No older months" Indicator (from the reference mockup) */}
          <div className="flex justify-center pt-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-500 tracking-wide select-none shadow-sm">
              No older months
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
