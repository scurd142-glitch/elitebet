"use client";

import { motion } from "framer-motion";
import { Building2, Target, Globe } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ICON_COLOR_CLASS } from "@/lib/design";
import { WritersniteLogo } from "@/components/ui/writersnite-logo";

const PILLARS = [
  {
    icon: Target,
    title: "Writer-First Mission",
    text: "Every feature is designed so writers can register, work, earn, and withdraw with confidence.",
    color: "pink" as const,
  },
  {
    icon: Globe,
    title: "Built to Scale",
    text: "From landing page to jobs, payments, and referrals — the architecture grows without rebuilding.",
    color: "blue" as const,
  },
];

const COMPANY_CARD = {
  title: "WritersNite Production Limited",
  description: "The team behind this platform, built for African writers to access quality writing opportunities and grow their careers.",
};

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28" style={{ background: "#1B3A2B" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About"
          title={`Meet ${SITE.name}`}
          description="A premium writing ecosystem for freelancers, students, and professional writers who want a serious platform — not another informal group."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* Company Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="rounded-2xl p-6 border"
            style={{ background: "#234A37", borderColor: "#3A5F4A" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ background: "rgba(201, 162, 39, 0.15)" }}>
                <WritersniteLogo size={24} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>{COMPANY_CARD.title}</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#A8BFAE" }}>{COMPANY_CARD.description}</p>
          </motion.div>

          {PILLARS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
              className="rounded-2xl p-6 border"
              style={{ background: "#234A37", borderColor: "#3A5F4A" }}
            >
              <item.icon className="h-10 w-10 mb-4" style={{ color: "#C9A227" }} />
              <h3 className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#A8BFAE" }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
