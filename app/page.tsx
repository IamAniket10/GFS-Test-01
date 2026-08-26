import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationWidget from "./components/registration/RegistrationWidget";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-500/5" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl dark:bg-indigo-600/5" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              CoachTrack
            </span>
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            Coaching & Management Portal
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
            Manage courses and track student homework{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            CoachTrack provides administrators and sub-admins with fine-grained
            permission controls, while giving students a simple view of their
            assigned coursework.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              asChild
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Link href="/signup">
                Create Student Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-xs font-semibold"
            >
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Course Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Organize course materials, track total sessions, filter by active
              status, and update curricula in real-time.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Role-Based Access
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tiered permissions for Admins, Sub-admins with feature flags, and
              Students ensuring maximum data security.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Secure Homework
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Students see only their assigned homework tasks with submission
              tracking and strict server-side boundary checks.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} CoachTrack. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Sign In
            </Link>
            <span>•</span>
            <Link
              href="/signup"
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Registration Widget */}
      <RegistrationWidget />
    </div>
  );
}





































































































































// import Link from "next/link";
// import {
//   GraduationCap,
//   ArrowRight,
//   ShieldCheck,
//   BookOpen,
//   Lock,
//   Sparkles,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
//       {/* Background Decorative Gradients */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-500/5" />
//         <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl dark:bg-indigo-600/5" />
//       </div>

//       {/* HEADER NAVBAR */}
//       <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
//               <GraduationCap className="h-5 w-5" />
//             </div>
//             <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
//               CoachTrack
//             </span>
//           </div>

//           {/* Navigation CTAs */}
//           <div className="flex items-center gap-3">
//             <Button
//               asChild
//               variant="ghost"
//               className="h-9 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
//             >
//               <Link href="/login">Sign In</Link>
//             </Button>
//             <Button
//               asChild
//               className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
//             >
//               <Link href="/signup">Get Started</Link>
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* HERO SECTION */}
//       <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-16">
//         <div className="text-center space-y-6 max-w-3xl mx-auto">
//           {/* Badge */}
//           <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-400">
//             <Sparkles className="h-3.5 w-3.5" />
//             Coaching & Management Portal
//           </div>

//           {/* Main Title */}
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
//             Manage courses and track student homework{" "}
//             <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">
//               effortlessly
//             </span>
//           </h1>

//           {/* Subtitle */}
//           <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
//             CoachTrack provides administrators and sub-admins with fine-grained
//             permission controls, while giving students a simple view of their
//             assigned coursework.
//           </p>

//           {/* Call to Actions */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
//             <Button
//               asChild
//               className="w-full sm:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
//             >
//               <Link href="/signup">
//                 Create Student Account
//                 <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
//               </Link>
//             </Button>
//             <Button
//               asChild
//               variant="outline"
//               className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-xs font-semibold"
//             >
//               <Link href="/login">Sign In to Dashboard</Link>
//             </Button>
//           </div>
//         </div>

//         {/* FEATURE CARDS GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
//           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
//               <BookOpen className="h-5 w-5" />
//             </div>
//             <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
//               Course Management
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//               Organize course materials, track total sessions, filter by active
//               status, and update curricula in real-time.
//             </p>
//           </div>

//           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
//               <ShieldCheck className="h-5 w-5" />
//             </div>
//             <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
//               Role-Based Access
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//               Tiered permissions for Admins, Sub-admins with feature flags, and
//               Students ensuring maximum data security.
//             </p>
//           </div>

//           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
//               <Lock className="h-5 w-5" />
//             </div>
//             <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
//               Secure Homework
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//               Students see only their assigned homework tasks with submission
//               tracking and strict server-side boundary checks.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-6">
//         <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
//           <p>© {new Date().getFullYear()} CoachTrack. All rights reserved.</p>
//           <div className="flex items-center gap-4">
//             <Link
//               href="/login"
//               className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
//             >
//               Sign In
//             </Link>
//             <span>•</span>
//             <Link
//               href="/signup"
//               className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
