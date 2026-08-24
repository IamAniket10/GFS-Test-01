"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, canWrite } = useAuth();
  const { courses, loading } = useCourses();

  // Dynamic metrics derived from live state
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.is_active).length;
  const isAdminOrSubAdmin =
    profile?.role === "admin" || profile?.role === "sub_admin";
  const hasCourseWriteAccess = canWrite("courses");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
                !
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Here is an overview of your active learning programs and system
                metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-400"
            >
              <TrendingUp className="h-3 w-3" />
              Role: {profile?.role || "Student"}
            </Badge>

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
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Total Courses Card */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="h-1 w-full bg-indigo-600" />
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Courses
            </CardTitle>
            <div className="p-2 rounded-xl bg-slate-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {loading ? "..." : totalCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {loading
                ? "Loading tracks..."
                : `${activeCourses} active learning tracks`}
            </p>
          </CardContent>
        </Card>

        {/* Role & Access Scope Card */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="h-1 w-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Scope
            </CardTitle>
            <div className="p-2 rounded-xl bg-slate-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 capitalize">
              {profile?.role || "Student"}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAdminOrSubAdmin
                ? "Administrative permissions enabled"
                : "Enrolled student account"}
            </p>
          </CardContent>
        </Card>

        {/* Homework Portal Card */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="h-1 w-full bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Homework Portal
            </CardTitle>
            <div className="p-2 rounded-xl bg-slate-50 text-amber-600 dark:bg-slate-800 dark:text-amber-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Active
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAdminOrSubAdmin
                ? "Manage student homework submissions"
                : "View and submit assigned homework"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Controls */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Quick Navigation
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Shortcuts to key features and management portals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-3 flex flex-wrap gap-3">
          <Button
            asChild
            className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all active:scale-[0.99]"
          >
            <Link href="/courses">
              <BookOpen className="h-3.5 w-3.5" />
              Manage Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          {/* Admin shortcut rendered strictly for admin/sub_admin roles */}
          {isAdminOrSubAdmin && (
            <Button
              variant="outline"
              asChild
              className="gap-2 rounded-xl border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900 font-semibold text-xs transition-all"
            >
              <Link href="/admin">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                Admin Portal
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
