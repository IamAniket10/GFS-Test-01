"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit3,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  User,
  Inbox,
} from "lucide-react";
import { Referral, ReferralStatus, UrgencyLevel } from "@/types";
import { SortColumn, SortOrder } from "@/hooks/useAdminReferrals";
import { ReferralDetailsDialog } from "@/app/components/referrals/admin/ReferralDetailsDialog";
import { UpdateReferralStatusDialog } from "@/app/components/referrals/admin/UpdateReferralStatusDialog";
import { DeleteReferralDialog } from "@/app/components/referrals/admin/DeleteReferralDialog";

interface AdminReferralsTableProps {
  referrals: Referral[];
  loading: boolean;
  sortBy: SortColumn;
  sortOrder: SortOrder;
  onSort: (column: SortColumn) => void;
  onUpdateStatus: (
    id: string,
    newStatus: ReferralStatus,
    adminNotes?: string | null,
  ) => Promise<any>;
  onDeleteRecord: (id: string) => Promise<any>;
}

export function AdminReferralsTable({
  referrals,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onUpdateStatus,
  onDeleteRecord,
}: AdminReferralsTableProps) {
  // Modal states
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60 ml-1" />;
    }
    return sortOrder === "ASC" ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400 ml-1 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 dark:text-indigo-400 ml-1 font-bold" />
    );
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50/80 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "In Review":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50/80 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400"
          >
            <Sparkles className="h-3 w-3" />
            In Review
          </Badge>
        );
      case "Accepted":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50/80 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400"
          >
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "High":
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/50">
            High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Low
          </span>
        );
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
              <TableRow>
                {/* Client Name Header with Sorting */}
                <TableHead className="pl-6">
                  <button
                    type="button"
                    onClick={() => onSort("client_name")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Client Name
                    {renderSortIcon("client_name")}
                  </button>
                </TableHead>

                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Contact Information
                </TableHead>

                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Service Interest
                </TableHead>

                {/* Urgency Level Header with Sorting */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => onSort("urgency_level")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Urgency
                    {renderSortIcon("urgency_level")}
                  </button>
                </TableHead>

                {/* Status Header with Sorting */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => onSort("status")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Status
                    {renderSortIcon("status")}
                  </button>
                </TableHead>

                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Referred By
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Admin Notes
                </TableHead>

                {/* Submission Date Header with Sorting */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => onSort("created_at")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Date
                    {renderSortIcon("created_at")}
                  </button>
                </TableHead>

                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-200 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell className="pl-6 py-4">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        No referrals found matching your query
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search terms or status filter.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Client Name */}
                    <TableCell className="pl-6 py-3.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                      {item.client_name}
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell className="py-3.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {item.client_email}
                        </span>
                        {item.client_phone && (
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {item.client_phone}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Service Interest */}
                    <TableCell className="py-3.5 text-xs">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-md text-[11px] border border-indigo-100 dark:border-indigo-900/50">
                        {item.service_interest}
                      </span>
                    </TableCell>

                    {/* Urgency */}
                    <TableCell className="py-3.5">
                      {getUrgencyBadge(item.urgency_level)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      {getStatusBadge(item.status)}
                    </TableCell>

                    {/* Submitter */}
                    <TableCell className="py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col max-w-[140px] truncate">
                        <span className="text-[11px] font-mono truncate text-slate-700 dark:text-slate-300" title={item.referrer_name || item.user_id}>
                          {item.referrer_name || item.user_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {item.admin_notes ?? "---"}
                    </TableCell>

                    {/* Submission Date */}
                    <TableCell className="py-3.5 text-xs text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* CRUD Actions */}
                    <TableCell className="py-3.5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Read Details */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedReferral(item);
                            setIsViewOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          title="View Full Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* Update Status & Notes */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedReferral(item);
                            setIsEditOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                          title="Update Status & Notes"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedReferral(item);
                            setIsDeleteOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete Record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Read Modal */}
      <ReferralDetailsDialog
        referral={selectedReferral}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      {/* Update Status & Notes Modal */}
      <UpdateReferralStatusDialog
        referral={selectedReferral}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdateStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteReferralDialog
        referral={selectedReferral}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={onDeleteRecord}
      />
    </>
  );
}
