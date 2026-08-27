"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, CheckCircle, Loader2 } from "lucide-react";
import { Referral, ReferralStatus } from "@/types";

interface UpdateReferralStatusDialogProps {
  referral: Referral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (
    id: string,
    newStatus: ReferralStatus,
    adminNotes?: string | null,
  ) => Promise<any>;
}

export function UpdateReferralStatusDialog({
  referral,
  open,
  onOpenChange,
  onUpdate,
}: UpdateReferralStatusDialogProps) {
  const [status, setStatus] = useState<ReferralStatus>("Pending");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (referral) {
      setStatus(referral.status);
      setAdminNotes(referral.admin_notes || "");
    }
  }, [referral]);

  if (!referral) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onUpdate(referral.id, status, adminNotes);
      toast.success("Referral Updated", {
        description: `Status changed to ${status} for ${referral.client_name}.`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.message || "Could not update referral status.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <form onSubmit={handleSave}>
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  Update Referral Status
                </DialogTitle>
                <DialogDescription className="text-xs text-indigo-100">
                  Client: <span className="font-semibold">{referral.client_name}</span>
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Referral Status <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(val: ReferralStatus) => setStatus(val)}
              >
                <SelectTrigger id="status" className="rounded-xl text-xs h-10">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="Pending">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="In Review">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      In Review
                    </span>
                  </SelectItem>
                  <SelectItem value="Accepted">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Accepted
                    </span>
                  </SelectItem>
                  <SelectItem value="Rejected">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Rejected
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="admin_notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Internal Admin Notes
              </Label>
              <Textarea
                id="admin_notes"
                placeholder="Log internal comments, interview feedback, or followup dates..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="rounded-xl text-xs resize-none"
              />
              <p className="text-[10px] text-slate-400">
                These notes are only visible to administrators.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
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
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
