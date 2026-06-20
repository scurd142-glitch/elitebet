"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/lib/auth-storage";
import type { PublicUser } from "@/types/user";

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  login: (
    identifier: string,
    password: string,
    remember?: boolean
  ) => Promise<string | null>;
  register: (data: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    referralCode?: string;
  }) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const res = await api.me();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    } else {
      clearAuthToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (identifier: string, password: string, remember = false) => {
      const res = await api.login({ identifier, password, remember });
      if (!res.success || !res.data) {
        return res.message ?? "Login failed";
      }
      setAuthToken(res.data.token, remember);
      setUser(res.data.user);
      const dest =
        res.data.user.role === "ADMIN"
          ? "/admin"
          : res.data.user.accountStatus === "ACTIVE"
            ? "/dashboard"
            : "/activate";
      router.push(dest);
      return null;
    },
    [router]
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone?: string;
      country?: string;
      password: string;
      referralCode?: string;
    }) => {
      const res = await api.register(data);
      if (!res.success || !res.data) {
        return res.message ?? "Registration failed";
      }
      setAuthToken(res.data.token, false);
      setUser(res.data.user);
      const dest =
        res.data.user.role === "ADMIN"
          ? "/admin"
          : res.data.user.accountStatus === "ACTIVE"
            ? "/dashboard"
            : "/activate";
      router.push(dest);
      return null;
    },
    [router]
  );

  const logout = useCallback(async () => {
    await api.logout();
    clearAuthToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
