"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { WalletData } from "@/types/user";
import { Badge } from "@/components/ui/badge";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    api.getWallet().then((r) => r.success && r.data && setWallet(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          Track earnings from completed jobs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="stat-card stat-card-green p-6">
          <p className="relative z-10 text-sm text-muted-foreground">Available balance</p>
          <p className="relative z-10 mt-2 text-3xl font-bold text-[#00C896] font-mono">
            KES {(wallet?.balance ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="stat-card stat-card-gold p-6">
          <p className="relative z-10 text-sm text-muted-foreground">Total earned</p>
          <p className="relative z-10 mt-2 text-3xl font-bold text-[#FFD700] font-mono">
            KES {(wallet?.totalEarned ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      <section className="glass-premium rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Transaction history</h2>
        <ul className="space-y-3">
          {(wallet?.transactions ?? []).length === 0 ? (
            <li className="text-sm text-muted-foreground">No transactions yet.</li>
          ) : (
            wallet?.transactions.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{t.description}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {t.type.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p
                  className={`font-semibold font-mono ${
                    t.amount >= 0 ? "text-[#00C896]" : "text-[#FF4444]"
                  }`}
                >
                  {t.amount >= 0 ? "+" : ""}
                  KES {t.amount.toFixed(2)}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
