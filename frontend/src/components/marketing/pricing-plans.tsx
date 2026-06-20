"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/content";
import { cn } from "@/lib/utils";

const PLAN_STYLES = [
  "border-blue-500/30 bg-blue-500/5",
  "border-pink-500/40 bg-gradient-to-b from-pink-500/10 via-violet-500/10 to-orange-500/5 shadow-2xl shadow-pink-500/20",
  "border-green-500/30 bg-green-500/5",
];

const CHECK_COLORS = ["text-blue-400", "text-pink-400", "text-green-400"];

export function PricingPlans() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl border p-8 backdrop-blur-sm transition-transform hover:scale-[1.02]",
                PLAN_STYLES[i]
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                <span className="ml-2 text-sm text-muted-foreground">{plan.period}</span>
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className={cn("h-5 w-5 shrink-0", CHECK_COLORS[i])} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button
                  className={cn("w-full", plan.highlighted && "btn-premium")}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
