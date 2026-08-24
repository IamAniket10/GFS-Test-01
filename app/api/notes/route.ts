import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { getNotesServer, createNoteServer } from "@/lib/server/notes";

export async function GET() {
  try {
    const user = await requireAuth();

    const notes = await getNotesServer(user.id);

    return NextResponse.json(notes, { status: 200 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

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

    const note = await createNoteServer(user.id, {
      title,
      content,
      link,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
