"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Referral } from "@/types";

interface DeleteReferralDialogProps {
  referral: Referral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<any>;
}

export function DeleteReferralDialog({
  referral,
  open,
  onOpenChange,
  onDelete,
}: DeleteReferralDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!referral) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(referral.id);
      toast.success("Referral Deleted", {
        description: `Successfully removed referral record for ${referral.client_name}.`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Delete Failed", {
        description: err.message || "Failed to delete referral record.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/50 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-rose-900 dark:text-rose-100">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-xs text-rose-700/80 dark:text-rose-300/80">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to permanently delete the referral record for{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {referral.client_name}
            </span>{" "}
            (<span className="font-mono text-slate-500">{referral.client_email}</span>)?
          </p>
          <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1 text-slate-500">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Program:</span>{" "}
              {referral.service_interest}
            </p>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>{" "}
              {referral.status}
            </p>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete Record
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
