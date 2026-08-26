import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import {
    createRegistrationServer,
    getAllRegistrationsServer,
} from "@/lib/server/registration";
import { registrationSchema } from "@/lib/validations/registration";

export async function GET() {
    try {
        const user = await requireAuth();

        if (user.profile.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Only admins can view registrations." },
                { status: 403 },
            );
        }

        const registrations = await getAllRegistrationsServer();
        return NextResponse.json(registrations, { status: 200 });
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { error: err?.message || "Failed to fetch registrations" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = registrationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0]?.message || "Invalid form data",
                },
                { status: 400 },
            );
        }

        const registration = await createRegistrationServer(result.data);

        return NextResponse.json(
            {
                message:
                    "Registration submitted successfully. Our team will contact you shortly.",
                registration,
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        const errorMessage =
            error?.message ||
            (typeof error === "string" ? error : "Failed to submit registration");

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 },
        );
    }
}