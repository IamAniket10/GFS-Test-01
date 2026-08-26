"use client";

import { useState } from "react";
import { createRegistration } from "@/lib/api/registration";
import { registrationSchema } from "@/lib/validations/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function RegistrationForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof typeof form, string>>
    >({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove the error for this field as the user starts correcting it.
        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
        setGeneralError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({});
        setGeneralError(null);
        setSuccess(false);

        const result = registrationSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Partial<
                Record<keyof typeof form, string>
            > = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof typeof form;

                if (field && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setSubmitting(true);

        try {
            await createRegistration(result.data);

            setSuccess(true);

            setForm({
                full_name: "",
                email: "",
                phone: "",
                course: "",
                message: "",
            });

            onSuccess?.();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to submit registration";

            setGeneralError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12.5 9.5 17 19 7.5"
                        />
                    </svg>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Registration submitted!
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Thank you for reaching out. Our team will review your details and
                    contact you shortly.
                </p>

                <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSuccess(false)}
                >
                    Submit another response
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                    {generalError}
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
                <label
                    htmlFor="registration-full-name"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    Full Name <span className="text-red-500">*</span>
                </label>

                <Input
                    id="registration-full-name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={submitting}
                />

                {errors.full_name && (
                    <p className="text-xs text-red-500">{errors.full_name}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <label
                    htmlFor="registration-email"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    Email <span className="text-red-500">*</span>
                </label>

                <Input
                    id="registration-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={submitting}
                />

                {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
                <label
                    htmlFor="registration-phone"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    Phone Number <span className="text-red-500">*</span>
                </label>

                <Input
                    id="registration-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    disabled={submitting}
                />

                {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                )}
            </div>

            {/* Course */}
            <div className="space-y-1.5">
                <label
                    htmlFor="registration-course"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    Course / Program <span className="text-red-500">*</span>
                </label>

                <Input
                    id="registration-course"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="Enter course or program"
                    disabled={submitting}
                />

                {errors.course && (
                    <p className="text-xs text-red-500">{errors.course}</p>
                )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
                <label
                    htmlFor="registration-message"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    Message <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <Textarea
                    id="registration-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you would like to know..."
                    rows={4}
                    disabled={submitting}
                />

                {errors.message && (
                    <p className="text-xs text-red-500">{errors.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
                {submitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Registration"
                )}
            </Button>

            <p className="text-center text-[11px] leading-5 text-slate-400">
                Our team will contact you after reviewing your submission.
            </p>
        </form>
    );
}