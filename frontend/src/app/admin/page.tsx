"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [recent, setRecent] = useState<
    { id: string; fullName: string; email: string; createdAt: string; isBanned: boolean }[]
  >([]);

  useEffect(() => {
    api.getAdminAnalytics().then((r) => {
      if (r.success && r.data) {
        setStats(r.data.stats);
        setRecent(r.data.recentUsers);
      }
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold heading-gradient">Admin analytics</h1>
          <p className="text-sm text-muted-foreground font-body">Platform overview</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total users", key: "totalUsers", variant: "stat-card-gold" },
          { label: "New this week", key: "newUsersWeek", variant: "stat-card-green" },
          { label: "Banned", key: "bannedUsers", variant: "stat-card-red" },
          { label: "Total bets", key: "totalBets", variant: "stat-card-purple" },
          { label: "Active bets", key: "activeBets", variant: "stat-card-gold" },
          { label: "Total wagered", key: "totalWagered", variant: "stat-card-green" },
        ].map((s) => (
          <div
            key={s.key}
            className={cn(s.variant, "p-5")}
          >
            <p className="relative z-10 text-sm text-muted-foreground">{s.label}</p>
            <p className="relative z-10 text-2xl font-bold mt-1 font-mono">{stats?.[s.key] ?? 0}</p>
          </div>
        ))}
      </div>

      <section className="glass-premium rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Recent registrations</h2>
        <ul className="space-y-2 text-sm">
          {recent.map((u) => (
            <li key={u.id} className="flex justify-between border-b border-border pb-2">
              <span>
                {u.fullName} ({u.email}){u.isBanned ? " — banned" : ""}
              </span>
              <span className="text-muted-foreground">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
