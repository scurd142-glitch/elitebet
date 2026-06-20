"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { ReferralData } from "@/types/user";

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getReferrals().then((r) => r.success && r.data && setData(r.data));
  }, []);

  async function copyLink() {
    if (!data?.referralLink) return;
    await navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Referrals</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          Invite writers and earn 10% commission when they complete jobs.
        </p>
      </div>

      <div className="glass-premium rounded-2xl p-6 space-y-4">
        <p className="text-sm text-muted-foreground">Your referral code</p>
        <p className="text-2xl font-bold tracking-widest text-[#FFD700] font-mono">{data?.referralCode ?? "—"}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <code className="text-xs bg-muted px-3 py-2 rounded-lg break-all flex-1 min-w-0">
            {data?.referralLink ?? "Loading…"}
          </code>
          <Button size="sm" variant="outline" onClick={copyLink} className="gap-1 shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-premium rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Total referrals</p>
          <p className="text-2xl font-bold mt-1 text-[#FFD700] font-mono">{data?.referralCount ?? 0}</p>
        </div>
        <div className="glass-premium rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Commission earned</p>
          <p className="text-2xl font-bold mt-1 text-[#00C896] font-mono">
            KES {(data?.totalCommission ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      <section className="glass-premium rounded-2xl p-6">
        <h2 className="font-semibold mb-3">People you referred</h2>
        <ul className="space-y-2">
          {(data?.referrals ?? []).length === 0 ? (
            <li className="text-sm text-muted-foreground">No referrals yet — share your link!</li>
          ) : (
            data?.referrals.map((r) => (
              <li key={r.id} className="flex justify-between text-sm border-b border-border pb-2">
                <span>{r.fullName} (@{r.username})</span>
                <span className="text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
