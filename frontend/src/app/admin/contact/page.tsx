"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { ContactMessageItem } from "@/types/user";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);

  function load() {
    api.getContactMessages().then((r) => r.success && r.data && setMessages(r.data.messages));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    await api.markContactRead(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Contact inbox</h1>
        <p className="text-sm text-muted-foreground font-body">Messages from the public contact form.</p>
      </div>

      <ul className="space-y-3">
        {messages.length === 0 ? (
          <li className="text-sm text-muted-foreground">No messages yet.</li>
        ) : (
          messages.map((m) => (
            <li
              key={m.id}
              className={`glass-premium rounded-xl p-5 ${!m.read ? "border-l-4 border-l-[#FFD700]" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {m.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-[#FFD700]" />
                  )}
                  <div>
                    <p className="font-medium">{m.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.name} · {m.email}
                    </p>
                  </div>
                </div>
                <time className="text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
              {!m.read && (
                <Button size="sm" variant="outline" className="mt-3 border-[rgba(255,215,0,0.3)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)]" onClick={() => markRead(m.id)}>
                  Mark read
                </Button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
