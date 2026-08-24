import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getNotesServer(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

export async function getNoteByIdServer(id: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function createNoteServer(
  userId: string,
  payload: {
    title: string;
    content: string;
    link?: string;
  },
) {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .insert([
      {
        user_id: userId,
        title: payload.title,
        content: payload.content,
        link: payload.link || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateNoteServer(
  id: string,
  userId: string,
  payload: {
    title?: string;
    content?: string;
    link?: string | null;
  },
) {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteNoteServer(id: string, userId: string) {
  const { error } = await supabaseAdmin
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return true;
}
