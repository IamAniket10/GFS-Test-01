"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or browser console
    console.error("Courses Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 text-center shadow-lg rounded-2xl overflow-hidden">
        {/* Visual Rose Header Accent */}
        <div className="h-1.5 w-full bg-rose-500" />

        <CardHeader className="p-6 pb-3 items-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-950/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Something went wrong!
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Failed to load courses data. An unexpected runtime error occurred
            while executing this segment.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 space-y-2">
          {error.message && (
            <div className="rounded-xl border border-rose-200/60 bg-rose-50/40 p-3 font-mono text-[11px] text-rose-700 dark:border-rose-950 dark:bg-rose-950/30 dark:text-rose-300 text-left overflow-x-auto">
              {error.message}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-center p-6 pt-3">
          {/* reset() tells Next.js to try re-rendering the segment */}
          <Button
            onClick={() => reset()}
            className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all active:scale-[0.99]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
