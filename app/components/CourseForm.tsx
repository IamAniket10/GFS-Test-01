"use client";

import { useState } from "react";
import { Course } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Layers,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  addCourse: (course: Course) => void;
}

export function CourseForm({ addCourse }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalSessions, setTotalSessions] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    totalSessions: "",
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      title: "",
      description: "",
      totalSessions: "",
    };

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const sessions = Number(totalSessions);

    if (!trimmedTitle) {
      newErrors.title = "Course title is required";
    }

    if (!trimmedDescription) {
      newErrors.description = "Course description is required";
    }

    if (!totalSessions) {
      newErrors.totalSessions = "Total sessions is required";
    } else if (Number.isNaN(sessions) || sessions <= 0) {
      newErrors.totalSessions = "Sessions must be greater than 0";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.description || newErrors.totalSessions) {
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: trimmedDescription,
      total_sessions: sessions,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Submits course to parent (which also handles closing the dialog)
    addCourse(newCourse);

    // Reset local state
    setTitle("");
    setDescription("");
    setTotalSessions("");
    setErrors({ title: "", description: "", totalSessions: "" });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900">
      {/* Header inside the modal */}
      <div className="border-b border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Create New Course</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide course info to publish a new learning track.
            </p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleFormSubmit} className="space-y-4 p-5">
        {/* Title Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="title"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
            Course Title
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
            placeholder="e.g. Advanced TypeScript Patterns"
            className={cn(
              "text-xs rounded-xl border-slate-200/80 transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800",
              errors.title &&
                "border-rose-500 bg-rose-50/20 focus-visible:ring-rose-500/20 dark:bg-rose-950/20",
            )}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 pt-0.5 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-500" />
            Description
          </Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            placeholder="Describe course objectives and prerequisites..."
            className={cn(
              "resize-none text-xs rounded-xl border-slate-200/80 transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800",
              errors.description &&
                "border-rose-500 bg-rose-50/20 focus-visible:ring-rose-500/20 dark:bg-rose-950/20",
            )}
          />
          {errors.description && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 pt-0.5 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Total Sessions Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="total_sessions"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            Total Sessions
          </Label>
          <Input
            id="total_sessions"
            type="number"
            min="1"
            value={totalSessions}
            onChange={(e) => {
              setTotalSessions(e.target.value);
              if (errors.totalSessions) {
                setErrors((prev) => ({ ...prev, totalSessions: "" }));
              }
            }}
            placeholder="e.g. 12"
            className={cn(
              "text-xs rounded-xl border-slate-200/80 transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800",
              errors.totalSessions &&
                "border-rose-500 bg-rose-50/20 focus-visible:ring-rose-500/20 dark:bg-rose-950/20",
            )}
          />
          {errors.totalSessions && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 pt-0.5 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.totalSessions}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            Save & Publish Course
          </Button>
        </div>
      </form>
    </div>
  );
}
