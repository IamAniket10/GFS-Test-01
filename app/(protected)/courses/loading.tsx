import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Loading Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3.5">
          <Skeleton className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-3.5 w-64 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-xl bg-indigo-200/50 dark:bg-indigo-950/50" />
      </div>

      {/* Filter Bar & Count Skeleton */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <Skeleton className="h-9 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800" />
          <Skeleton className="h-9 w-full sm:w-[170px] rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/50">
          <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Grid of Course Cards Skeletons */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              {/* Top Accent Strip Skeleton */}
              <Skeleton className="h-1 w-full bg-slate-200 dark:bg-slate-800" />

              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/60" />
                  <Skeleton className="h-3.5 w-4/5 bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </CardHeader>

              <CardContent className="px-5 py-2">
                <div className="grid grid-cols-2 gap-2.5">
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800/50" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800/50" />
                </div>
              </CardContent>
            </div>

            <CardFooter className="gap-2 p-4 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
              <Skeleton className="h-8 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-8 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
