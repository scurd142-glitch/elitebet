"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Users, Bell, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import type { DashboardData } from "@/types/user";

const STATS = [
  { label: "Wallet balance", key: "balance" as const, icon: Wallet, href: "/dashboard/wallet", format: (v: number) => `KES ${v.toFixed(2)}` },
  { label: "Referrals", key: "referralCount" as const, icon: Users, href: "/dashboard/referrals", format: (v: number) => String(v) },
  { label: "Unread alerts", key: "unreadNotifications" as const, icon: Bell, href: "/dashboard/notifications", format: (v: number) => String(v) },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, []);

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#ffffff]">
          Welcome back, {user?.fullName?.split(" ")[0]}
        </h2>
        <p className="text-[#888888]">Here&apos;s your account overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => {
          const raw =
            s.key === "balance"
              ? stats?.balance ?? 0
              : s.key === "referralCount"
                ? stats?.referralCount ?? 0
                : stats?.unreadNotifications ?? 0;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="card-surface p-4 transition hover:border-[#00a651]"
            >
              <s.icon className="mb-3 h-5 w-5 text-[#00a651]" />
              <p className="text-2xl font-bold text-[#f5c518]">{s.format(raw)}</p>
              <p className="mt-1 text-sm text-[#888888]">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {stats && (
        <div className="card-surface flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-[#888888]">Total earned</p>
            <p className="text-3xl font-bold text-[#f5c518]">KES {(stats.totalEarned ?? 0).toFixed(2)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-[#00a651]" />
        </div>
      )}

      <Link href="/" className="inline-block text-sm text-[#00a651] hover:underline">
        ← Back to EliteBet home
      </Link>
    </div>
  );
}
