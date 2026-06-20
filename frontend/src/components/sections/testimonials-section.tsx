"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { TESTIMONIALS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28" style={{ background: "#1B3A2B" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by ambitious writers"
          description="Early feedback from writers excited about a professional Kenyan-built writing platform."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-2xl p-6 border",
                "bg-[#234A37] border-[#3A5F4A]"
              )}
            >
              <Quote className="h-8 w-8 mb-4" style={{ color: "#C9A227" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#A8BFAE" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t pt-4" style={{ borderColor: "#3A5F4A" }}>
                <p className="font-semibold" style={{ color: "#F0EAD6" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "#A8BFAE" }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
