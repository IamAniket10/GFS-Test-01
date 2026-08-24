"use client";

import { useMemo, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import {
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NotesPage() {
  const { notes, loading, error, refresh, addNote, editNote, removeNote } =
    useNotes();

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.link?.toLowerCase().includes(query),
    );
  }, [notes, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotes.length / entriesPerPage),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedNotes = useMemo(() => {
    const start = (safePage - 1) * entriesPerPage;

    return filteredNotes.slice(start, start + entriesPerPage);
  }, [filteredNotes, safePage, entriesPerPage]);

  const startEntry =
    filteredNotes.length === 0 ? 0 : (safePage - 1) * entriesPerPage + 1;

  const endEntry = Math.min(safePage * entriesPerPage, filteredNotes.length);

  /* =========================================================
     FORM RESET
  ========================================================= */

  const resetForm = () => {
    setTitle("");
    setContent("");
    setLink("");
    setEditingId(null);
  };

  /* =========================================================
     SEARCH HANDLERS
  ========================================================= */

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  /* =========================================================
     NUMBERED LIST HANDLER
     
     This is the important part.

     Pressing Enter after:

     1. First point

     automatically creates:

     2. 
  ========================================================= */

  const handleContentKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key !== "Enter") {
      return;
    }

    const textarea = e.currentTarget;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const beforeCursor = content.substring(0, start);

    // Get the current line
    const lines = beforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Check if current line starts with "number. "
    const match = currentLine.match(/^(\d+)\.\s/);

    if (match) {
      e.preventDefault();

      const currentNumber = Number(match[1]);
      const nextNumber = currentNumber + 1;

      const newText =
        content.substring(0, start) +
        `\n${nextNumber}. ` +
        content.substring(end);

      setContent(newText);

      // Put cursor after the newly-created number
      requestAnimationFrame(() => {
        const newCursorPosition = start + `\n${nextNumber}. `.length;

        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
      });

      return;
    }

    /*
      If the textarea is empty and user presses Enter,
      start the list.
    */
    if (content.trim() === "") {
      e.preventDefault();

      setContent("1. ");

      requestAnimationFrame(() => {
        textarea.selectionStart = 3;
        textarea.selectionEnd = 3;
      });

      return;
    }
  };

  /* =========================================================
     CREATE NOTE
  ========================================================= */

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      await addNote({
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || undefined,
      });

      resetForm();
      setIsAddOpen(false);
      setCurrentPage(1);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     EDIT NOTE
  ========================================================= */

  const openEditDialog = (note: (typeof notes)[number]) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setLink(note.link || "");
  };

  const handleEditNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId || !title.trim() || !content.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      await editNote(editingId, {
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || null,
      });

      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE NOTE
  ========================================================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) {
      return;
    }

    await removeNote(id);
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          Loading notes...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-800/50 dark:bg-red-950/20">
        <AlertTriangle className="mb-3 h-10 w-10 text-red-500" />

        <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
          Failed to load notes
        </h3>

        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>

        <Button onClick={refresh} variant="outline" className="mt-5 gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Notes Page
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Capture references, thoughts, and links in one place with quick
              inline updates.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Show</span>

          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span>entries</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search notes..."
            className="pl-9"
          />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

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
              {paginatedNotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    {search
                      ? "No notes match your search."
                      : "No notes created yet."}
                  </td>
                </tr>
              ) : (
                paginatedNotes.map((note, index) => {
                  const serialNumber =
                    (safePage - 1) * entriesPerPage + index + 1;

                  return (
                    <tr
                      key={note.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {serialNumber}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {formatDate(note.created_at)}
                      </td>

                      <td className="max-w-[180px] px-4 py-4">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                          {note.title}
                        </p>
                      </td>

                      {/* =================================================
                          NOTES DISPLAY

                          whitespace-pre-line is important because
                          database contains:

                          1. First point
                          2. Second point
                          3. Third point
                      ================================================= */}

                      <td className="max-w-[350px] px-4 py-4">
                        <div className="whitespace-pre-line text-xs leading-6 text-slate-500 dark:text-slate-400">
                          {note.content}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {note.link ? (
                          <a
                            href={note.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-950"
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
                            onClick={() => openEditDialog(note)}
                            className="h-8 w-8 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(note.id)}
                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {startEntry} to {endEntry} of {filteredNotes.length} entries
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              Page {safePage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD NOTE DIALOG
      ===================================================== */}

      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);

          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddNote} className="space-y-4">
            {/* TITLE */}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Title
              </label>

              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>

            {/* NOTES */}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notes
              </label>

              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleContentKeyDown}
                onFocus={() => {
                  if (!content.trim()) {
                    setContent("1. ");
                  }
                }}
                placeholder="Write your note..."
                rows={10}
                className="flex w-full resize-y rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
              />

              <p className="text-[11px] text-slate-400">
                Press Enter after each point to automatically create the next
                numbered point.
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
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {submitting ? "Saving..." : "Save Note"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          EDIT NOTE DIALOG
      ===================================================== */}

      <Dialog
        open={!!editingId}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditNote} className="space-y-4">
            {/* TITLE */}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Title
              </label>

              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>

            {/* NOTES */}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notes
              </label>

              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleContentKeyDown}
                placeholder="Write your note..."
                rows={10}
                className="flex w-full resize-y rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
              />

              <p className="text-[11px] text-slate-400">
                Press Enter after each point to create the next numbered point.
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
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {submitting ? "Updating..." : "Update Note"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// "use client";

// import { useMemo, useState } from "react";
// import { useNotes } from "@/hooks/useNotes";
// import {
//   FileText,
//   Plus,
//   Search,
//   Pencil,
//   Trash2,
//   ExternalLink,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   AlertTriangle,
//   RefreshCw,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// export default function NotesPage() {
//   const { notes, loading, error, refresh, addNote, editNote, removeNote } =
//     useNotes();

//   const [search, setSearch] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [link, setLink] = useState("");

//   const [submitting, setSubmitting] = useState(false);

//   const filteredNotes = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return notes;
//     }

//     return notes.filter(
//       (note) =>
//         note.title.toLowerCase().includes(query) ||
//         note.content.toLowerCase().includes(query) ||
//         note.link?.toLowerCase().includes(query),
//     );
//   }, [notes, search]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredNotes.length / entriesPerPage),
//   );

//   const safePage = Math.min(currentPage, totalPages);

//   const paginatedNotes = useMemo(() => {
//     const start = (safePage - 1) * entriesPerPage;
//     return filteredNotes.slice(start, start + entriesPerPage);
//   }, [filteredNotes, safePage, entriesPerPage]);

//   const startEntry =
//     filteredNotes.length === 0 ? 0 : (safePage - 1) * entriesPerPage + 1;

//   const endEntry = Math.min(safePage * entriesPerPage, filteredNotes.length);

//   const resetForm = () => {
//     setTitle("");
//     setContent("");
//     setLink("");
//     setEditingId(null);
//   };

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//   };

//   const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setEntriesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleAddNote = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!title.trim() || !content.trim()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await addNote({
//         title: title.trim(),
//         content: content.trim(),
//         link: link.trim() || undefined,
//       });

//       resetForm();
//       setIsAddOpen(false);
//       setCurrentPage(1);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openEditDialog = (note: (typeof notes)[number]) => {
//     setEditingId(note.id);
//     setTitle(note.title);
//     setContent(note.content);
//     setLink(note.link || "");
//   };

//   const handleEditNote = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!editingId || !title.trim() || !content.trim()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await editNote(editingId, {
//         title: title.trim(),
//         content: content.trim(),
//         link: link.trim() || null,
//       });

//       resetForm();
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this note?",
//     );

//     if (!confirmed) {
//       return;
//     }

//     await removeNote(id);
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center">
//         <div className="flex items-center gap-2 text-sm text-slate-500">
//           <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
//           Loading notes...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto flex max-w-7xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-800/50 dark:bg-red-950/20">
//         <AlertTriangle className="mb-3 h-10 w-10 text-red-500" />

//         <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
//           Failed to load notes
//         </h3>

//         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>

//         <Button onClick={refresh} variant="outline" className="mt-5 gap-2">
//           <RefreshCw className="h-4 w-4" />
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3.5">
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
//             <FileText className="h-6 w-6" />
//           </div>

//           <div>
//             <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
//               Notes Page
//             </h2>

//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Capture references, thoughts, and links in one place with quick
//               inline updates.
//             </p>
//           </div>
//         </div>

//         <Button
//           onClick={() => {
//             resetForm();
//             setIsAddOpen(true);
//           }}
//           className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
//         >
//           <Plus className="h-4 w-4" />
//           Add Note
//         </Button>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2 text-xs text-slate-500">
//           <span>Show</span>

//           <select
//             value={entriesPerPage}
//             onChange={handleEntriesChange}
//             className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>

//           <span>entries</span>
//         </div>

//         <div className="relative w-full sm:w-72">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//           <Input
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search notes..."
//             className="pl-9"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[900px] text-left">
//             <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
//               <tr>
//                 <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
//                   S. No.
//                 </th>

//                 <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
//                   Created On
//                 </th>

//                 <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
//                   Title
//                 </th>

//                 <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
//                   Notes
//                 </th>

//                 <th className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
//                   Links
//                 </th>

//                 <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-slate-500">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedNotes.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-12 text-center text-sm text-slate-500"
//                   >
//                     {search
//                       ? "No notes match your search."
//                       : "No notes created yet."}
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedNotes.map((note, index) => {
//                   const serialNumber =
//                     (safePage - 1) * entriesPerPage + index + 1;

//                   return (
//                     <tr
//                       key={note.id}
//                       className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
//                     >
//                       <td className="px-4 py-4 text-xs text-slate-500">
//                         {serialNumber}
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
//                         {formatDate(note.created_at)}
//                       </td>

//                       <td className="max-w-[180px] px-4 py-4">
//                         <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
//                           {note.title}
//                         </p>
//                       </td>

//                       <td className="max-w-[350px] px-4 py-4">
//                         <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
//                           {note.content}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4">
//                         {note.link ? (
//                           <a
//                             href={note.link}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-950"
//                           >
//                             View
//                             <ExternalLink className="h-3 w-3" />
//                           </a>
//                         ) : (
//                           <span className="text-xs text-slate-400">—</span>
//                         )}
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="flex justify-end gap-1">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => openEditDialog(note)}
//                             className="h-8 w-8 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40"
//                           >
//                             <Pencil className="h-3.5 w-3.5" />
//                           </Button>

//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDelete(note.id)}
//                             className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
//                           >
//                             <Trash2 className="h-3.5 w-3.5" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Showing {startEntry} to {endEntry} of {filteredNotes.length} entries
//           </p>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={safePage <= 1}
//               onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//               className="gap-1 text-xs"
//             >
//               <ChevronLeft className="h-3.5 w-3.5" />
//               Previous
//             </Button>

//             <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
//               Page {safePage} of {totalPages}
//             </span>

//             <Button
//               variant="outline"
//               size="sm"
//               disabled={safePage >= totalPages}
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//               }
//               className="gap-1 text-xs"
//             >
//               Next
//               <ChevronRight className="h-3.5 w-3.5" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Add Note Dialog */}
//       <Dialog
//         open={isAddOpen}
//         onOpenChange={(open) => {
//           setIsAddOpen(open);

//           if (!open) {
//             resetForm();
//           }
//         }}
//       >
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Add Note</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleAddNote} className="space-y-4">
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Title
//               </label>

//               <Input
//                 required
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter note title"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Notes
//               </label>

//               <textarea
//                 required
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="Write your note..."
//                 rows={6}
//                 className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Link
//               </label>

//               <Input
//                 type="url"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//                 placeholder="https://example.com"
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
//             >
//               {submitting ? "Saving..." : "Save Note"}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Note Dialog */}
//       <Dialog
//         open={!!editingId}
//         onOpenChange={(open) => {
//           if (!open) {
//             resetForm();
//           }
//         }}
//       >
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Edit Note</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleEditNote} className="space-y-4">
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Title
//               </label>

//               <Input
//                 required
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter note title"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Notes
//               </label>

//               <textarea
//                 required
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="Write your note..."
//                 rows={6}
//                 className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Link
//               </label>

//               <Input
//                 type="url"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//                 placeholder="https://example.com"
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
//             >
//               {submitting ? "Updating..." : "Update Note"}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
