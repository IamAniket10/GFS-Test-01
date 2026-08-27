export type UserRole = "admin" | "sub_admin" | "student";

export interface AdminFeature {
  feature: "courses" | "homework";
  access: "readonly" | "full" | "none";
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  admin_features: AdminFeature[];
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  total_sessions: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  total_sessions: number;
}

export interface Homework {
  id: string;
  course_id: string;
  student_id: string;
  title: string;
  due_date: string;
  status: "pending" | "submitted" | "reviewed";
}

export interface WinEntry {
  id: string;
  user_id: string;
  date: string; // ISO date format "YYYY-MM-DD"
  win_details: string;
  concept_used: string;
  created_at?: string;
}

export interface WinItemInput {
  id?: string;
  win_details: string;
  concept_used: string;
}

export interface SaveDayWinsInput {
  date: string; // "YYYY-MM-DD"
  items: WinItemInput[];
}

export interface DayWinsGroup {
  date: string; // "YYYY-MM-DD"
  formattedDate: string; // e.g. "Sat, 22 Aug'26"
  isToday: boolean;
  entries: WinEntry[];
}

//-----Notes --------------

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  link: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  link?: string | null;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  link?: string | null;
}
