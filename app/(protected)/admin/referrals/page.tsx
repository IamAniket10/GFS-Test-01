"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useAdminReferrals } from "@/hooks/useAdminReferrals";
import { AdminReferralsFilter } from "@/app/components/referrals/admin/AdminReferralsFilter";
import { AdminReferralsTable } from "@/app/components/referrals/admin/AdminReferralsTable";
import {
  Users,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReferralsPage() {
  const { canAccessAdmin, isLoading: authLoading } = useAuth();
  const {
    referrals,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    updateStatus,
    removeReferral,
    refresh,
  } = useAdminReferrals();

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
          Checking permissions...
        </div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <ShieldCheck className="mx-auto h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            You do not have permission to access the Client Referral Management Portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Navigation */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 -ml-2 h-7 px-2"
              >
                <Link href="/admin">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Admin
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Client Referral Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Search, filter, update statuses, and review student-submitted client referrals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">

            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <AdminReferralsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        referrals={referrals}
      />

      {/* Interactive Table with Field-Wise Sorting & CRUD */}
      <AdminReferralsTable
        referrals={referrals}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onUpdateStatus={updateStatus}
        onDeleteRecord={removeReferral}
      />
    </div>
  );
}
