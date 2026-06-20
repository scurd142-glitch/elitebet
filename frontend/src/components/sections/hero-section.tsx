"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { STAT_CARD_CLASS } from "@/lib/design";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const DEFAULT = {
  hero_title: "The most premium writing platform in Africa",
  hero_subtitle: `${SITE.name} — ${SITE.tagline}. Join elite writers who earn with style on ${SITE.company}'s flagship platform.`,
  hero_cta: "Start Writing",
};

const STATS = [
  { label: "Writers", value: "10K+", color: "blue" as const },
  { label: "Live jobs", value: "500+", color: "green" as const },
  { label: "Paid out", value: "$50K+", color: "green" as const },
  { label: "Support", value: "24/7", color: "pink" as const },
];

export function HeroSection() {
  const [content, setContent] = useState(DEFAULT);

  useEffect(() => {
    api.getPublicContent().then((r) => {
      if (r.success && r.data?.content) {
        setContent((prev) => ({ ...prev, ...r.data!.content }));
      }
    });
  }, []);

  const titleParts = content.hero_title.includes("premium writing")
    ? content.hero_title.split(/premium writing/i)
    : [content.hero_title, ""];

  return (
    <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40" style={{ background: "#1B3A2B" }}>
      <div className="absolute inset-0 hero-overlay opacity-70" />
      <div className="absolute inset-x-0 top-0 h-96 opacity-80" style={{ background: "radial-gradient(circle_at_top, rgba(201, 162, 39, 0.15), transparent 35%)" }} />
      <div className="absolute left-10 top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(201, 162, 39, 0.1)" }} />
      <div className="absolute right-10 top-32 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(232, 220, 196, 0.1)" }} />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl text-center"
        >
          <Badge className="mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold" style={{ background: "rgba(201, 162, 39, 0.15)", borderColor: "#C9A227", color: "#C9A227" }}>
            <Crown className="h-4 w-4" style={{ color: "#C9A227" }} />
            {SITE.company}
          </Badge>

          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl" style={{ color: "#F0EAD6" }}>
            {titleParts.length > 1 ? (
              <>
                {titleParts[0]}
                <span className="bg-gradient-to-r from-[#C9A227] via-[#E8DCC4] to-[#C9A227] bg-clip-text text-transparent">premium writing</span>
                {titleParts[1]}
              </>
            ) : (
              <span className="bg-gradient-to-r from-[#C9A227] to-[#E8DCC4] bg-clip-text text-transparent">{content.hero_title}</span>
            )}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg sm:text-xl leading-relaxed" style={{ color: "#A8BFAE" }}>
            {content.hero_subtitle}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button className="w-full sm:w-auto gap-2 px-10 py-4 font-semibold rounded-xl" style={{ background: "#C9A227", color: "#1B3A2B" }}>
                {content.hero_cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="w-full sm:w-auto px-10 py-4 rounded-xl" style={{ borderColor: "#3A5F4A", color: "#F0EAD6" }}>
                Explore Platform
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={cn(
                  "rounded-2xl p-6 text-left border shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                  stat.color === "blue" && "bg-[#234A37] border-[#3A5F4A]",
                  stat.color === "green" && "bg-[#234A37] border-[#3A5F4A]",
                  stat.color === "pink" && "bg-[#234A37] border-[#3A5F4A]"
                )}
                style={{ minWidth: 0 }}
              >
                <p className={cn(
                  "text-3xl sm:text-4xl font-bold truncate",
                  stat.color === "blue" && "text-[#C9A227]",
                  stat.color === "green" && "text-[#C9A227]",
                  stat.color === "pink" && "text-[#C9A227]"
                )}>{stat.value}</p>
                <p className="mt-3 text-xs sm:text-sm uppercase tracking-wider font-medium truncate" style={{ color: "#A8BFAE" }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
