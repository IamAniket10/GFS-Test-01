"use client";

import { useReferrals } from "@/hooks/useReferrals";
import { ReferralModalDialog } from "@/app/components/referrals/ReferralModalDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferralStatus, UrgencyLevel } from "@/types";

export function UserReferralsSection() {
  const { referrals, loading, error, refreshReferrals } = useReferrals();

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
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                My Client Referrals
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Track status and history of clients you have referred to CoachTrack
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshReferrals}
              disabled={loading}
              className="h-8 w-8 rounded-xl border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400"
              title="Refresh referrals"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* "Refer a Client" Trigger Button */}
            <ReferralModalDialog onSuccess={refreshReferrals} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
            Loading your referrals...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 m-4 rounded-xl border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No referrals submitted yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Know someone who would benefit from 1-on-1 coaching or our technical courses? Refer them today!
              </p>
            </div>
            <div className="pt-2">
              <ReferralModalDialog onSuccess={refreshReferrals} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-800/40">
                <TableRow className="border-b border-slate-200/60 dark:border-slate-800">
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-6">
                    Client Name
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Contact Details
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Program Interest
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Urgency
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Reason
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-300 text-right pr-6">
                    Submitted Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-semibold text-xs text-slate-900 dark:text-slate-100 pl-6 py-3.5">
                      {item.client_name}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
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
                    <TableCell className="text-xs py-3.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                        {item.service_interest}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      {getUrgencyBadge(item.urgency_level)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {(item.referral_reason ?? "---")}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 text-right pr-6 py-3.5 font-mono">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
