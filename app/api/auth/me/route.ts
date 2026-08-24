import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    return NextResponse.json(user.profile, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
