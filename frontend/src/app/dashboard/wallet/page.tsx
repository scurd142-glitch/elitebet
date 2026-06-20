"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { WalletData } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    api.getWallet().then((r) => r.success && r.data && setWallet(r.data));
  }, []);

  const totalBalance = (wallet?.balance ?? 0) + (wallet?.casinoBalance ?? 0) + (wallet?.bonusBalance ?? 0);

  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">Wallet</h1>

        {/* Main Balance Card */}
        <div className="rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
          <p className="text-sm text-[#888888]">My Balance</p>
          <p className="mt-2 text-4xl font-bold text-[#f5c518] font-mono">
            KES {totalBalance.toFixed(2)}
          </p>
        </div>

        {/* Casino and Bonus Balances */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-[#9b59b6]" />
              <p className="text-xs text-[#888888]">Casino Balance</p>
            </div>
            <p className="text-xl font-bold text-[#9b59b6] font-mono">
              KES {(wallet?.casinoBalance ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-[#00a651]" />
              <p className="text-xs text-[#888888]">Bonus Balance</p>
            </div>
            <p className="text-xl font-bold text-[#00a651] font-mono">
              KES {(wallet?.bonusBalance ?? 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-xl bg-[#00a651] p-4 hover:bg-[#008c45] transition-colors">
            <ArrowDownCircle className="h-6 w-6 text-[#ffffff]" />
            <span className="text-xs font-semibold text-[#ffffff]">DEPOSIT</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex flex-col items-center gap-2 rounded-xl bg-[#333333] p-4 hover:bg-[#444444] transition-colors"
          >
            <ArrowUpCircle className="h-6 w-6 text-[#ffffff]" />
            <span className="text-xs font-semibold text-[#ffffff]">WITHDRAW</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl bg-[#333333] p-4 hover:bg-[#444444] transition-colors">
            <ArrowRightLeft className="h-6 w-6 text-[#ffffff]" />
            <span className="text-xs font-semibold text-[#ffffff]">TRANSFER</span>
          </button>
        </div>

        {/* Transaction History */}
        <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
          <h2 className="mb-4 text-sm font-semibold text-[#ffffff]">Transaction History</h2>
          <ul className="space-y-3">
            {(wallet?.transactions ?? []).length === 0 ? (
              <li className="text-sm text-[#888888]">No transactions yet.</li>
            ) : (
              wallet?.transactions.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#ffffff]">{t.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {t.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p
                    className={`font-semibold font-mono ${
                      t.amount >= 0 ? "text-[#00a651]" : "text-[#e63946]"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    KES {t.amount.toFixed(2)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#ffffff]">Withdraw</h3>
            <p className="mb-6 text-sm text-[#888888]">
              Withdrawals are currently unavailable. Please contact support.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-lg bg-[#333333] py-3 font-semibold text-[#ffffff] hover:bg-[#444444] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
