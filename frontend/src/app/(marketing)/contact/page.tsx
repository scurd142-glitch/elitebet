import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${COMPANY.brand} — ${COMPANY.legalName}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-heading text-4xl font-bold tracking-tight heading-gradient">Contact</h1>
      <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed font-body">
        For partnerships, compliance, or press inquiries related to {COMPANY.brand}. Support ticketing ships in a later
        phase; this page mirrors the marketing contact form pattern.
      </p>
      <ContactForm />
      <p className="mt-8">
        <Link href="/" className="font-medium text-[#FFD700] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
