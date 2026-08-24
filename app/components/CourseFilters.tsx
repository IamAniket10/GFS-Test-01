"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, RotateCcw } from "lucide-react";

type StatusFilter = "all" | "active" | "inactive";

interface CourseFiltersProps {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

export default function CourseFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: CourseFiltersProps) {
  const isFiltered = search.trim() !== "" || status !== "all";

  const handleReset = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or description..."
          className="pl-9 pr-8 text-xs rounded-xl border-slate-200/80 bg-slate-50/50 transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/50"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search input"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Controls Group */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Status Filter Dropdown */}
        <div className="flex-1 sm:w-[170px] sm:flex-initial">
          <Select
            value={status}
            onValueChange={(value) => onStatusChange(value as StatusFilter)}
          >
            <SelectTrigger className="text-xs font-medium rounded-xl border-slate-200/80 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Filter className="h-3.5 w-3.5 text-indigo-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
              <SelectItem
                value="all"
                className="cursor-pointer text-xs font-medium rounded-lg focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-950/40 dark:focus:text-indigo-400"
              >
                All Courses
              </SelectItem>
              <SelectItem
                value="active"
                className="cursor-pointer text-xs font-medium text-indigo-600 dark:text-indigo-400 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40"
              >
                Active Only
              </SelectItem>
              <SelectItem
                value="inactive"
                className="cursor-pointer text-xs font-medium text-slate-500 rounded-lg focus:bg-slate-100 dark:focus:bg-slate-800"
              >
                Inactive Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-9 px-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl"
            title="Reset active filters"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
