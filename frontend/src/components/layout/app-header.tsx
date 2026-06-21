"use client";

import Link from "next/link";
import { Bell, Search, User, Gift, Sun } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useDeposit } from "@/components/providers/deposit-provider";

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
  const { user, balance } = useAuth();
  const { openDeposit } = useDeposit();
  const unreadCount = 0;
  const giftCount = 3;

  return (
    <header
      className="fixed left-0 right-0 top-0 z-100 flex h-[56px] items-center justify-between gap-3 bg-[#0d1117] px-4"
      style={{ zIndex: 100 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* N Logo */}
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00C853]">
          <span className="text-lg font-bold text-[#ffffff]">N</span>
        </Link>
        <span className="text-[14px] font-semibold text-[#ffffff]">KES {balance.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Gift icon with badge */}
        <div className="relative">
          <Gift className="h-6 w-6 text-[#ffffff]" />
          <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#00C853]">
            <span className="text-[8px] font-bold text-[#ffffff]">{giftCount}</span>
          </div>
        </div>

        {/* Deposit button */}
        <button
          type="button"
          onClick={() => (user ? openDeposit() : window.location.assign("/login"))}
          className="h-9 rounded-lg bg-[#00C853] px-4 text-[14px] font-bold text-[#ffffff]"
        >
          Deposit
        </button>

        {/* Icons */}
        <Link
          href="/search"
          className="flex h-6 w-6 items-center justify-center text-[#ffffff]"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </Link>
        <button className="flex h-6 w-6 items-center justify-center text-[#ffffff]" aria-label="Theme">
          <Sun className="h-6 w-6" />
        </button>
        <Link
          href="/notifications"
          className="relative flex h-6 w-6 items-center justify-center text-[#ffffff]"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00C853]" />
        </Link>
        <Link
          href={user ? "/account" : "/login"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00C853] text-xs font-bold text-[#ffffff]"
          aria-label="Account"
        >
          {user ? getInitials(user.fullName) : <User className="h-4 w-4" />}
        </Link>
      </div>
    </header>
  );
}
