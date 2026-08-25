"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteNoteDialogProps {
  open: boolean;
  noteTitle?: string;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteNoteDialog({
  open,
  noteTitle,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <DialogTitle>Delete note?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            {noteTitle ? (
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                "{noteTitle}"
              </span>
            ) : (
              "this note"
            )}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="gap-2 bg-rose-600 text-white hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" />

            {deleting ? "Deleting..." : "Delete Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
