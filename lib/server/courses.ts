import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getAllCoursesServer() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCourseByIdServer(id: string) {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourseServer(payload: {
  title: string;
  description: string;
  total_sessions: number;
}) {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourseServer(id: string) {
  const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);

  if (error) throw error;
  return true;
}
