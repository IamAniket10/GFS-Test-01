"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DayWinsGroup, SaveDayWinsInput, WinEntry } from "@/types";
import { WinEditDialog } from "./WinEditDialog";

interface MonthWinsAccordionProps {
  monthKey: string; // "YYYY-MM"
  monthLabel: string; // "August 2026"
  isCurrentMonth: boolean;
  defaultExpanded?: boolean;
  days: DayWinsGroup[];
  onSaveDay: (payload: SaveDayWinsInput) => Promise<any>;
  isSaving: boolean;
}

export function MonthWinsAccordion({
  monthKey,
  monthLabel,
  isCurrentMonth,
  defaultExpanded = false,
  days,
  onSaveDay,
  isSaving,
}: MonthWinsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // State for the edit dialog
  const [editingDay, setEditingDay] = useState<{
    date: string;
    formattedDate: string;
    isToday: boolean;
    entries: WinEntry[];
  } | null>(null);

  const handleOpenEdit = (day: DayWinsGroup) => {
    setEditingDay({
      date: day.date,
      formattedDate: day.formattedDate,
      isToday: day.isToday,
      entries: day.entries,
    });
  };

  const handleCloseEdit = () => {
    setEditingDay(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-lg overflow-hidden transition-all duration-200">
      {/* Accordion Month Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-900/60 hover:bg-slate-900/90 transition-colors cursor-pointer text-left border-b border-transparent data-[expanded=true]:border-slate-800/80"
        data-expanded={isExpanded}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm tracking-tight text-slate-100">
              {monthLabel}
            </span>
            {isCurrentMonth && (
              <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full">
                Active Month
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-medium text-slate-500">
            {days.length} {days.length === 1 ? "day" : "days"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4.5 w-4.5 transition-transform" />
          ) : (
            <ChevronDown className="h-4.5 w-4.5 transition-transform" />
          )}
        </div>
      </button>

      {/* Accordion Content (Data Table) */}
      {isExpanded && (
        <div className="p-3 sm:p-5">
          <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950">
            {/* Scrollable Container */}
            <div className="max-h-[520px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                {/* Table Header */}
                <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 w-[22%] sm:w-[18%]">
                      Date
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 w-[38%] sm:w-[40%]">
                      <div className="flex items-center gap-1.5">
                        <span>Win Details</span>
                        <span
                          title="Log the milestones and achievements for the day"
                          className="text-slate-500 hover:text-slate-300 cursor-help"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 w-[32%] sm:w-[34%]">
                      <div className="flex items-center gap-1.5">
                        <span>Concept Used</span>
                        <span
                          title="The skills, topics, or technical concepts applied"
                          className="text-slate-500 hover:text-slate-300 cursor-help"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 w-[8%] text-center">
                      Edit
                    </th>
                  </tr>
                </thead>

                {/* Table Body (Reverse Chronological) */}
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {days.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-xs text-slate-500"
                      >
                        No date entries generated for this period.
                      </td>
                    </tr>
                  ) : (
                    days.map((day) => {
                      const hasEntries = day.entries && day.entries.length > 0;

                      return (
                        <tr
                          key={day.date}
                          className={`hover:bg-slate-900/40 transition-colors group ${
                            day.isToday ? "bg-indigo-950/20" : ""
                          }`}
                        >
                          {/* 1. Date Column */}
                          <td className="py-3 px-4 sm:px-6 font-medium whitespace-nowrap text-slate-200">
                            <div className="flex items-center gap-2">
                              <span>{day.formattedDate}</span>
                              {day.isToday && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] uppercase font-bold px-1.5 py-0 rounded-full">
                                  Today
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* 2. Win Details Column */}
                          <td className="py-3 px-4 sm:px-6">
                            {hasEntries ? (
                              <ul className="space-y-1">
                                {day.entries.map((entry) => (
                                  <li
                                    key={entry.id}
                                    className="flex items-start gap-2 text-slate-100"
                                  >
                                    <span className="text-indigo-400 shrink-0 font-bold">
                                      •
                                    </span>
                                    <span className="break-words">
                                      {entry.win_details || "-"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-slate-600 font-mono pl-1">
                                -
                              </span>
                            )}
                          </td>

                          {/* 3. Concept Used Column */}
                          <td className="py-3 px-4 sm:px-6">
                            {hasEntries ? (
                              <ul className="space-y-1">
                                {day.entries.map((entry) => (
                                  <li
                                    key={entry.id}
                                    className="flex items-start gap-2 text-slate-300"
                                  >
                                    <span className="text-cyan-400 shrink-0 font-bold">
                                      •
                                    </span>
                                    <span className="break-words">
                                      {entry.concept_used || "-"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-slate-600 font-mono pl-1">
                                -
                              </span>
                            )}
                          </td>

                          {/* 4. Edit Action Button Column */}
                          <td className="py-3 px-4 sm:px-6 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(day)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800/80 transition-all cursor-pointer inline-flex items-center justify-center group-hover:text-slate-300"
                              title={`Edit wins for ${day.formattedDate}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog for Selected Date */}
      {editingDay && (
        <WinEditDialog
          isOpen={Boolean(editingDay)}
          onClose={handleCloseEdit}
          date={editingDay.date}
          formattedDate={editingDay.formattedDate}
          isToday={editingDay.isToday}
          initialEntries={editingDay.entries}
          onSave={onSaveDay}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
