"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BULLET = "• ";

interface NoteFormProps {
  open: boolean;
  mode: "add" | "edit";
  title: string;
  content: string;
  link: string;
  submitting: boolean;

  onOpenChange: (open: boolean) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onLinkChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NoteForm({
  open,
  mode,
  title,
  content,
  link,
  submitting,
  onOpenChange,
  onTitleChange,
  onContentChange,
  onLinkChange,
  onSubmit,
}: NoteFormProps) {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;

    /*
     * First typed character:
     *
     * React
     *
     * becomes:
     *
     * • React
     */
    if (value.length === 1 && value !== BULLET) {
      const newValue = `${BULLET}${value}`;

      onContentChange(newValue);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.selectionStart = newValue.length;
          contentRef.current.selectionEnd = newValue.length;
        }
      });

      return;
    }

    /*
     * When Enter is pressed, add a new bullet.
     */
    if (
      value[cursorPosition - 1] === "\n" &&
      value[cursorPosition] !== BULLET[0]
    ) {
      const beforeCursor = value.slice(0, cursorPosition);
      const afterCursor = value.slice(cursorPosition);

      const newValue = beforeCursor + BULLET + afterCursor;

      onContentChange(newValue);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          const newPosition = cursorPosition + BULLET.length;

          contentRef.current.selectionStart = newPosition;
          contentRef.current.selectionEnd = newPosition;
        }
      });

      return;
    }

    onContentChange(value);
  };

  const handleContentKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key !== "Backspace") {
      return;
    }

    const textarea = e.currentTarget;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    /*
     * Don't interfere with normal selection deletion.
     */
    if (start !== end) {
      return;
    }

    const value = textarea.value;

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;

    const textBeforeCursor = value.slice(lineStart, start);

    /*
     * Cursor immediately after:
     *
     * •
     *  ^
     *
     * Remove bullet.
     */
    if (textBeforeCursor === BULLET) {
      e.preventDefault();

      const newValue = value.slice(0, lineStart) + value.slice(start);

      onContentChange(newValue);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.selectionStart = lineStart;
          contentRef.current.selectionEnd = lineStart;
        }
      });

      return;
    }

    /*
     * Cursor immediately after the bullet character.
     *
     * •|
     */
    if (textBeforeCursor === "•" && start === lineStart + 1) {
      e.preventDefault();

      const newValue = value.slice(0, lineStart) + value.slice(start);

      onContentChange(newValue);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.selectionStart = lineStart;
          contentRef.current.selectionEnd = lineStart;
        }
      });

      return;
    }

    /*
     * If cursor is at the beginning of the text after
     * a bullet, remove the bullet.
     */
    if (start === lineStart + BULLET.length && textBeforeCursor === BULLET) {
      e.preventDefault();

      const newValue = value.slice(0, lineStart) + value.slice(start);

      onContentChange(newValue);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.selectionStart = lineStart;
          contentRef.current.selectionEnd = lineStart;
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Note" : "Edit Note"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* TITLE */}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Title
            </label>

            <Input
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter note title"
            />
          </div>

          {/* CONTENT */}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Content
            </label>

            <textarea
              ref={contentRef}
              required
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleContentKeyDown}
              placeholder="Start typing your note..."
              rows={8}
              className="flex w-full resize-y rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
            />

            <p className="text-[11px] text-slate-400">
              Start typing to create bullet points. Press Enter for the next
              bullet.
            </p>
          </div>

          {/* LINK */}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Link
            </label>

            <Input
              type="url"
              value={link}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {submitting
              ? mode === "add"
                ? "Saving..."
                : "Updating..."
              : mode === "add"
                ? "Save Note"
                : "Update Note"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
