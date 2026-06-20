"use client";

import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={
        align === "center"
          ? "section-heading mx-auto text-center"
          : "section-heading max-w-2xl text-left"
      }
    >
      {eyebrow && (
        <p className="eyebrow" style={{
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#C9A227",
          marginBottom: "1rem"
        }}>{eyebrow}</p>
      )}
      <h2 className="font-display text-[clamp(2.3rem,4vw,3.8rem)] font-bold leading-tight tracking-[-0.04em]">
        <span className="gradient-text">{title}</span>
      </h2>
      {description && (
        <p className="mt-6 text-[var(--text-muted)] leading-relaxed text-lg">{description}</p>
      )}
    </motion.div>
  );
}
