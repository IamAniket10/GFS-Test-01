import {
  CreateReferralInput,
  Referral,
  ReferralAdminQueryParams,
  UpdateReferralStatusInput,
} from "@/types";

/**
 * Fetch all referrals created by current user.
 */
export async function fetchMyReferrals(): Promise<Referral[]> {
  const res = await fetch("/api/referrals", {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch referrals");
  }

  return res.json();
}

/**
 * Submit a new client referral.
 */
export async function createReferral(data: CreateReferralInput): Promise<{ message: string; referral: Referral }> {
  const res = await fetch("/api/referrals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit referral");
  }

  return res.json();
}

/**
 * Admin: Search, filter, and sort referrals via backend API / RPC.
 */
export async function fetchAdminReferrals(
  params: ReferralAdminQueryParams = {},
): Promise<Referral[]> {
  const queryParams = new URLSearchParams();
  if (params.search_query) queryParams.set("search_query", params.search_query);
  if (params.status_filter && params.status_filter !== "All") {
    queryParams.set("status_filter", params.status_filter);
  }
  if (params.sort_by) queryParams.set("sort_by", params.sort_by);
  if (params.sort_order) queryParams.set("sort_order", params.sort_order);

  const url = `/api/referrals/admin${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
  });
  console.log("response", res);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch admin referrals");
  }

  return res.json();
}

/**
 * Admin: Update referral status and internal notes.
 */
export async function updateReferralStatus(
  id: string,
  data: UpdateReferralStatusInput,
): Promise<Referral> {
  const res = await fetch(`/api/referrals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update referral");
  }

  return res.json();
}

/**
 * Admin: Delete a referral record.
 */
export async function deleteReferral(id: string): Promise<boolean> {
  const res = await fetch(`/api/referrals/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete referral");
  }

  return true;
}
