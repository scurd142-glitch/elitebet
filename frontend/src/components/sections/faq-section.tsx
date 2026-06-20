"use client";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/content";

export function FaqSection() {
  return (
    <section id="faq" className="relative py-20 sm:py-28" style={{ background: "#1B3A2B" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(201, 162, 39, 0.05), transparent, rgba(232, 220, 196, 0.05))" }} />
      <div className="relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Clear answers about WritersNite and how the platform rolls out."
        />

        <Accordion className="mt-12" defaultOpen="what-is">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Accordion>
      </div>
      </div>
    </section>
  );
}
