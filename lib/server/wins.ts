import { supabaseAdmin } from "@/lib/supabase/admin";
import { SaveDayWinsInput, WinEntry } from "@/types";

/**
 * Fetch all win entries for a specific user.
 * Optional `month` filter formatted as "YYYY-MM" (e.g. "2026-08").
 */
export async function getWinsForUserServer(
  userId: string,
  month?: string,
): Promise<WinEntry[]> {
  let query = supabaseAdmin
    .from("daily_wins")
    .select("*")
    .eq("user_id", userId);

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const startDate = `${month}-01`;
    // Compute last day of the month
    const lastDayNum = new Date(year, monthNum, 0).getDate();
    const endDate = `${month}-${String(lastDayNum).padStart(2, "0")}`;

    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query
    .order("date", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as WinEntry[];
}

/**
 * Save / Reconcile multiple win entries for a specific date.
 * Reconciles additions, updates, and removals of items for that day.
 */
export async function saveDayWinsServer(
  userId: string,
  payload: SaveDayWinsInput,
): Promise<WinEntry[]> {
  const { date, items } = payload;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  // Filter out completely empty items where both win_details and concept_used are blank
  const validItems = (items || []).filter(
    (item) =>
      item.win_details.trim().length > 0 || item.concept_used.trim().length > 0,
  );

  // 1. Fetch current existing entries for this user and date
  const { data: existingEntries, error: fetchErr } = await supabaseAdmin
    .from("daily_wins")
    .select("id")
    .eq("user_id", userId)
    .eq("date", date);

  if (fetchErr) {
    throw fetchErr;
  }

  const incomingIdsWithId = validItems
    .map((item) => item.id)
    .filter((id): id is string => Boolean(id));

  // 2. Delete any entries removed by user in this date edit
  const idsToDelete = (existingEntries || [])
    .map((row) => row.id)
    .filter((id) => !incomingIdsWithId.includes(id));

  if (idsToDelete.length > 0) {
    const { error: delErr } = await supabaseAdmin
      .from("daily_wins")
      .delete()
      .in("id", idsToDelete);

    if (delErr) {
      throw delErr;
    }
  }

  // 3. Update existing items
  for (const item of validItems) {
    if (item.id) {
      const { error: updateErr } = await supabaseAdmin
        .from("daily_wins")
        .update({
          win_details: item.win_details.trim(),
          concept_used: item.concept_used.trim(),
        })
        .eq("id", item.id)
        .eq("user_id", userId);

      if (updateErr) {
        throw updateErr;
      }
    }
  }

  // 4. Insert newly added items
  const newItemsToInsert = validItems
    .filter((item) => !item.id)
    .map((item) => ({
      user_id: userId,
      date,
      win_details: item.win_details.trim(),
      concept_used: item.concept_used.trim(),
    }));

  if (newItemsToInsert.length > 0) {
    const { error: insertErr } = await supabaseAdmin
      .from("daily_wins")
      .insert(newItemsToInsert);

    if (insertErr) {
      throw insertErr;
    }
  }

  // 5. Return latest refreshed entries for this date
  const { data: updatedDayEntries, error: refreshErr } = await supabaseAdmin
    .from("daily_wins")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (refreshErr) {
    throw refreshErr;
  }

  return (updatedDayEntries || []) as WinEntry[];
}

/**
 * Delete a single win entry by ID for the authorized user.
 */
export async function deleteWinEntryServer(
  userId: string,
  entryId: string,
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("daily_wins")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return true;
}
