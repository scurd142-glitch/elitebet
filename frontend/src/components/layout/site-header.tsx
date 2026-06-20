"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { COMPANY } from "@/components/landing/constants";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#earnings", label: "Earnings" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2D3A] bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(201,168,76,0.15)] text-lg font-bold text-[var(--accent-gold)] shadow-glow">
            W
          </span>
          <span className="font-display text-lg uppercase tracking-[0.24em] text-[var(--accent-gold)]">
            {COMPANY.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition duration-300 hover:text-[var(--text-primary)] hover:tracking-[0.02em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="hidden sm:inline-flex text-[var(--text-primary)]" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="hidden sm:inline-flex btn-primary" asChild>
            <Link href="/#pricing">Start Writing</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-2xl border-[var(--border)] bg-[var(--bg-secondary)]/80"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[#2A2D3A] bg-[var(--bg-primary)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--accent-gold)] transition-colors hover:bg-[rgba(201,168,76,0.15)]"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Button className="mt-4 w-full btn-primary" asChild>
              <Link href="/#pricing" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
