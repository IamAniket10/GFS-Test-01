"use client";

import { useState, useEffect, useCallback } from "react";
import { CreateReferralInput, Referral } from "@/types";
import { createReferral, fetchMyReferrals } from "@/lib/api/referrals";

export function useReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadReferrals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyReferrals();
      setReferrals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  const submitReferral = async (input: CreateReferralInput) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await createReferral(input);
      // Prepend newly created referral to the list
      setReferrals((prev) => [res.referral, ...prev]);
      return res.referral;
    } catch (err: any) {
      setError(err.message || "Failed to submit referral");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    referrals,
    loading,
    submitting,
    error,
    refreshReferrals: loadReferrals,
    submitReferral,
  };
}
