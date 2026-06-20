import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPANY, PRICING } from "@/components/landing/constants";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Pricing for ${COMPANY.brand} — activation, Pro Writer, and Teams.`,
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-4 text-[var(--muted-foreground)]">
          Compare activation, subscription, and enterprise options. Full checkout flows connect in Phase 3.
        </p>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PRICING.map((p) => (
          <Card
            key={p.name}
            className={`relative flex h-full flex-col ${
              p.highlighted ? "border-[rgba(255,215,0,0.5)] shadow-[0_0_40px_rgba(255,215,0,0.15)]" : ""
            }`}
          >
            {p.highlighted ? (
              <div className="absolute right-4 top-4">
                <Badge variant="premium">Most popular</Badge>
              </div>
            ) : null}
            <CardHeader>
              <CardTitle className="font-heading text-xl">{p.name}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold">{p.price}</span>
                {p.period ? <span className="text-sm text-[var(--muted-foreground)]">{p.period}</span> : null}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#FFD700]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-auto w-full" variant={p.highlighted ? "default" : "secondary"} asChild>
                <Link href="/contact">{p.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-[var(--muted-foreground)]">
        <Link href="/#pricing" className="text-violet-600 hover:underline dark:text-violet-400">
          View pricing on homepage
        </Link>
      </p>
    </div>
  );
}
