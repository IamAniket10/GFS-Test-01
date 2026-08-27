"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Referral } from "@/types";

interface AdminReferralsFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  referrals: Referral[];
}

export function AdminReferralsFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  referrals,
}: AdminReferralsFilterProps) {
  const totalCount = referrals.length;
  const pendingCount = referrals.filter((r) => r.status === "Pending").length;
  const acceptedCount = referrals.filter((r) => r.status === "Accepted").length;
  const inReviewCount = referrals.filter((r) => r.status === "In Review").length;

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by client name, email, or service interest..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-9 rounded-xl text-xs h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <div className="w-48 shrink-0">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="rounded-xl text-xs h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-indigo-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pill summary counters */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] font-medium mr-1">Quick counts:</span>
        <button
          type="button"
          onClick={() => onStatusChange("All")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            statusFilter === "All"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          Total ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Pending")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            statusFilter === "Pending"
              ? "bg-amber-600 text-white"
              : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60"
          }`}
        >
          Pending ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("In Review")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            statusFilter === "In Review"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/60"
          }`}
        >
          In Review ({inReviewCount})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Accepted")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            statusFilter === "Accepted"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60"
          }`}
        >
          Accepted ({acceptedCount})
        </button>
      </div>
    </div>
  );
}
