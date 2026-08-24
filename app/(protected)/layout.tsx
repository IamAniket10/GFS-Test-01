"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShieldAlert,
  LogOut,
  GraduationCap,
  Sparkles,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { AuthProvider, useAuth } from "@/context/authContext";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldAlert,
    adminOnly: true,
  },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </AuthProvider>
  );
}

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { canAccessAdmin, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "User");
      }
    }

    fetchUser();
  }, []);

  const getPageTitle = () => {
    const segment = pathname.split("/")[1];

    if (!segment) return "Dashboard";

    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  };

  const getUserInitials = (email: string | null) => {
    if (!email) return "CT";

    return email.substring(0, 2).toUpperCase();
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            // Admin navigation is only visible to users
            // who have administrative access.
            if (item.adminOnly && !canAccessAdmin) {
              return null;
            }

            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />

                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs">
            {getUserInitials(userEmail)}
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
              {userEmail ? userEmail.split("@")[0] : "Active User"}
            </p>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
              {userEmail || "loading..."}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start gap-2.5 text-xs font-semibold rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="p-5 px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>

              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                CoachTrack
              </span>
            </div>
          </div>

          <SidebarContent />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-72 p-0 flex flex-col">
                  <SheetHeader className="p-5 px-6 border-b border-slate-200/80 dark:border-slate-800/80 text-left">
                    <SheetTitle className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                        <GraduationCap className="h-5 w-5" />
                      </div>

                      <span className="font-bold text-lg tracking-tight">
                        CoachTrack
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" />
              Day 5 RBAC & Permissions
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
