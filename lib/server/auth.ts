import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export async function getUserServer() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    ...user,
    profile: profile as Profile,
  };
}

export async function requireAuth() {
  const user = await getUserServer();

  if (!user || !user.profile) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdminOrFeature(feature?: "courses" | "homework") {
  const user = await requireAuth();
  const { profile } = user;

  // Admin has access to everything.
  if (profile.role === "admin") {
    return user;
  }

  // Sub-admin must have the requested feature enabled.
  if (profile.role === "sub_admin" && feature) {
    const feat = profile.admin_features?.find((f) => f.feature === feature);

    if (feat && feat.access !== "none") {
      return user;
    }
  }

  throw new Error("FORBIDDEN");
}

export async function hasWriteAccess(
  userId: string,
  feature: "courses" | "homework",
): Promise<boolean> {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("role, admin_features")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return false;
  }

  // Admin can always write.
  if (profile.role === "admin") {
    return true;
  }

  // Sub-admin can write only when access is "full".
  if (profile.role === "sub_admin") {
    const feat = profile.admin_features?.find(
      (f: { feature: string; access: string }) => f.feature === feature,
    );

    return feat?.access === "full";
  }

  // Students cannot write.
  return false;
}
