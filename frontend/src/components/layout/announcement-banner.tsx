"use client";

import Link from "next/link";
import { SITE } from "@/lib/constants";

export function AnnouncementBanner() {
  const paybill = SITE.paybill;

  return (
    <Link
      href="/wallet"
      className="fixed top-0 left-0 right-0 z-[60] flex h-[var(--banner-height)] items-center justify-center bg-[#00a651] px-4 text-center text-xs font-medium text-[#ffffff] sm:text-sm"
    >
      Deposit via M-Pesa Paybill {paybill} — Click to deposit
    </Link>
  );
}
