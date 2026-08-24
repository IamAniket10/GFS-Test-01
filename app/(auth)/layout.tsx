import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Background Subtle Accent Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-500/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl dark:bg-indigo-600/5" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-600/10">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            CoachTrack
          </span>
        </div>

        {/* Auth Card Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {children}
        </div>

        {/* Subtle Footer Note */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Protected Coaching & Management Portal
        </p>
      </div>
    </div>
  );
}

