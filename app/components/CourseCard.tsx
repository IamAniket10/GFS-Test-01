"use client";

import { Course } from "@/types";
import { useMemo, useState } from "react";
import Link from "next/link";
import CourseFilters from "./CourseFilters";
import { useAuth } from "@/context/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Power,
  Calendar,
  Layers,
  SearchX,
  BookOpen,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "inactive";

interface CourseCardProps {
  courses: Course[];
  onUpdate?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

export default function CourseCard({
  courses,
  onUpdate,
  onDelete,
}: CourseCardProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const { canWrite } = useAuth();
  const hasCourseWriteAccess = canWrite("courses");

  const visibleCourses = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" ||
        (status === "active" && course.is_active) ||
        (status === "inactive" && !course.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, status]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      {courses.length > 0 && (
        <div className="space-y-3">
          <CourseFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
          {/* Visual Count Bar & Read-only Indicator */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>
                Showing{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  {visibleCourses.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  {courses.length}
                </strong>{" "}
                total tracks
              </span>
            </div>

            {!hasCourseWriteAccess && (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 dark:text-amber-400"
              >
                <Lock className="h-3 w-3" /> Read-only Mode
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Empty State: No Courses */}
      {courses.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 py-16 text-center bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/20">
          <CardHeader className="items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-950/20 mb-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No courses created yet
            </CardTitle>
            <CardDescription className="max-w-xs text-xs">
              {hasCourseWriteAccess
                ? 'Get started by clicking "Create Course" to add your first learning program.'
                : "There are currently no active course programs available."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : visibleCourses.length === 0 ? (
        /* Empty State: No Filter Results */
        <Card className="border-dashed border-2 border-slate-200 py-16 text-center bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/20">
          <CardHeader className="items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-8 ring-slate-100/50 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-800/30 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No courses found
            </CardTitle>
            <CardDescription className="max-w-xs text-xs">
              No courses match your current filter parameters. Try clearing your
              search input.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        /* Course Grid */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
            <Card
              key={course.id}
              className={cn(
                "flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 group border overflow-hidden rounded-2xl cursor-pointer",
                course.is_active
                  ? "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
                  : "border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-900/40 opacity-75",
              )}
            >
              <Link href={`/courses/${course.id}`} className="block flex-1">
                {/* Visual Accent Top Strip */}
                <div
                  className={cn(
                    "h-1 w-full transition-colors",
                    course.is_active
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700",
                  )}
                />

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </CardTitle>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full border",
                          course.is_active
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-400"
                            : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400",
                        )}
                      >
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <CardDescription className="line-clamp-2 min-h-[36px] pt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {course.description || "No course description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 py-2">
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                      <Layers className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          Sessions
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {course.total_sessions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          Created
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {new Date(course.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>

              {/* Actions Footer - Conditionally rendered for write permissions */}
              {hasCourseWriteAccess ? (
                <CardFooter className="gap-2 p-4 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate?.(course);
                    }}
                    className="flex-1 gap-1.5 text-xs font-semibold rounded-xl border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900 transition-all"
                  >
                    <Power className="h-3.5 w-3.5" />
                    {course.is_active ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(course.id);
                    }}
                    className="flex-1 gap-1.5 text-xs font-semibold rounded-xl border-slate-200/80 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:border-rose-900 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </CardFooter>
              ) : (
                <CardFooter className="p-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 justify-center">
                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> View only
                  </p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
