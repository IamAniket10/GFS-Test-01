"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    // Refresh layout state & redirect to dashboard on successful login
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your credentials to access your CoachTrack account
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@coachtrack.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 rounded-xl text-xs border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 rounded-xl text-xs border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950/50"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              Sign In
              <LogIn className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-2 text-center border-t border-slate-200/80 dark:border-slate-800/80">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-0.5"
          >
            Sign up
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
