"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Wallet,
  TrendingUp,
  Zap,
  Users,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FEATURES } from "@/lib/content";
import { ACCENT_COLORS, FEATURE_CARD_CLASS } from "@/lib/design";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  FileText,
  Wallet,
  TrendingUp,
  Zap,
  Users,
  Shield,
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28" style={{ background: "#1B3A2B" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, rgba(201, 162, 39, 0.05), transparent)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything writers need — beautifully delivered"
          description="A luxury-grade platform with jobs, wallet, referrals, and support — built for writers who demand the best."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon] ?? FileText;
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "group rounded-2xl border p-6 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden",
                  "bg-[#234A37] border-[#3A5F4A]"
                )}
                style={{ boxSizing: "border-box" }}
              >
                <div className="feature-icon mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110" style={{ background: "rgba(201, 162, 39, 0.15)" }}>
                  <Icon className="h-7 w-7" style={{ color: "#C9A227" }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#A8BFAE", wordBreak: "break-word" }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
