import Link from "next/link";
import { PenLine } from "lucide-react";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[rgba(255,215,0,0.3)] bg-[#0A0A0A]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 via-orange-400 to-violet-500 text-white">
                <PenLine className="h-5 w-5" />
              </span>
              <span className="text-lg text-[#FFD700]">{SITE.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              {SITE.description}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              © {year} {SITE.company}. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#FFD700]">Platform</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[#FFD700]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#FFD700]">Account</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[#FFD700]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[rgba(255,215,0,0.1)] pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[#FFD700] font-medium">Premium writing platform — live & ready</span>
          <a
            href={`mailto:${SITE.email}`}
            className="transition-colors hover:text-[#FFD700]"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
