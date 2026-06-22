"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

const BARE_ROUTES = ["/login", "/register", "/verify-2fa", "/activate", "/dashboard"];
const NO_HEADER_ROUTES = ["/games/aviator"];
const ADMIN_PREFIX = "/admin";
const AUTH_CALLBACK_PREFIX = "/payments";

function shouldShowAppChrome(pathname: string) {
  if (BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
    return false;
  }
  if (pathname.startsWith(ADMIN_PREFIX)) return false;
  if (pathname.startsWith(AUTH_CALLBACK_PREFIX)) return false;
  return true;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = shouldShowAppChrome(pathname);
  const showHeader = !NO_HEADER_ROUTES.includes(pathname);

  if (!showChrome) {
    return <div className="app-main-content--bare bg-[#0a0e1a]">{children}</div>;
  }

  return (
    <>
      {showHeader && <AppHeader />}
      <div className="app-main-content bg-[#0a0e1a]">{children}</div>
      <BottomNav betslipCount={0} />
    </>
  );
}
