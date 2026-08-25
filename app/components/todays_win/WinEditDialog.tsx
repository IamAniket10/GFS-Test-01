"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Sparkles, Trophy, Lightbulb } from "lucide-react";
import { SaveDayWinsInput, WinEntry, WinItemInput } from "@/types";

interface WinEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // "YYYY-MM-DD"
  formattedDate: string; // "Sat, 22 Aug'26"
  isToday: boolean;
  initialEntries: WinEntry[];
  onSave: (payload: SaveDayWinsInput) => Promise<any>;
  isSaving: boolean;
}

export function WinEditDialog({
  isOpen,
  onClose,
  date,
  formattedDate,
  isToday,
  initialEntries,
  onSave,
  isSaving,
}: WinEditDialogProps) {
  const [items, setItems] = useState<WinItemInput[]>([]);

  // Initialize or reset form items when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialEntries && initialEntries.length > 0) {
        setItems(
          initialEntries.map((e) => ({
            id: e.id,
            win_details: e.win_details,
            concept_used: e.concept_used,
          })),
        );
      } else {
        // Start with one blank row for convenient entry
        setItems([
          {
            win_details: "",
            concept_used: "",
          },
        ]);
      }
    }
  }, [isOpen, initialEntries]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        win_details: "",
        concept_used: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeItem = (
    index: number,
    field: "win_details" | "concept_used",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        date,
        items,
      });
      onClose();
    } catch {
      // Error handling is managed by useWins toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-slate-900 border-slate-800 text-slate-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Trophy className="h-4.5 w-4.5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Log Wins for {formattedDate}</span>
                  {isToday && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                      Today
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  Record your daily achievements and key concepts applied.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="max-h-[60vh] overflow-y-auto space-y-3.5 pr-1">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Entry #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                      title="Remove this entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    Win Details
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. got 8 new orders, shipped the auth module"
                    value={item.win_details}
                    onChange={(e) =>
                      handleChangeItem(index, "win_details", e.target.value)
                    }
                    className="h-9 bg-slate-900 border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3 text-cyan-400" />
                    Concept Used
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Improved product marketing and sales budget, RBAC policies"
                    value={item.concept_used}
                    onChange={(e) =>
                      handleChangeItem(index, "concept_used", e.target.value)
                    }
                    className="h-9 bg-slate-900 border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full h-9 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            Add Another Win for this Day
          </Button>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Wins"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
