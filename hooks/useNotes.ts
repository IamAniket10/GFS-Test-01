"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, CreateNoteInput, UpdateNoteInput } from "@/types";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/lib/api/notes";
import { toast } from "sonner";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err: any) {
      const message = err.message || "Failed to load notes";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = async (data: CreateNoteInput) => {
    try {
      const newNote = await createNote(data);

      setNotes((prev) => [newNote, ...prev]);

      toast.success("Note created successfully");

      return newNote;
    } catch (err: any) {
      const message = err.message || "Failed to create note";
      toast.error(message);
      throw err;
    }
  };

  const editNote = async (id: string, data: UpdateNoteInput) => {
    try {
      const updatedNote = await updateNote(id, data);

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note)),
      );

      toast.success("Note updated successfully");

      return updatedNote;
    } catch (err: any) {
      const message = err.message || "Failed to update note";
      toast.error(message);
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);

      setNotes((prev) => prev.filter((note) => note.id !== id));

      toast.success("Note deleted successfully");
    } catch (err: any) {
      const message = err.message || "Failed to delete note";
      toast.error(message);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    refresh: loadNotes,
    addNote,
    editNote,
    removeNote,
  };
}
