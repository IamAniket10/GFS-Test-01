import { z } from "zod";

export const registrationSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name is too long"),

    email: z
        .email("Please enter a valid email address")
        .trim(),

    phone: z
        .string()
        .trim()
        .min(7, "Please enter a valid phone number")
        .max(20, "Please enter a valid phone number"),

    course: z
        .string()
        .trim()
        .min(1, "Course is required")
        .max(100, "Course name is too long"),

    message: z
        .string()
        .trim()
        .max(1000, "Message is too long")
        .optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;