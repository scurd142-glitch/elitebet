"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (
      user.role === "USER" &&
      user.accountStatus !== "ACTIVE" &&
      !pathname.startsWith("/activate")
    ) {
      router.replace("/activate");
    }
    // Protect admin routes
    if (pathname.startsWith("/dashboard/admin") && user.email !== "scurd142@gmail.com") {
      router.replace("/dashboard");
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
