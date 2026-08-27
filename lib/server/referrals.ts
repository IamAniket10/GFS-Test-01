import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  CreateReferralInput,
  Referral,
  ReferralAdminQueryParams,
  UpdateReferralStatusInput,
} from "@/types";

/**
 * Fetch all referrals submitted by a specific user (student).
 */
export async function getUserReferralsServer(userId: string): Promise<Referral[]> {
  const { data, error } = await supabaseAdmin
    .from("referrals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      console.warn(
        "Note: Table 'referrals' not found in Supabase schema cache (PGRST205). Please run the SQL script in Supabase SQL Editor.",
      );
      return [];
    }
    console.error("getUserReferralsServer error:", error);
    throw error;
  }

  return (data || []) as Referral[];
}

/**
 * Create a new client referral record tied to the authenticated user.
 */
export async function createReferralServer(
  userId: string,
  payload: CreateReferralInput,
): Promise<Referral> {
  const { data, error } = await supabaseAdmin
    .from("referrals")
    .insert([
      {
        user_id: userId,
        client_name: payload.client_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone || null,
        service_interest: payload.service_interest,
        urgency_level: payload.urgency_level,
        referral_reason: payload.referral_reason || null,
        status: "Pending",
        admin_notes: null,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST205") {
      throw new Error(
        "The 'referrals' table has not been created in Supabase yet. Please run the migration script (supabase/migrations/referrals_setup.sql) in your Supabase SQL Editor.",
      );
    }
    console.error("createReferralServer error:", error);
    throw error;
  }

  return data as Referral;
}


/**
 * Admin operation: Search, filter, and dynamically sort referrals using Supabase RPC.
 * Falls back to direct query with profile joins if RPC has not yet been executed in Supabase.
 */
export async function searchAndSortReferralsServer(
  params: ReferralAdminQueryParams,
): Promise<Referral[]> {
  const searchQuery = params.search_query?.trim() || "";
  const statusFilter =
    params.status_filter === "All" || !params.status_filter
      ? ""
      : params.status_filter;
  const sortBy = params.sort_by || "created_at";
  const sortOrder = (params.sort_order || "DESC").toUpperCase() as "ASC" | "DESC";

  try {
    // 1. Primary path: Attempt to call the PostgreSQL RPC function
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
      "search_and_sort_referrals",
      {
        search_query: searchQuery,
        status_filter: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    );

    if (!rpcError && rpcData) {
      return rpcData as Referral[];
    }

    if (rpcError) {
      console.warn("RPC function search_and_sort_referrals notice:", rpcError.message);
    }
  } catch (err) {
    console.warn("RPC execution error, falling back to server query:", err);
  }

  // 2. Fallback path (direct Supabase query with profiles join)
  let query = supabaseAdmin.from("referrals").select(`
      *,
      profiles:user_id (
        id,
        full_name
      )
    `);

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  if (searchQuery) {
    query = query.or(
      `client_name.ilike.%${searchQuery}%,client_email.ilike.%${searchQuery}%,service_interest.ilike.%${searchQuery}%`,
    );
  }

  const isAscending = sortOrder === "ASC";
  if (sortBy === "client_name") {
    query = query.order("client_name", { ascending: isAscending });
  } else if (sortBy === "status") {
    query = query.order("status", { ascending: isAscending });
  } else if (sortBy === "urgency_level") {
    query = query.order("urgency_level", { ascending: isAscending });
  } else {
    query = query.order("created_at", { ascending: isAscending });
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === "PGRST205") {
      console.warn(
        "Note: Table 'referrals' not found in Supabase schema cache (PGRST205).",
      );
      return [];
    }
    console.error("Fallback query error:", error);
    throw error;
  }


  return (data || []).map((row: any) => ({
    ...row,
    referrer_id: row.profiles?.id || null,
    referrer_name: row.profiles?.full_name || null,
  })) as Referral[];
}

/**
 * Admin operation: Update referral status and internal notes.
 */
export async function updateReferralStatusServer(
  id: string,
  payload: UpdateReferralStatusInput,
): Promise<Referral> {
  const updateData: Record<string, any> = {
    status: payload.status,
  };

  if (payload.admin_notes !== undefined) {
    updateData.admin_notes = payload.admin_notes || null;
  }

  const { data, error } = await supabaseAdmin
    .from("referrals")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateReferralStatusServer error:", error);
    throw error;
  }

  return data as Referral;
}

/**
 * Admin operation: Permanently delete a referral record.
 */
export async function deleteReferralServer(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("referrals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteReferralServer error:", error);
    throw error;
  }

  return true;
}
