import { SaveDayWinsInput, WinEntry } from "@/types";

/**
 * Fetch wins for the authenticated user.
 * Optional `month` parameter formatted as "YYYY-MM" (e.g. "2026-08").
 */
export async function fetchWins(month?: string): Promise<WinEntry[]> {
  const url = month ? `/api/wins?month=${encodeURIComponent(month)}` : "/api/wins";

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch daily wins");
  }

  return res.json();
}

/**
 * Save or reconcile multiple win items for a specific date.
 */
export async function saveDayWins(
  payload: SaveDayWinsInput,
): Promise<WinEntry[]> {
  const res = await fetch("/api/wins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save daily wins");
  }

  return res.json();
}

/**
 * Delete a specific win entry by ID.
 */
export async function deleteWin(id: string): Promise<boolean> {
  const res = await fetch(`/api/wins?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete win entry");
  }

  return true;
}
