"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "@/types";

interface NotesTableProps {
  notes: Note[];
  startIndex: number;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export function NotesTable({
  notes,
  startIndex,
  onEdit,
  onDelete,
}: NotesTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                S. No.
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                Created On
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                Title
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                Notes
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                Links
              </th>

              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No notes match your search.
                </td>
              </tr>
            ) : (
              notes.map((note, index) => (
                <tr
                  key={note.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {startIndex + index + 1}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                    {formatDate(note.created_at)}
                  </td>

                  <td className="max-w-[180px] px-4 py-4">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                      {note.title}
                    </p>
                  </td>

                  <td className="max-w-[350px] px-4 py-4">
                    <p className="line-clamp-3 whitespace-pre-line text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {note.content}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    {note.link ? (
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(note)}
                        className="h-8 w-8 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(note)}
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
