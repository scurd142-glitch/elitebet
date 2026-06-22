"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Briefcase, Clock, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalJobs: number;
  pendingWithdrawals: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.getAdminAnalytics();
      if (res.success && res.data) {
        const analytics = res.data;
        setStats({
          totalUsers: analytics.stats.totalUsers || 0,
          totalRevenue: analytics.stats.totalRevenue || 0,
          totalJobs: analytics.stats.totalJobs || 0,
          pendingWithdrawals: analytics.stats.pendingWithdrawals || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ color: "#A8BFAE" }}>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "#C9A227",
      bgColor: "rgba(201, 162, 39, 0.1)",
    },
    {
      title: "Total Revenue (KES)",
      value: stats?.totalRevenue || 0,
      icon: DollarSign,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Total Jobs Posted",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "Pending Withdrawals",
      value: stats?.pendingWithdrawals || 0,
      icon: Clock,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#F0EAD6" }}>
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#A8BFAE" }}>
          Overview of platform statistics and metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 border"
              style={{
                background: "#234A37",
                borderColor: "#3A5F4A",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: card.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <ArrowUpRight className="w-5 h-5" style={{ color: "#A8BFAE" }} />
              </div>
              <div className="mt-4">
                <p className="text-sm" style={{ color: "#A8BFAE" }}>
                  {card.title}
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "#F0EAD6" }}
                >
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{ background: "#234A37", borderColor: "#3A5F4A" }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#F0EAD6" }}>
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/dashboard/admin/users"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[rgba(201, 162, 39, 0.1)]"
            style={{ background: "rgba(35, 74, 55, 0.5)" }}
          >
            <Users className="w-5 h-5" style={{ color: "#C9A227" }} />
            <span className="text-sm font-medium" style={{ color: "#F0EAD6" }}>
              Manage Users
            </span>
          </a>
          <a
            href="/dashboard/admin/jobs"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[rgba(201, 162, 39, 0.1)]"
            style={{ background: "rgba(35, 74, 55, 0.5)" }}
          >
            <Briefcase className="w-5 h-5" style={{ color: "#C9A227" }} />
            <span className="text-sm font-medium" style={{ color: "#F0EAD6" }}>
              Manage Jobs
            </span>
          </a>
          <a
            href="/dashboard/admin/withdrawals"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[rgba(201, 162, 39, 0.1)]"
            style={{ background: "rgba(35, 74, 55, 0.5)" }}
          >
            <DollarSign className="w-5 h-5" style={{ color: "#C9A227" }} />
            <span className="text-sm font-medium" style={{ color: "#F0EAD6" }}>
              Withdrawals
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
