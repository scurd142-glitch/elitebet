"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Ticket, Dices, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/inplay", label: "Inplay", icon: Radio },
  { href: "/betslip", label: "Betslip", icon: Ticket, isCenter: true },
  { href: "/casino", label: "Casino", icon: Dices },
  { href: "/my-bets", label: "My Bets", icon: ClipboardList },
] as const;

export function BottomNav({ betslipCount = 0 }: { betslipCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[var(--bottom-nav-height)] items-end justify-around border-t border-[#333333] bg-[#1a1a1a] px-2 pb-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -mt-4 flex flex-col items-center gap-0.5"
            >
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c518] shadow-lg">
                <Icon className="h-7 w-7 text-[#111111]" />
                {betslipCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-[#ffffff]">
                    {betslipCount}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-[#00a651]" : "text-[#888888]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1"
          >
            <Icon
              className={cn("h-7 w-7", isActive ? "text-[#00a651]" : "text-[#888888]")}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-[#00a651]" : "text-[#888888]"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
