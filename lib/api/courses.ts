import { CreateCourseInput } from "@/types";

export async function fetchCourses() {
  const res = await fetch("/api/courses", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function createCourse(data: CreateCourseInput) {
  const res = await fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      description: data.description || "", // Default to empty string if undefined
      total_sessions: data.total_sessions,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create course");
  }

  return res.json();
}

export async function deleteCourse(id: string) {
  const res = await fetch(`/api/courses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete course");
  return res.json();
}

export async function updateCourse(
  id: string,
  payload: { is_active?: boolean; title?: string; description?: string },
) {
  const res = await fetch(`/api/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update course");
  }
  return res.json();
}
