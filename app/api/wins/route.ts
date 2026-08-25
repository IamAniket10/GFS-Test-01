import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
  getWinsForUserServer,
  saveDayWinsServer,
  deleteWinEntryServer,
} from "@/lib/server/wins";
import { SaveDayWinsInput } from "@/types";

/**
 * GET /api/wins?month=YYYY-MM
 * Strictly retrieves wins for the authenticated user only (100% private to each user).
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || undefined;

    // Strictly fetch only the authenticated user's own data
    const wins = await getWinsForUserServer(user.id, month);
    return NextResponse.json(wins, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to fetch daily wins" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/wins
 * Strictly saves/updates wins for the authenticated user only.
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    if (!body || !body.date || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Invalid payload. 'date' and 'items' array are required." },
        { status: 400 },
      );
    }

    const payload: SaveDayWinsInput = {
      date: body.date,
      items: body.items,
    };

    // Strictly save only for the authenticated user
    const updatedEntries = await saveDayWinsServer(user.id, payload);
    return NextResponse.json(updatedEntries, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to save daily wins" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/wins?id=entry_id
 * Strictly deletes a win entry for the authenticated user only.
 */
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("id");

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    await deleteWinEntryServer(user.id, entryId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to delete win entry" },
      { status: 500 },
    );
  }
}
