"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Ticket, Dices, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCenter?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sports", label: "Sports", icon: Trophy },
  { href: "/betslip", label: "Betslip", icon: Ticket, isCenter: true },
  { href: "/casino", label: "Casino", icon: Dices },
  { href: "/my-bets", label: "My Bets", icon: ClipboardList },
];

export function BottomNav({ betslipCount = 0 }: { betslipCount?: number }) {
  const pathname = usePathname();
  const isAviatorPage = pathname.startsWith("/games/aviator");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[var(--bottom-nav-height)] items-end justify-around border-t border-[#1e2530] bg-[#0d1117] px-2 pb-2">
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
              className={`relative flex flex-col items-center gap-0.5 ${isAviatorPage ? "" : "-mt-4"}`}
            >
              <span className={`relative flex items-center justify-center rounded-full bg-[#f5a623] shadow-lg ${isAviatorPage ? "h-10 w-10" : "h-14 w-14"}`}>
                <Icon className={`text-[#0a0e1a] ${isAviatorPage ? "h-5 w-5" : "h-7 w-7"}`} />
                {betslipCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-[#ffffff]">
                    {betslipCount}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-[#00C853]" : "text-[#6b7280]"
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
              className={cn("h-7 w-7", isActive ? "text-[#00C853]" : "text-[#6b7280]")}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-[#00C853]" : "text-[#6b7280]"
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
