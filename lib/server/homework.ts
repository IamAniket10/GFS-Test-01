import { supabaseAdmin } from "@/lib/supabase/admin";
import { UserRole } from "@/types";

export async function getHomeworkServer(
  userId: string,
  role: UserRole,
  courseId?: string,
) {
  let query = supabaseAdmin.from("homework").select("*");

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  // Students can only see their own homework.
  if (role === "student") {
    query = query.eq("student_id", userId);
  }

  const { data, error } = await query.order("due_date", {
    ascending: true,
  });

  if (error) throw error;

  return data;
}

export async function getHomeworkByIdServer(
  id: string,
  userId: string,
  role: UserRole,
) {
  let query = supabaseAdmin.from("homework").select("*").eq("id", id);

  // Students can only access their own homework.
  if (role === "student") {
    query = query.eq("student_id", userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;

  return data;
}

export async function createHomeworkServer(payload: {
  course_id: string;
  student_id: string;
  title: string;
  due_date: string;
  status?: "pending" | "submitted" | "reviewed";
}) {
  const { data, error } = await supabaseAdmin
    .from("homework")
    .insert([
      {
        ...payload,
        status: payload.status || "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateHomeworkServer(
  id: string,
  payload: {
    title?: string;
    due_date?: string;
    status?: "pending" | "submitted" | "reviewed";
  },
) {
  const { data, error } = await supabaseAdmin
    .from("homework")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteHomeworkServer(id: string) {
  const { error } = await supabaseAdmin.from("homework").delete().eq("id", id);

  if (error) throw error;

  return true;
}
