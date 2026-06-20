"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Banknote,
  Megaphone,
  FileText,
  FolderTree,
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
  { href: "/admin", label: "Analytics", icon: LayoutDashboard, color: "text-violet-400" },
  { href: "/admin/users", label: "Users", icon: Users, color: "text-blue-400" },
  { href: "/admin/activations", label: "Activations", icon: Smartphone, color: "text-green-400" },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, color: "text-green-400" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Banknote, color: "text-orange-400" },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone, color: "text-pink-400" },
  { href: "/admin/content", label: "Site content", icon: FileText, color: "text-yellow-400" },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, color: "text-green-400" },
  { href: "/admin/contact", label: "Contact inbox", icon: Mail, color: "text-pink-400" },
  { href: "/admin/tickets", label: "Support tickets", icon: Headphones, color: "text-violet-400" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar relative border-amber-500/20">
          <div className="mb-6 flex items-center gap-3 px-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30">
              <Shield className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#FFD700]">Admin Panel</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF4444] text-white ml-2">ADMIN</span>
              <p className="text-xs text-muted-foreground mt-1">Platform management</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "nav-item-active"
                      : "text-white hover:bg-white/5 hover:text-[#FFD700]"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active ? "text-[#FFD700]" : "text-white")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-1 border-t border-white/5 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-violet-500/10 hover:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Writer dashboard
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl hover:bg-red-500/10 hover:text-red-400"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
