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
  balance: number;
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
  refreshBalance: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const refreshBalance = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setBalance(0);
      return;
    }

    const res = await api.getWallet();
    if (res.success && res.data) {
      setBalance(Number(res.data.balance ?? 0));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setBalance(0);
      setLoading(false);
      return;
    }

    const res = await api.me();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      await refreshBalance();
    } else {
      clearAuthToken();
      setUser(null);
      setBalance(0);
    }
    setLoading(false);
  }, [refreshBalance]);

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
      await refreshBalance();
      const dest = res.data.user.role === "ADMIN" ? "/admin" : "/";
      router.push(dest);
      return null;
    },
    [router, refreshBalance]
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
      await refreshBalance();
      const dest = res.data.user.role === "ADMIN" ? "/admin" : "/";
      router.push(dest);
      return null;
    },
    [router, refreshBalance]
  );

  const logout = useCallback(async () => {
    await api.logout();
    clearAuthToken();
    setUser(null);
    setBalance(0);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, balance, login, register, logout, refreshUser, refreshBalance }),
    [user, loading, balance, login, register, logout, refreshUser, refreshBalance]
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
