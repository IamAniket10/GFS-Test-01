import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
  deleteReferralServer,
  updateReferralStatusServer,
} from "@/lib/server/referrals";
import { updateReferralStatusSchema } from "@/lib/validations/referrals";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const user = await requireAuth();

    if (user.profile.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can update referrals." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const result = updateReferralStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message || "Invalid update data",
        },
        { status: 400 },
      );
    }

    const updated = await updateReferralStatusServer(params.id, result.data);

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to update referral" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const user = await requireAuth();

    if (user.profile.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can delete referrals." },
        { status: 403 },
      );
    }

    await deleteReferralServer(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to delete referral" },
      { status: 500 },
    );
  }
}
