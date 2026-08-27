"use client";

import { useState, useEffect, useCallback } from "react";
import { Referral, ReferralStatus, UrgencyLevel } from "@/types";
import {
  deleteReferral,
  fetchAdminReferrals,
  updateReferralStatus,
} from "@/lib/api/referrals";

export type SortColumn = "client_name" | "status" | "created_at" | "urgency_level";
export type SortOrder = "ASC" | "DESC";

export function useAdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortColumn>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminReferrals({
        search_query: searchQuery,
        status_filter: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setReferrals(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    // Debounce search/filter/sort calls slightly for smooth UI
    const timer = setTimeout(() => {
      loadData();
    }, 200);

    return () => clearTimeout(timer);
  }, [loadData]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: ReferralStatus,
    adminNotes?: string | null,
  ) => {
    try {
      setActionLoading(true);
      const updated = await updateReferralStatus(id, {
        status: newStatus,
        admin_notes: adminNotes,
      });

      setReferrals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update status");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeReferral = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteReferral(id);
      setReferrals((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete referral");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    referrals,
    loading,
    actionLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    updateStatus,
    removeReferral,
    refresh: loadData,
  };
}
