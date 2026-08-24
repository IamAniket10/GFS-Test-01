import { NextResponse } from "next/server";
import {
  requireAuth,
  requireAdminOrFeature,
  hasWriteAccess,
} from "@/lib/server/auth";
import { getCourseByIdServer, deleteCourseServer } from "@/lib/server/courses";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const course = await getCourseByIdServer(id);
    return NextResponse.json(course, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminOrFeature("courses");

    if (!hasWriteAccess(user.id, "courses")) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to update courses.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("courses")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
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
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminOrFeature("courses");

    if (!hasWriteAccess(user.id, "courses")) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to delete courses.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    await deleteCourseServer(id);
    return NextResponse.json({ success: true }, { status: 200 });
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
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
