import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
  getNoteByIdServer,
  updateNoteServer,
  deleteNoteServer,
} from "@/lib/server/notes";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const note = await getNoteByIdServer(id, user.id);

    return NextResponse.json(note, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const body = await request.json();

    const { title, content, link } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          error: "Title and content are required",
        },
        { status: 400 },
      );
    }

    const note = await updateNoteServer(id, user.id, {
      title,
      content,
      link,
    });

    return NextResponse.json(note, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await deleteNoteServer(id, user.id);

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 },
    );
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
