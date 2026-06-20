"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  Briefcase,
  Wallet,
  Users,
  ArrowDownToLine,
  LogOut,
  Shield,
  PenLine,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
  { icon: ArrowDownToLine, label: "Withdrawals", href: "/dashboard/withdrawals" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const ADMIN_SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Admin Overview", href: "/dashboard/admin/overview" },
  { icon: Users, label: "Manage Users", href: "/dashboard/admin/users" },
  { icon: Briefcase, label: "Manage Jobs", href: "/dashboard/admin/jobs" },
  { icon: ArrowDownToLine, label: "Withdrawals", href: "/dashboard/admin/withdrawals" },
];

const BOTTOM_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
  { icon: ArrowDownToLine, label: "Withdrawals", href: "/dashboard/withdrawals" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ background: "#1B3A2B" }}>
      {/* Collapsed Sidebar - Mobile */}
      <aside className="md:hidden fixed left-0 top-0 h-16 w-full z-40 flex items-center justify-between px-4" style={{ background: "#234A37", borderBottom: "1px solid #3A5F4A" }}>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-lg"
          style={{ background: "rgba(201, 162, 39, 0.1)" }}
        >
          <Menu className="w-6 h-6" style={{ color: "#C9A227" }} />
        </button>
        <div className="text-lg font-bold tracking-tight" style={{ color: "#F0EAD6" }}>
          WritersNite
        </div>
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: "#C9A227", color: "#1B3A2B" }}>
          {user?.fullName?.charAt(0) || "U"}
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-60 z-50 md:hidden flex flex-col" style={{ background: "#234A37" }}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #3A5F4A" }}>
              <div className="text-xl font-bold tracking-tight" style={{ color: "#F0EAD6" }}>
                WritersNite
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-11 h-11 rounded-lg" style={{ background: "rgba(201, 162, 39, 0.1)" }}>
                <X className="w-6 h-6" style={{ color: "#C9A227" }} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full"
                    style={{
                      color: isActive ? "#F0EAD6" : "#A8BFAE",
                      background: isActive ? "rgba(201, 162, 39, 0.2)" : "transparent",
                      borderLeft: isActive ? "3px solid #C9A227" : "3px solid transparent"
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              {user?.email === "scurd142@gmail.com" && (
                <>
                  <div className="my-2" style={{ borderTop: "1px solid #3A5F4A" }}></div>
                  <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: "#C9A227" }}>
                    Admin
                  </div>
                  {ADMIN_SIDEBAR_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full"
                        style={{
                          color: isActive ? "#F0EAD6" : "#A8BFAE",
                          background: isActive ? "rgba(201, 162, 39, 0.2)" : "transparent",
                          borderLeft: isActive ? "3px solid #C9A227" : "3px solid transparent"
                        }}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            <div className="p-4" style={{ borderTop: "1px solid #3A5F4A" }}>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#A8BFAE" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(201, 162, 39, 0.1)";
                  e.currentTarget.style.color = "#F0EAD6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#A8BFAE";
                }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-16 fixed h-full z-30" style={{ background: "#234A37", borderRight: "1px solid #3A5F4A" }}>
        <div className="p-4 flex items-center justify-center" style={{ borderBottom: "1px solid #3A5F4A" }}>
          <div className="text-xl font-bold tracking-tight" style={{ color: "#F0EAD6" }}>
            W
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center py-4 gap-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-11 h-11 rounded-lg transition-all"
                style={{
                  background: isActive ? "rgba(201, 162, 39, 0.2)" : "transparent",
                  borderLeft: isActive ? "3px solid #C9A227" : "3px solid transparent"
                }}
                title={item.label}
              >
                <item.icon className="w-6 h-6" style={{ color: isActive ? "#C9A227" : "#A8BFAE" }} />
              </Link>
            );
          })}
          {user?.email === "scurd142@gmail.com" && (
            <>
              <div className="w-8 h-px" style={{ background: "#3A5F4A" }}></div>
              {ADMIN_SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-center w-11 h-11 rounded-lg transition-all"
                    style={{
                      background: isActive ? "rgba(201, 162, 39, 0.2)" : "transparent",
                      borderLeft: isActive ? "3px solid #C9A227" : "3px solid transparent"
                    }}
                    title={item.label}
                  >
                    <item.icon className="w-6 h-6" style={{ color: isActive ? "#C9A227" : "#A8BFAE" }} />
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 flex flex-col items-center gap-4" style={{ borderTop: "1px solid #3A5F4A" }}>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center w-11 h-11 rounded-lg transition-all"
            style={{ color: "#A8BFAE" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201, 162, 39, 0.1)";
              e.currentTarget.style.color = "#F0EAD6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#A8BFAE";
            }}
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-16">
        <div className="p-4 md:p-6 md:pt-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-3" style={{ background: "#234A37", borderTop: "1px solid #3A5F4A" }}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <item.icon className="w-7 h-7" style={{ color: isActive ? "#C9A227" : "#A8BFAE" }} />
              <span className="text-xs" style={{ color: isActive ? "#C9A227" : "#A8BFAE" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
