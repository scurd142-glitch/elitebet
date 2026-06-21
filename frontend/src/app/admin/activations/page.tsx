"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { ActivationPaymentItem } from "@/types/user";

export default function AdminActivationsPage() {
  const [payments, setPayments] = useState<ActivationPaymentItem[]>([]);
  const [filter, setFilter] = useState<"PENDING" | "ALL">("PENDING");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.getAdminActivations(
      filter === "PENDING" ? "PENDING" : undefined
    );
    if (res.success && res.data) setPayments(res.data.payments);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function process(
    id: string,
    status: "APPROVED" | "REJECTED",
    adminNote?: string
  ) {
    const note =
      status === "REJECTED"
        ? adminNote ??
          prompt("Rejection reason (optional):") ??
          undefined
        : undefined;
    const res = await api.processActivation(id, { status, adminNote: note });
    if (res.success) await load();
    else alert(res.message ?? "Failed");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold heading-gradient">Payment activations</h1>
          <p className="text-sm text-muted-foreground font-body">
            Verify KES 400 payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "PENDING" ? "default" : "outline"}
            onClick={() => setFilter("PENDING")}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter === "ALL" ? "default" : "outline"}
            onClick={() => setFilter("ALL")}
          >
            All
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No activation payments found.</p>
      ) : (
        <ul className="space-y-4">
          {payments.map((p) => (
            <li key={p.id} className="glass-premium rounded-xl p-5 space-y-3">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {p.user?.fullName} (@{p.user?.username})
                  </p>
                  <p className="text-sm text-muted-foreground">{p.user?.email}</p>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    p.status === "PENDING"
                      ? "bg-[rgba(255,215,0,0.2)] text-[#FFD700]"
                      : p.status === "APPROVED"
                        ? "bg-[rgba(0,200,150,0.2)] text-[#00C896]"
                        : "bg-[rgba(255,68,68,0.2)] text-[#FF4444]"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Transaction code: </span>
                  <span className="font-mono">{p.transactionCode}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Payer phone: </span>
                  {p.payerPhone}
                </p>
                <p>
                  <span className="text-muted-foreground">Amount: </span>
                  <span className="font-mono text-[#FFD700]">KES {p.amount}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Submitted: </span>
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>
              {p.adminNote && (
                <p className="text-sm text-muted-foreground">Note: {p.adminNote}</p>
              )}
              {p.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="btn-premium" onClick={() => process(p.id, "APPROVED")}>
                    Approve & activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[rgba(255,68,68,0.3)] text-[#FF4444] hover:bg-[rgba(255,68,68,0.1)]"
                    onClick={() => process(p.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
