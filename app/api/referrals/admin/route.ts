import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { searchAndSortReferralsServer } from "@/lib/server/referrals";
import { ReferralAdminQueryParams } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    if (user.profile.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const params: ReferralAdminQueryParams = {
      search_query: searchParams.get("search_query") || undefined,
      status_filter: searchParams.get("status_filter") || undefined,
      sort_by: (searchParams.get("sort_by") as any) || "created_at",
      sort_order: (searchParams.get("sort_order") as any) || "DESC",
    };

    const referrals = await searchAndSortReferralsServer(params);
    return NextResponse.json(referrals, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to search/sort referrals" },
      { status: 500 },
    );
  }
}
