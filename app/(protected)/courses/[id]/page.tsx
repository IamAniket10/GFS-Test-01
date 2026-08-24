import { Metadata } from "next";
import { getCourseByIdServer } from "@/lib/server/courses";
import HomeworkList from "../../../components/HomeworkList";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Course Details | CoachTrack",
  description: "View course details and homework assignments",
};

interface CourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsProps) {
  // 1. Unwrap params Promise in Next.js 15
  const { id } = await params;

  // 2. Fetch course details directly on server
  let course = null;
  try {
    course = await getCourseByIdServer(id);
  } catch (error) {
    // Falls back gracefully if course doesn't exist
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Course Details Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            Course Track
          </span>
          <span className="text-xs font-mono text-slate-400">ID: {id}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {course?.title || `Course Details`}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {course?.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Homework List Component */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <HomeworkList courseId={id} />
      </div>
    </div>
  );
}
