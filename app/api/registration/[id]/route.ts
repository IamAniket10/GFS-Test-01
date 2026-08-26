import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
    deleteRegistrationServer,
    getRegistrationByIdServer,
    updateRegistrationServer,
} from "@/lib/server/registration";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();

        if (user.profile.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Only admins can view registrations." },
                { status: 403 },
            );
        }

        const { id } = await params;
        const registration = await getRegistrationByIdServer(id);

        if (!registration) {
            return NextResponse.json(
                { error: "Registration not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(registration, { status: 200 });
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { error: err?.message || "Failed to fetch registration" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();

        if (user.profile.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Only admins can update registrations." },
                { status: 403 },
            );
        }

        const { id } = await params;
        const body = await request.json();

        const updated = await updateRegistrationServer(id, body);

        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { error: err?.message || "Failed to update registration" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();

        if (user.profile.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Only admins can delete registrations." },
                { status: 403 },
            );
        }

        const { id } = await params;
        await deleteRegistrationServer(id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { error: err?.message || "Failed to delete registration" },
            { status: 500 },
        );
    }
}
