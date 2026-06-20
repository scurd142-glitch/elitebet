"use client";

import { useEffect, useState } from "react";
import { Headphones, Send } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { SupportTicketItem } from "@/types/user";
import { cn } from "@/lib/utils";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicketItem | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  function loadList() {
    api.getAdminTickets().then((r) => r.success && r.data && setTickets(r.data.tickets));
  }

  function loadTicket(id: string) {
    setSelectedId(id);
    api.getAdminTicket(id).then((r) => r.success && r.data && setTicket(r.data.ticket));
  }

  useEffect(() => {
    loadList();
  }, []);

  async function sendReply() {
    if (!selectedId || !reply.trim()) return;
    setLoading(true);
    const res = await api.replyAdminTicket(selectedId, reply.trim());
    setLoading(false);
    if (res.success) {
      setReply("");
      loadTicket(selectedId);
      loadList();
    }
  }

  async function setStatus(status: (typeof STATUSES)[number]) {
    if (!selectedId) return;
    await api.updateTicketStatus(selectedId, status);
    loadTicket(selectedId);
    loadList();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Support tickets</h1>
        <p className="text-sm text-muted-foreground font-body">Reply to writer support requests.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="panel-split overflow-hidden lg:col-span-2">
          <div className="panel-split-header flex items-center gap-2">
            <Headphones className="h-5 w-5 text-[#FFD700]" />
            <h2 className="font-semibold">All tickets</h2>
          </div>
          <div className="panel-split-body p-0 max-h-[480px] overflow-y-auto">
            {tickets.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No tickets.</p>
            ) : (
              <ul>
                {tickets.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => loadTicket(t.id)}
                      className={cn(
                        "w-full border-b border-white/5 px-4 py-3 text-left hover:bg-white/5",
                        selectedId === t.id && "bg-[rgba(255,215,0,0.1)]"
                      )}
                    >
                      <p className="text-sm font-medium truncate">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.user?.fullName} · {t.status}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="panel-split overflow-hidden lg:col-span-3">
          <div className="panel-split-header flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{ticket?.subject ?? "Select a ticket"}</h2>
            {ticket && (
              <div className="flex flex-wrap gap-1">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={ticket.status === s ? "default" : "outline"}
                    onClick={() => setStatus(s)}
                  >
                    {s.replace("_", " ")}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="panel-split-body">
            {!ticket ? (
              <p className="text-sm text-muted-foreground">Select a ticket to view.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
                  {(ticket.messages ?? []).map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm max-w-[90%]",
                        m.isStaff
                          ? "bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)]"
                          : "bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.2)] ml-auto"
                      )}
                    >
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                        {m.isStaff ? "Staff" : m.user.fullName}
                      </p>
                      <p>{m.body}</p>
                    </div>
                  ))}
                </div>
                {ticket.status !== "CLOSED" && (
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Staff reply…"
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={sendReply} disabled={loading || !reply.trim()} className="self-end btn-premium">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
