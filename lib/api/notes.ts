import { CreateNoteInput, UpdateNoteInput } from "@/types";

export async function fetchNotes() {
  const res = await fetch("/api/notes", {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch notes");
  }

  return res.json();
}

export async function createNote(data: CreateNoteInput) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create note");
  }

  return res.json();
}

export async function updateNote(id: string, data: UpdateNoteInput) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update note");
  }

  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete note");
  }

  return res.json();
}
