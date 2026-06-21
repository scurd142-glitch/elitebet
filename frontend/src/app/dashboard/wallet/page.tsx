"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { WalletData } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useDeposit } from "@/components/providers/deposit-provider";
import { useAuth } from "@/components/providers/auth-provider";
import toast from "react-hot-toast";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDir, setTransferDir] = useState<"main_to_casino" | "casino_to_main">("main_to_casino");
  const { openDeposit } = useDeposit();
  const { refreshBalance } = useAuth();

  const loadWallet = useCallback(async () => {
    const r = await api.getWallet();
    if (r.success && r.data) {
      setWallet(r.data);
      await refreshBalance();
    }
  }, [refreshBalance]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const mainBalance = wallet?.balance ?? 0;
  const totalBalance = mainBalance + (wallet?.casinoBalance ?? 0) + (wallet?.bonusBalance ?? 0);

  async function handleTransfer() {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const res = await api.transferBalance({ amount, direction: transferDir });
    if (res.success) {
      toast.success("Transfer successful");
      setShowTransferModal(false);
      setTransferAmount("");
      loadWallet();
    } else {
      toast.error(res.message ?? "Transfer failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">Wallet</h1>

        <div className="rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
          <p className="text-sm text-[#888888]">Main Balance</p>
          <p className="mt-2 text-4xl font-bold text-[#f5c518] font-mono">KES {mainBalance.toFixed(2)}</p>
          <p className="mt-1 text-xs text-[#888888]">Total across all wallets: KES {totalBalance.toFixed(2)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
            <p className="text-xs text-[#888888]">Casino Balance</p>
            <p className="mt-1 text-xl font-bold text-[#f5c518] font-mono">
              KES {(wallet?.casinoBalance ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
            <p className="text-xs text-[#888888]">Bonus Balance</p>
            <p className="mt-1 text-xl font-bold text-[#f5c518] font-mono">
              KES {(wallet?.bonusBalance ?? 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={openDeposit}
            className="flex flex-col items-center gap-2 rounded-xl bg-[#00a651] p-4 hover:bg-[#008c45] transition-colors"
          >
            <ArrowDownCircle className="h-6 w-6 text-[#ffffff]" />
            <span className="text-xs font-semibold text-[#ffffff]">DEPOSIT</span>
          </button>
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="flex flex-col items-center gap-2 rounded-xl bg-[#333333] p-4 hover:bg-[#444444] transition-colors"
          >
            <ArrowUpCircle className="h-6 w-6 text-[#888888]" />
            <span className="text-xs font-semibold text-[#888888]">WITHDRAW</span>
          </button>
          <button
            type="button"
            onClick={() => setShowTransferModal(true)}
            className="flex flex-col items-center gap-2 rounded-xl bg-[#333333] p-4 hover:bg-[#444444] transition-colors"
          >
            <ArrowRightLeft className="h-6 w-6 text-[#ffffff]" />
            <span className="text-xs font-semibold text-[#ffffff]">TRANSFER</span>
          </button>
        </div>

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
                    <Badge variant="outline" className="mt-1 text-xs border-[#333333] text-[#888888]">
                      {t.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className={`font-semibold font-mono ${t.amount >= 0 ? "text-[#00a651]" : "text-[#e63946]"}`}>
                    {t.amount >= 0 ? "+" : ""}KES {t.amount.toFixed(2)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#ffffff]">Withdraw</h3>
            <p className="mb-6 text-sm text-[#888888]">
              Withdrawals are currently unavailable. Please contact support.
            </p>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-full rounded-lg bg-[#333333] py-3 font-semibold text-[#ffffff]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#ffffff]">Transfer Balance</h3>
            <select
              value={transferDir}
              onChange={(e) => setTransferDir(e.target.value as typeof transferDir)}
              className="mb-3 w-full rounded-lg border border-[#333333] bg-[#222222] px-3 py-2 text-[#ffffff]"
            >
              <option value="main_to_casino">Main → Casino</option>
              <option value="casino_to_main">Casino → Main</option>
            </select>
            <input
              type="number"
              placeholder="Amount (KES)"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="mb-4 w-full rounded-lg border border-[#333333] bg-[#222222] px-3 py-2 text-[#ffffff]"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowTransferModal(false)} className="flex-1 rounded-lg bg-[#333333] py-3 text-[#ffffff]">
                Cancel
              </button>
              <button onClick={handleTransfer} className="flex-1 rounded-lg bg-[#00a651] py-3 font-semibold text-[#ffffff]">
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
