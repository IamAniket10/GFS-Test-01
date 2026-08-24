export async function fetchHomework(courseId?: string) {
  console.log("Fetching homework for courseId:", courseId);
  const url = courseId
    ? `/api/homework?course_id=${courseId}`
    : "/api/homework";
  console.log("Fetch URL:", url);
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch homework");
  }
  return res.json();
}

export async function createHomework(data: {
  course_id: string;
  student_id: string;
  title: string;
  due_date: string;
  status?: "pending" | "submitted" | "reviewed";
}) {
  const res = await fetch("/api/homework", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create homework");
  }
  return res.json();
}

export async function updateHomeworkStatus(
  id: string,
  status: "pending" | "submitted" | "reviewed",
) {
  const res = await fetch(`/api/homework/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update homework status");
  }
  return res.json();
}

export async function deleteHomework(id: string) {
  const res = await fetch(`/api/homework/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete homework");
  }
  return res.json();
}
