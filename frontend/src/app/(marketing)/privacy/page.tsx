import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[#ffffff]">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[#888888]">
        Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#888888]">
        <p>{SITE.name} describes how we collect, use, and protect personal information.</p>
        <p>
          <strong className="text-[#ffffff]">Data we collect.</strong> Account details, phone number, usage logs, payment metadata, and support messages.
        </p>
        <p>
          <strong className="text-[#ffffff]">How we use data.</strong> To provide the service, process deposits, prevent fraud, and improve the platform.
        </p>
      </div>
      <p className="mt-8">
        <Link href="/" className="text-[#f5c518] hover:underline">← Home</Link>
      </p>
    </div>
  );
}
