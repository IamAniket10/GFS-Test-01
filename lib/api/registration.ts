import {
    CreateRegistrationInput,
    Registration,
    UpdateRegistrationInput,
} from "@/types";

export async function createRegistration(
    data: CreateRegistrationInput,
): Promise<{ message: string; registration: Registration }> {
    const res = await fetch("/api/registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            responseData.error || "Failed to submit registration",
        );
    }

    return responseData;
}

export async function getAllRegistrations(): Promise<Registration[]> {
    const res = await fetch("/api/registration", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch registrations");
    }

    return data;
}

export async function getRegistrationById(id: string): Promise<Registration> {
    const res = await fetch(`/api/registration/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch registration");
    }

    return data;
}

export async function updateRegistration(
    id: string,
    data: UpdateRegistrationInput,
): Promise<Registration> {
    const res = await fetch(`/api/registration/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(responseData.error || "Failed to update registration");
    }

    return responseData;
}

export async function deleteRegistration(id: string): Promise<boolean> {
    const res = await fetch(`/api/registration/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(responseData.error || "Failed to delete registration");
    }

    return true;
}