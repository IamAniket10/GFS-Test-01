import { NextResponse } from "next/server";
import {
  requireAuth,
  requireAdminOrFeature,
  hasWriteAccess,
} from "@/lib/server/auth";
import { getHomeworkServer, createHomeworkServer } from "@/lib/server/homework";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("course_id") || undefined;

    const homework = await getHomeworkServer(
      user.id,
      user.profile.role,
      courseId,
    );
    return NextResponse.json(homework, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch homework" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminOrFeature("homework");

    if (!hasWriteAccess(user.id, "homework")) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to create homework.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const homework = await createHomeworkServer(body);
    return NextResponse.json(homework, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to create homework" },
      { status: 500 },
    );
  }
}
