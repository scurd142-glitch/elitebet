import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[#ffffff]">Contact</h1>
      <p className="mt-2 text-[#888888]">Reach out for support, partnerships, or press inquiries.</p>
      <ContactForm />
      <p className="mt-8">
        <Link href="/" className="text-[#f5c518] hover:underline">← Back to home</Link>
      </p>
    </div>
  );
}
