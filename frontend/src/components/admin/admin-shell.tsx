"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Banknote,
  Mail,
  Headphones,
  Smartphone,
  ArrowLeft,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activations", label: "Activations", icon: Smartphone },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Banknote },
  { href: "/admin/contact", label: "Contact inbox", icon: Mail },
  { href: "/admin/tickets", label: "Support tickets", icon: Headphones },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#111111] pt-4 pb-8">
      <div className="flex min-h-screen">
        <aside className="fixed h-full w-64 border-r border-[#333333] bg-[#1a1a1a] p-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00a651]">
              <Shield className="h-5 w-5 text-[#ffffff]" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#ffffff]">Admin Panel</p>
              <p className="text-xs text-[#888888]">EliteBet management</p>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-[#222222] text-[#00a651]"
                      : "text-[#888888] hover:bg-[#222222] hover:text-[#ffffff]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-1 border-t border-[#333333] pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#888888] hover:text-[#ffffff]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-[#888888] hover:text-[#e63946]"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
