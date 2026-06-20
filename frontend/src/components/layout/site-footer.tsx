import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";

const FOOTER_LINKS = {
  Product: [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund", label: "Refunds" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="footer-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(201,168,76,0.15)] text-lg font-bold text-[var(--accent-gold)]">
                W
              </span>
              <span className="footer-logo text-xl tracking-[0.28em] uppercase">
                {COMPANY.brand}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              A global writing marketplace and remote work ecosystem by {COMPANY.legalName}.
            </p>
          </div>
          {(Object.entries(FOOTER_LINKS) as [string, readonly { href: string; label: string }[]][]).map(
            ([title, links]) => (
              <div key={title}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.36em] text-[var(--text-muted)]">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-[var(--text-primary)]/90 transition hover:text-[var(--accent-gold)]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[#2A2D3A] pt-8 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName}. {COMPANY.country}.
          </p>
          <p className="text-[var(--text-muted)]/80">WritersNite is a registered product name.</p>
        </div>
      </div>
    </footer>
  );
}
