"use client";

import Link from "next/link";
import { BookOpen, FileText, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/context/authContext";

export default function AdminPage() {
  const { user, canAccessAdmin, hasAccess } = useAuth();

  if (!canAccessAdmin) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <ShieldCheck className="mx-auto h-10 w-10 text-red-500 mb-4" />

          <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            You do not have permission to access the Admin Portal.
          </p>
        </div>
      </div>
    );
  }

  const canManageCourses = hasAccess("courses");
  const canManageHomework = hasAccess("homework");
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Admin Portal
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage courses, homework, and student registrations.
            </p>
          </div>
        </div>

        {user?.role && (
          <div className="mt-5">
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-400">
              {user.role.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      {/* Management cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {canManageCourses && (
          <Link
            href="/admin/courses"
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>

              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-slate-100">
              Course Management
            </h3>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              View, create, update, and manage training courses based on your
              course permissions.
            </p>
          </Link>
        )}

        {canManageHomework && (
          <Link
            href="/admin/homework"
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>

              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-slate-100">
              Homework Management
            </h3>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Assign and manage homework for students according to your homework
              permissions.
            </p>
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/admin/registrations"
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <UserCheck className="h-5 w-5" />
              </div>

              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Registrations
              </h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Admin Only
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Review, update, and manage student registration inquiries and lead details.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
