import { NextResponse } from "next/server";
import {
  requireAuth,
  requireAdminOrFeature,
  hasWriteAccess,
} from "@/lib/server/auth";
import { getAllCoursesServer, createCourseServer } from "@/lib/server/courses";

export async function GET() {
  try {
    await requireAuth();
    const courses = await getAllCoursesServer();
    return NextResponse.json(courses, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminOrFeature("courses");
    const canWrite = await hasWriteAccess(user.id, "courses");

    if (!canWrite) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to create courses.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    if (
      !body.title ||
      typeof body.total_sessions !== "number" ||
      body.total_sessions <= 0
    ) {
      return NextResponse.json(
        { error: "Title and positive session count required" },
        { status: 400 },
      );
    }

    const course = await createCourseServer({
      title: body.title,
      description: body.description || "",
      total_sessions: body.total_sessions,
    });

    return NextResponse.json(course, { status: 201 });
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
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
