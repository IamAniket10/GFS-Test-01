"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  KeyRound,
} from "lucide-react";
import { Referral } from "@/types";


interface ReferralDetailsDialogProps {
  referral: Referral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralDetailsDialog({
  referral,
  open,
  onOpenChange,
}: ReferralDetailsDialogProps) {

  if (!referral) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400"
          >
            <Clock className="h-3.5 w-3.5" />
            Pending Review
          </Badge>
        );
      case "In Review":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            In Review
          </Badge>
        );
      case "Accepted":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400"
          >
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  {referral.client_name}
                </DialogTitle>
              </div>
            </div>
            {getStatusBadge(referral.status)}
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Submitter Info Card */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              <KeyRound className="h-3.5 w-3.5" />
              Submitted By (Student Account)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Submitter Name:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {referral.referrer_name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Client Contact Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Client Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500">Email Address</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{referral.client_email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500">Phone Number</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {referral.client_phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Program & Urgency */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interest & Priority
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-start gap-2.5">
                <Briefcase className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500">Service Track</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{referral.service_interest}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500">Urgency Level</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{referral.urgency_level} Priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason / Submitter Notes */}
          {referral.referral_reason && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Referral Context / Notes
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 whitespace-pre-wrap">
                {referral.referral_reason}
              </p>
            </div>
          )}

          {/* Internal Admin Notes */}
          {referral.admin_notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Internal Admin Notes
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 whitespace-pre-wrap">
                {referral.admin_notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Calendar className="h-3.5 w-3.5" />
            Submitted on {new Date(referral.created_at).toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
