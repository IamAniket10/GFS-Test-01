"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  isAdmin: boolean;
  canAccessAdmin: boolean;
  canWrite: (feature: "courses" | "homework") => boolean;
  hasAccess: (feature: "courses" | "homework") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    await refreshUser();
  };

  const logout = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const canWrite = (feature: "courses" | "homework") => {
    if (!user) return false;

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "sub_admin") {
      const featureAccess = user.admin_features?.find(
        (item) => item.feature === feature,
      );

      return featureAccess?.access === "full";
    }

    return false;
  };

  const hasAccess = (feature: "courses" | "homework") => {
    if (!user) return false;

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "sub_admin") {
      const featureAccess = user.admin_features?.find(
        (item) => item.feature === feature,
      );

      return featureAccess?.access !== "none";
    }

    // Students can access the feature.
    // Server-side authorization determines what data they receive.
    return user.role === "student";
  };

  const isAdmin = user?.role === "admin";

  const canAccessAdmin =
    user?.role === "admin" ||
    (user?.role === "sub_admin" &&
      (hasAccess("courses") || hasAccess("homework")));

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
        isAdmin,
        canAccessAdmin,
        canWrite,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
