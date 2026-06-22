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
      className="fixed left-0 right-0 top-0 z-[100] flex h-[56px] items-center gap-2 overflow-hidden bg-[#0d1117] px-3"
      style={{ zIndex: 100 }}
    >
      {/* N Logo */}
      <Link href="/" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#00C853]">
        <span className="text-lg font-bold text-[#ffffff]">N</span>
      </Link>

      {/* Balance */}
      <div className="flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold leading-[1.2] text-[#ffffff]" style={{ minWidth: "fit-content" }}>
        KES {balance.toFixed(2)}
      </div>

      {/* Gift icon with badge */}
      <div className="relative flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center">
        <Gift className="h-[22px] w-[22px] text-[#ffffff]" />
        <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#00C853]">
          <span className="text-[8px] font-bold text-[#ffffff]">{giftCount}</span>
        </div>
      </div>

      {/* Deposit button */}
      <button
        type="button"
        onClick={() => (user ? openDeposit() : window.location.assign("/login"))}
        className="flex h-[34px] flex-shrink-0 rounded-lg bg-[#00C853] px-3 text-[13px] font-bold text-[#ffffff]"
      >
        Deposit
      </button>

      {/* Icons */}
      <Link
        href="/search"
        className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center text-[#ffffff]"
        aria-label="Search"
      >
        <Search className="h-[22px] w-[22px]" />
      </Link>
      <button className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center text-[#ffffff]" aria-label="Theme">
        <Sun className="h-[22px] w-[22px]" />
      </button>
      <Link
        href="/notifications"
        className="relative flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center text-[#ffffff]"
        aria-label="Notifications"
      >
        <Bell className="h-[22px] w-[22px]" />
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00C853]" />
      </Link>
      <Link
        href={user ? "/account" : "/login"}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#00C853] text-xs font-bold text-[#ffffff]"
        aria-label="Account"
      >
        {user ? getInitials(user.fullName) : <User className="h-4 w-4" />}
      </Link>
    </header>
  );
}
