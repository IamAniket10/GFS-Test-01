"use client";

import { useMemo, useState } from "react";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";

import { NotesHeader } from "../../components/notes/NotesHeader";
import { NotesControls } from "../../components/notes/NotesControls";
import { NotesTable } from "../../components/notes/NotesTable";
import { NotesPagination } from "../../components/notes/NotesPagination";
import { NoteForm } from "../../components/notes/NoteForm";
import { DeleteNoteDialog } from "../../components/notes/DeleteNoteDialog";

import { Note } from "@/types";

export default function NotesPage() {
  const { notes, loading, error, refresh, addNote, editNote, removeNote } =
    useNotes();

  /* =========================================================
     TABLE STATE
  ========================================================= */

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     NOTE FORM STATE
  ========================================================= */

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     DELETE STATE
  ========================================================= */

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

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
     ADD
  ========================================================= */

  const openAddDialog = () => {
    resetForm();
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setIsFormOpen(false);
      setCurrentPage(1);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const openEditDialog = (note: Note) => {
    setFormMode("edit");

    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setLink(note.link || "");

    setIsFormOpen(true);
  };

  const handleEditNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId || !title.trim() || !content.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      await editNote(editingId, {
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || undefined,
      });

      resetForm();
      setIsFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const openDeleteDialog = (note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await removeNote(noteToDelete.id);

      setDeleteDialogOpen(false);
      setNoteToDelete(null);

      /*
       * If deleting the last item on the current page,
       * move back one page.
       */
      if (paginatedNotes.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } finally {
      setDeleting(false);
    }
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
      <NotesHeader onAdd={openAddDialog} />

      <NotesControls
        search={search}
        entriesPerPage={entriesPerPage}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onEntriesChange={(value) => {
          setEntriesPerPage(value);
          setCurrentPage(1);
        }}
      />

      <NotesTable
        notes={paginatedNotes}
        startIndex={(safePage - 1) * entriesPerPage}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <NotesPagination
        currentPage={safePage}
        totalPages={totalPages}
        startEntry={startEntry}
        endEntry={endEntry}
        totalEntries={filteredNotes.length}
        onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      />

      {/* ADD / EDIT */}

      <NoteForm
        open={isFormOpen}
        mode={formMode}
        title={title}
        content={content}
        link={link}
        submitting={submitting}
        onOpenChange={(open) => {
          setIsFormOpen(open);

          if (!open) {
            resetForm();
          }
        }}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onLinkChange={setLink}
        onSubmit={formMode === "add" ? handleAddNote : handleEditNote}
      />

      {/* DELETE CONFIRMATION */}

      <DeleteNoteDialog
        open={deleteDialogOpen}
        noteTitle={noteToDelete?.title}
        deleting={deleting}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open) {
            setNoteToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
