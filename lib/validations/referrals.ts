import { z } from "zod";

export const referralStage1Schema = z.object({
  client_name: z
    .string()
    .trim()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name must be under 100 characters"),
  client_email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  client_phone: z
    .string()
    .trim()
    .max(25, "Phone number cannot exceed 25 characters")
    .optional()
    .or(z.literal("")),
});

export const referralStage2Schema = z.object({
  service_interest: z.enum([
    "1-on-1 Coaching Track",
    "Course Subscription",
    "Enterprise Support",
  ]),
  urgency_level: z.enum(["Low", "Medium", "High"]),
  referral_reason: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export const createReferralSchema = referralStage1Schema.merge(referralStage2Schema);

export const updateReferralStatusSchema = z.object({
  status: z.enum(["Pending", "In Review", "Accepted", "Rejected"]),
  admin_notes: z
    .string()
    .trim()
    .max(2000, "Admin notes cannot exceed 2000 characters")
    .optional()
    .or(z.literal(""))
    .nullable(),
});


export type ReferralStage1Values = z.infer<typeof referralStage1Schema>;
export type ReferralStage2Values = z.infer<typeof referralStage2Schema>;
export type CreateReferralFormValues = z.infer<typeof createReferralSchema>;
export type UpdateReferralStatusFormValues = z.infer<typeof updateReferralStatusSchema>;
