import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateRegistrationInput, Registration, UpdateRegistrationInput } from "@/types";

export async function getAllRegistrationsServer(): Promise<Registration[]> {
    const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return (data || []) as Registration[];
}

export async function getRegistrationByIdServer(id: string): Promise<Registration> {
    const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data as Registration;
}

export async function createRegistrationServer(payload: CreateRegistrationInput): Promise<Registration> {
    const { data, error } = await supabaseAdmin
        .from("registrations")
        .insert([
            {
                full_name: payload.full_name,
                email: payload.email,
                phone: payload.phone,
                course: payload.course,
                message: payload.message || null,
            },
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Registration;
}

export async function updateRegistrationServer(
    id: string,
    payload: UpdateRegistrationInput,
): Promise<Registration> {
    const updateData: Record<string, any> = {};

    if (payload.full_name !== undefined) updateData.full_name = payload.full_name;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (payload.course !== undefined) updateData.course = payload.course;
    if (payload.message !== undefined) updateData.message = payload.message || null;

    const { data, error } = await supabaseAdmin
        .from("registrations")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Registration;
}

export async function deleteRegistrationServer(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
        .from("registrations")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }

    return true;
}