"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WithdrawalItem } from "@/types/user";

export default function AdminWithdrawalsPage() {
  const [list, setList] = useState<
    (WithdrawalItem & {
      user: { fullName: string; email: string; username: string };
    })[]
  >([]);

  function load() {
    api.getAdminWithdrawals().then((r) => r.success && r.data && setList(r.data.withdrawals));
  }

  useEffect(() => {
    load();
  }, []);

  async function process(id: string, status: "APPROVED" | "REJECTED") {
    const res = await api.processWithdrawal(id, { status });
    if (!res.success) alert(res.message ?? "Failed");
    load();
  }

  async function markPaid(id: string) {
    await api.markWithdrawalPaid(id);
    load();
  }

  async function retryPayout(id: string) {
    const res = await api.retryWithdrawalPayout(id);
    if (!res.success) alert(res.message ?? "Retry failed");
    else alert("Payout retry initiated");
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold heading-gradient">Withdrawal requests</h1>
      <p className="text-sm text-muted-foreground">
        Approve deducts from available balance. Paystack transfer is sent automatically once approved.
        Use &quot;Mark paid&quot; only if you paid manually outside the system.
      </p>
      <ul className="space-y-3">
        {list.map((w) => (
          <li key={w.id} className="glass-premium rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-medium font-mono">
                  KES {w.amount.toFixed(2)} {w.id} → {w.destination || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {w.user.fullName} ({w.user.email})
                </p>
                {w.adminNote && (
                  <p className="text-xs text-green-400 mt-1">
                    Note: {w.adminNote}
                  </p>
                )}
              </div>
              <Badge variant={w.status === "APPROVED" ? "active" : w.status === "REJECTED" ? "banned" : "pending"}>{w.status}</Badge>
            </div>
            {w.status === "PENDING" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="btn-premium" onClick={() => process(w.id, "APPROVED")}>
                  Approve & Pay
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[rgba(255,68,68,0.3)] text-[#FF4444] hover:bg-[rgba(255,68,68,0.1)]"
                  onClick={() => process(w.id, "REJECTED")}
                >
                  Reject
                </Button>
              </div>
            )}
            {w.status === "APPROVED" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="border-[rgba(255,215,0,0.3)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)]" onClick={() => retryPayout(w.id)}>
                  Retry Payout
                </Button>
                <Button size="sm" variant="outline" className="border-[rgba(0,200,150,0.3)] text-[#00C896] hover:bg-[rgba(0,200,150,0.1)]" onClick={() => markPaid(w.id)}>
                  Mark Paid
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
