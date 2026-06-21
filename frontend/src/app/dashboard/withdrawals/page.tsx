"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { WithdrawalItem } from "@/types/user";

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<WithdrawalItem[]>([]);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api.getMyWithdrawals().then((r) => r.success && r.data && setList(r.data.withdrawals));
  }

  useEffect(() => {
    load();
    if (user?.phone) setPhone(user.phone);
  }, [user?.phone]);

  async function requestWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const r = await api.createWithdrawal({
      amount: Number(amount),
      phone,
    });
    if (r.success) {
      setMsg("Withdrawal submitted. After admin approval, funds are sent to your mobile money automatically.");
      setAmount("");
      load();
    } else {
      setErr(r.message ?? "Failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Withdrawals</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          Request payout to your mobile money number. Minimum KES 200. Approved withdrawals are paid via mobile money when enabled.
        </p>
      </div>

      <form onSubmit={requestWithdrawal} className="glass-premium rounded-2xl p-6 space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input
            id="amount"
            type="number"
            min={200}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile money phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-sm text-[#FF4444]">{err}</p>}
        {msg && <p className="text-sm text-[#00C896]">{msg}</p>}
        <Button type="submit" className="btn-premium">Request withdrawal</Button>
      </form>

      <section className="glass-premium rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Your requests</h2>
        <ul className="space-y-3">
          {list.length === 0 ? (
            <li className="text-sm text-muted-foreground">No withdrawal requests yet.</li>
          ) : (
            list.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap justify-between gap-2 border-b border-border pb-3"
              >
                <div>
                  <p className="font-medium">KES {w.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{w.destination || "N/A"}</p>
                </div>
                <Badge>{w.status}</Badge>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
