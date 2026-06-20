"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  return (
    <form
      className="mt-10 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Name" name="name" />
        <Input type="email" placeholder="Email" name="email" />
      </div>
      <Input placeholder="Subject" name="subject" />
      <textarea
        name="message"
        rows={5}
        placeholder="Message"
        className="flex w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
