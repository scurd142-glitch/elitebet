import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#333333] bg-[#1a1a1a] text-[#888888]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="EliteBet" width={36} height={36} />
              <span className="text-lg font-bold text-[#ffffff]">{SITE.name}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">{SITE.description}</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#888888]">
              Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#ffffff] hover:text-[#00a651]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-[#333333] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE.name}. All rights reserved.</p>
          <p>{SITE.version}</p>
        </div>
      </div>
    </footer>
  );
}
