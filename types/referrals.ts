export type ServiceInterest =
  | "1-on-1 Coaching Track"
  | "Course Subscription"
  | "Enterprise Support";

export type UrgencyLevel = "Low" | "Medium" | "High";

export type ReferralStatus = "Pending" | "In Review" | "Accepted" | "Rejected";

export interface Referral {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_interest: ServiceInterest;
  urgency_level: UrgencyLevel;
  referral_reason: string | null;
  status: ReferralStatus;
  admin_notes: string | null;
  created_at: string;
  referrer_id?: string | null;
  referrer_name?: string | null;
}

export interface CreateReferralInput {
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  service_interest: ServiceInterest;
  urgency_level: UrgencyLevel;
  referral_reason?: string | null;
}

export interface UpdateReferralStatusInput {
  status: ReferralStatus;
  admin_notes?: string | null;
}

export interface ReferralAdminQueryParams {
  search_query?: string;
  status_filter?: string;
  sort_by?: "client_name" | "status" | "created_at" | "urgency_level";
  sort_order?: "ASC" | "DESC";
}
