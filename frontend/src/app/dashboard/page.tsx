"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Briefcase, Users, Bell, Megaphone, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import type { DashboardData } from "@/types/user";

const dashboardGridStyles = `
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    align-items: stretch;
  }

  @media (max-width: 1023px) {
    .dashboard-grid {
      grid-template-columns: repeat(1, 1fr);
    }

    .dashboard-card {
      grid-column: span 1 !important;
    }
  }

  .dashboard-card {
    background: #234A37;
    border: 1px solid #3A5F4A;
    border-radius: 12px;
    padding: 16px;
  }

  @media (min-width: 768px) {
    .dashboard-card {
      padding: 24px;
    }
  }
`;

const STATS = [
  { label: "Wallet balance", key: "balance" as const, icon: Wallet, href: "/dashboard/wallet", format: (v: number) => `KES ${v.toFixed(2)}` },
  { label: "Open jobs", key: "openJobs" as const, icon: Briefcase, href: "/dashboard/jobs", format: (v: number) => String(v) },
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
    <>
      <style>{dashboardGridStyles}</style>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: "#F0EAD6" }}>
          Welcome back, {user?.fullName?.split(" ")[0]}
        </h2>
        <p style={{ color: "#A8BFAE" }}>
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Main Grid Container - 12 Column System */}
      <div className="dashboard-grid">
        {/* Top Row: Metrics Cards (4 cards, each spanning 3 columns) */}
        {STATS.map((s) => {
          const raw =
            s.key === "balance"
              ? stats?.balance ?? 0
              : s.key === "openJobs"
                ? (data?.recentAssignments?.length ?? 0)
                : s.key === "referralCount"
                  ? stats?.referralCount ?? 0
                  : stats?.unreadNotifications ?? 0;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="dashboard-card transition-colors"
              style={{ gridColumn: 'span 3' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C9A227";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3A5F4A";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ background: "rgba(201, 162, 39, 0.15)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "#C9A227" }} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: "#F0EAD6" }}>{s.format(raw)}</p>
              <p className="text-sm mt-1" style={{ color: "#A8BFAE" }}>{s.label}</p>
            </Link>
          );
        })}

        {/* Middle Row: Main Content (8 columns) and Sidebar (4 columns) */}
        {/* Announcements - Main Content Section */}
        <section className="dashboard-card" style={{ gridColumn: 'span 8' }}>
          <div className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #3A5F4A" }}>
            <Megaphone className="w-5 h-5" style={{ color: "#C9A227" }} />
            <h3 className="font-semibold" style={{ color: "#F0EAD6" }}>Announcements</h3>
          </div>
          <div className="p-4 md:p-6">
            <ul className="space-y-4">
              {(data?.announcements ?? []).length === 0 ? (
                <li className="text-sm text-center py-4" style={{ color: "#A8BFAE" }}>No announcements yet.</li>
              ) : (
                data?.announcements.map((a) => (
                  <li
                    key={a.id}
                    className="pb-4 last:border-0 last:pb-0"
                    style={{ borderBottom: "1px solid #3A5F4A" }}
                  >
                    <p className="font-medium text-sm" style={{ color: "#F0EAD6" }}>{a.title}</p>
                    <p className="mt-1 text-xs line-clamp-2" style={{ color: "#A8BFAE" }}>{a.body}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Recent Jobs - Sidebar Widget Section */}
        <section className="dashboard-card" style={{ gridColumn: 'span 4' }}>
          <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #3A5F4A" }}>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" style={{ color: "#C9A227" }} />
              <h3 className="font-semibold" style={{ color: "#F0EAD6" }}>Recent Jobs</h3>
            </div>
            <Link href="/dashboard/jobs" className="text-sm font-medium hover:underline" style={{ color: "#C9A227" }}>
              View all
            </Link>
          </div>
          <div className="p-4 md:p-6">
            {(data?.recentAssignments ?? []).length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "#A8BFAE" }}>No jobs yet — start earning today.</p>
            ) : (
              <ul className="space-y-3">
                {data?.recentAssignments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between py-3 last:border-0 last:pb-0"
                    style={{ borderBottom: "1px solid #3A5F4A" }}
                  >
                    <span className="font-medium text-sm" style={{ color: "#F0EAD6" }}>{a.job.title}</span>
                    <Badge variant="outline" className="text-xs" style={{ borderColor: "#3A5F4A", color: "#A8BFAE" }}>
                      {a.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Bottom Row: Total Earned Card (Full width, spanning 12 columns) */}
        {stats && (
          <div className="dashboard-card" style={{ gridColumn: 'span 12', border: 'none', background: 'linear-gradient(to right, #C9A227, #E8DCC4)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#1B3A2B" }}>Total Earned</p>
                <p className="text-3xl font-bold mt-1 tracking-tight" style={{ color: "#1B3A2B" }}>
                  KES {(stats.totalEarned ?? 0).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: "#1B3A2B" }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
