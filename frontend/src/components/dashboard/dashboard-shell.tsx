"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  Wallet,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? "#ffffff" : "#888888",
    background: isActive ? "rgba(0, 166, 81, 0.15)" : "transparent",
    borderLeft: isActive ? "3px solid #00a651" : "3px solid transparent",
  });

  return (
    <div className="min-h-screen bg-[#111111] pb-16 md:pb-0">
      <aside className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#333333] bg-[#1a1a1a] px-4 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#222222]"
        >
          <Menu className="h-6 w-6 text-[#00a651]" />
        </button>
        <EliteBetLogo size={28} />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a651] text-sm font-medium text-[#ffffff]">
          {user?.fullName?.charAt(0) || "U"}
        </div>
      </aside>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-[#111111]/80 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-60 flex-col bg-[#1a1a1a] md:hidden">
            <div className="flex items-center justify-between border-b border-[#333333] p-4">
              <EliteBetLogo size={28} showText />
              <button onClick={() => setMobileMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#222222]">
                <X className="h-6 w-6 text-[#00a651]" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium"
                    style={linkStyle(isActive)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[#333333] p-4">
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#888888]"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      <aside className="fixed z-30 hidden h-full w-16 flex-col border-r border-[#333333] bg-[#1a1a1a] md:flex">
        <div className="flex items-center justify-center border-b border-[#333333] p-4">
          <EliteBetLogo size={28} />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-4 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={linkStyle(isActive)}
                title={item.label}
              >
                <item.icon className="h-6 w-6" style={{ color: isActive ? "#00a651" : "#888888" }} />
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-4 border-t border-[#333333] p-4">
          <button onClick={() => logout()} className="flex h-11 w-11 items-center justify-center rounded-lg text-[#888888] hover:text-[#ffffff]" title="Logout">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-16">
        <div className="p-4 pt-20 md:p-6 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
