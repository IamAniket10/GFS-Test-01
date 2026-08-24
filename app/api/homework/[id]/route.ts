import { NextResponse } from "next/server";
import {
  requireAuth,
  requireAdminOrFeature,
  hasWriteAccess,
} from "@/lib/server/auth";
import {
  getHomeworkByIdServer,
  updateHomeworkServer,
  deleteHomeworkServer,
} from "@/lib/server/homework";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    console.log("1");
    const { id } = await params;
    const user = await requireAuth();
    const homework = await getHomeworkByIdServer(
      id,
      user.id,
      user.profile.role,
    );

    return NextResponse.json(homework, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Homework task not found" },
      { status: 404 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminOrFeature("homework");

    const canWrite = await hasWriteAccess(user.id, "homework");

    if (!canWrite) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to update homework.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const homework = await updateHomeworkServer(id, {
      title: body.title,
      due_date: body.due_date,
      status: body.status,
    });

    return NextResponse.json(homework, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to update homework" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminOrFeature("homework");

    const canWrite = await hasWriteAccess(user.id, "homework");

    if (!canWrite) {
      return NextResponse.json(
        {
          error:
            "Read-only access — you do not have permission to delete homework.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;

    await deleteHomeworkServer(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to delete homework" },
      { status: 500 },
    );
  }
}
