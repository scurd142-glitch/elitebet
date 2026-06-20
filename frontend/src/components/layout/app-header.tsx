"use client";

import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";
import { useAuth } from "@/components/providers/auth-provider";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppHeader() {
  const { user } = useAuth();

  const balance = "0.00";
  const unreadCount = 0;

  return (
    <header
      className="fixed left-0 right-0 z-50 flex h-[var(--header-height)] items-center justify-between gap-2 border-b border-[#333333] bg-[#1a1a1a] px-3 sm:px-4"
      style={{ top: "var(--banner-height)" }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <EliteBetLogo size={28} />
        <span className="hidden text-sm font-semibold text-[#f5c518] sm:inline">
          KES {balance}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs font-semibold text-[#f5c518] sm:hidden">KES {balance}</span>
        <Link
          href="/wallet"
          className="rounded-md bg-[#00a651] px-3 py-1.5 text-xs font-semibold text-[#ffffff] sm:px-4 sm:text-sm"
        >
          Deposit
        </Link>
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#888888] hover:text-[#ffffff]"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Link>
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#888888] hover:text-[#ffffff]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-[#ffffff]">
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <Link
          href={user ? "/account" : "/login"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a651] text-xs font-bold text-[#ffffff]"
          aria-label="Account"
        >
          {user ? getInitials(user.fullName) : <User className="h-4 w-4" />}
        </Link>
      </div>
    </header>
  );
}
