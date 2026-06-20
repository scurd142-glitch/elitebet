"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/constants";
import { api } from "@/lib/api";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await api.submitContact({
      name: String(form.get("name")),
      email: String(form.get("email")),
      subject: String(form.get("subject")),
      message: String(form.get("message")),
    });
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.message ?? "Failed to send message. Please try again.");
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28" style={{ background: "#1B3A2B" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          description="Questions about WritersNite or partnership with WritersNite Production Limited? Send a message — we read every one."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl p-6 flex gap-4" style={{ background: "#234A37", border: "1px solid #3A5F4A" }}>
              <Mail className="h-6 w-6 shrink-0" style={{ color: "#C9A227" }} />
              <div>
                <p className="font-semibold" style={{ color: "#F0EAD6" }}>Email</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm hover:underline"
                  style={{ color: "#A8BFAE" }}
                >
                  {SITE.email}
                </a>
              </div>
            </div>
            <div className="rounded-2xl p-6 flex gap-4" style={{ background: "#234A37", border: "1px solid #3A5F4A" }}>
              <MapPin className="h-6 w-6 shrink-0" style={{ color: "#C9A227" }} />
              <div>
                <p className="font-semibold" style={{ color: "#F0EAD6" }}>Company</p>
                <p className="text-sm" style={{ color: "#A8BFAE" }}>{SITE.company}</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 sm:p-8 space-y-4"
            style={{ background: "#234A37", border: "1px solid #3A5F4A" }}
          >
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold" style={{ color: "#C9A227" }}>Message sent!</p>
                <p className="mt-2 text-sm" style={{ color: "#A8BFAE" }}>
                  Thank you — our team will respond to your email shortly.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
                    {error}
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" style={{ color: "#A8BFAE" }}>Name</Label>
                    <Input id="contact-name" name="name" required disabled={loading} style={{ background: "#1B3A2B", borderColor: "#3A5F4A", color: "#F0EAD6" }} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" style={{ color: "#A8BFAE" }}>Email</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      disabled={loading}
                      style={{ background: "#1B3A2B", borderColor: "#3A5F4A", color: "#F0EAD6" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject" style={{ color: "#A8BFAE" }}>Subject</Label>
                  <Input id="contact-subject" name="subject" required disabled={loading} style={{ background: "#1B3A2B", borderColor: "#3A5F4A", color: "#F0EAD6" }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message" style={{ color: "#A8BFAE" }}>Message</Label>
                  <Textarea id="contact-message" name="message" required disabled={loading} style={{ background: "#1B3A2B", borderColor: "#3A5F4A", color: "#F0EAD6" }} />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading} style={{ background: "#C9A227", color: "#1B3A2B" }}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
