import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
  createReferralServer,
  getUserReferralsServer,
} from "@/lib/server/referrals";
import { createReferralSchema } from "@/lib/validations/referrals";

export async function GET() {
  try {
    const user = await requireAuth();
    const referrals = await getUserReferralsServer(user.id);
    return NextResponse.json(referrals, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to fetch referrals" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const result = createReferralSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message || "Invalid referral form data",
        },
        { status: 400 },
      );
    }

    const referral = await createReferralServer(user.id, result.data);

    return NextResponse.json(
      {
        message: "Referral submitted successfully!",
        referral,
      },
      { status: 201 },
    );
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to submit referral" },
      { status: 500 },
    );
  }
}
