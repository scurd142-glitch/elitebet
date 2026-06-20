"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Plus, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { SupportTicketItem } from "@/types/user";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  OPEN: "border-[rgba(255,215,0,0.3)] text-[#FFD700]",
  IN_PROGRESS: "border-[rgba(255,215,0,0.3)] text-[#FFD700]",
  RESOLVED: "border-[rgba(0,200,150,0.3)] text-[#00C896]",
  CLOSED: "border-muted text-muted-foreground",
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicketItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  function loadList() {
    api.getMyTickets().then((r) => r.success && r.data && setTickets(r.data.tickets));
  }

  function loadTicket(id: string) {
    setSelectedId(id);
    api.getMyTicket(id).then((r) => r.success && r.data && setTicket(r.data.ticket));
  }

  useEffect(() => {
    loadList();
  }, []);

  async function createTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await api.createTicket({
      subject: String(form.get("subject")),
      message: String(form.get("message")),
    });
    setLoading(false);
    if (res.success && res.data) {
      setShowNew(false);
      loadList();
      loadTicket(res.data.ticket.id);
    }
  }

  async function sendReply() {
    if (!selectedId || !reply.trim()) return;
    setLoading(true);
    const res = await api.replyToTicket(selectedId, reply.trim());
    setLoading(false);
    if (res.success) {
      setReply("");
      loadTicket(selectedId);
      loadList();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold heading-gradient">Support</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">
            Open a ticket and chat with our team.
          </p>
        </div>
        <Button className="gap-2 btn-premium" onClick={() => setShowNew(!showNew)}>
          <Plus className="h-4 w-4" />
          New ticket
        </Button>
      </div>

      {showNew && (
        <form onSubmit={createTicket} className="panel-split overflow-hidden">
          <div className="panel-split-header">
            <h2 className="font-semibold">Create support ticket</h2>
          </div>
          <div className="panel-split-body space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input name="subject" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="message" rows={4} required disabled={loading} />
            </div>
            <Button type="submit" disabled={loading} className="gap-2 btn-premium">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit ticket
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="panel-split overflow-hidden lg:col-span-2">
          <div className="panel-split-header flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#FFD700]" />
            <h2 className="font-semibold">Your tickets</h2>
          </div>
          <div className="panel-split-body p-0">
            {tickets.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No tickets yet.</p>
            ) : (
              <ul>
                {tickets.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => loadTicket(t.id)}
                      className={cn(
                        "w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/5",
                        selectedId === t.id && "bg-[rgba(255,215,0,0.1)]"
                      )}
                    >
                      <p className="text-sm font-medium truncate">{t.subject}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px]", STATUS_COLOR[t.status])}>
                          {t.status.replace("_", " ")}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(t.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="panel-split overflow-hidden lg:col-span-3 min-h-[320px]">
          <div className="panel-split-header">
            <h2 className="font-semibold">{ticket ? ticket.subject : "Select a ticket"}</h2>
          </div>
          <div className="panel-split-body flex flex-col">
            {!ticket ? (
              <p className="text-sm text-muted-foreground">
                Choose a ticket from the list or create a new one.
              </p>
            ) : (
              <>
                <div className="flex-1 space-y-3 max-h-80 overflow-y-auto mb-4">
                  {(ticket.messages ?? []).map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm max-w-[90%]",
                        m.isStaff
                          ? "ml-0 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)]"
                          : "ml-auto bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.2)]"
                      )}
                    >
                      <p className="text-[10px] font-semibold mb-1 text-muted-foreground">
                        {m.isStaff ? "Support team" : "You"}
                      </p>
                      <p>{m.body}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                {ticket.status !== "CLOSED" && (
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply…"
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendReply}
                      disabled={loading || !reply.trim()}
                      className="shrink-0 self-end gap-1"
                    >
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
