"use client";

import { useEffect, useState } from "react";
import { X, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useDeposit } from "@/components/providers/deposit-provider";
import { api } from "@/lib/api";
import { SITE } from "@/lib/constants";

const PRESETS = [100, 200, 500, 1000, 2000, 5000, 10000] as const;
const MIN = 50;
const MAX = 250_000;

function formatPreset(amount: number) {
  if (amount >= 1000) return `${amount / 1000}K`;
  return String(amount);
}

export function DepositModal() {
  const { isOpen, closeDeposit } = useDeposit();
  const { user, balance, refreshBalance } = useAuth();
  const [selected, setSelected] = useState<number | null>(500);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelected(500);
      setCustom("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const customAmount = custom ? Number(custom.replace(/,/g, "")) : 0;
  const amount = custom ? customAmount : (selected ?? 0);
  const isValid = amount >= MIN && amount <= MAX;

  async function handleDeposit() {
    if (!user) {
      toast.error("Please log in to deposit");
      return;
    }
    if (!isValid) {
      toast.error(`Amount must be between KES ${MIN} and KES ${MAX.toLocaleString()}`);
      return;
    }

    setLoading(true);
    const res = await api.initiateDeposit({ amount });
    setLoading(false);

    if (!res.success || !res.data?.authorization_url) {
      toast.error(res.message ?? "Failed to initialize payment");
      return;
    }

    window.location.href = res.data.authorization_url;
  }

  async function handleVerify() {
    const reference = window.prompt("Enter your Paystack payment reference:");
    if (!reference?.trim()) return;

    setLoading(true);
    const res = await api.verifyDeposit(reference.trim());
    setLoading(false);

    if (res.success) {
      toast.success("Deposit successful! Your balance has been updated.");
      await refreshBalance();
      closeDeposit();
    } else {
      toast.error(res.message ?? "Could not verify payment");
    }
  }

  const paybill = SITE.paybill;
  const accountNumber = user?.phone?.replace(/\D/g, "") || "254XXXXXXXXX";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#111111]/90 p-0 sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#333333] bg-[#1a1a1a] sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#333333] bg-[#1a1a1a] px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#ffffff]">Quick Deposit</h2>
            <span className="flex items-center gap-1 rounded-full bg-[#00a651]/20 px-2 py-0.5 text-[10px] font-semibold text-[#00a651]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00a651]" />
              M-PESA Ready
            </span>
          </div>
          <button
            onClick={closeDeposit}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#888888] hover:bg-[#222222] hover:text-[#ffffff]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-4">
          {/* Balance card */}
          <div className="flex items-center justify-between rounded-xl border border-[#333333] bg-[#222222] p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#888888]">Your Balance</p>
              <p className="mt-1 text-2xl font-bold text-[#f5c518]">KES {balance.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#00a651] px-3 py-2 text-xs font-bold text-[#ffffff]">
              <Smartphone className="h-4 w-4" />
              M-PESA
            </div>
          </div>

          {/* Preset amounts */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#888888]">Select Amount</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelected(preset);
                    setCustom("");
                  }}
                  className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${
                    selected === preset && !custom
                      ? "border-[#00a651] bg-[#00a651]/15 text-[#00a651]"
                      : "border-[#333333] bg-[#222222] text-[#ffffff] hover:border-[#00a651]/50"
                  }`}
                >
                  {formatPreset(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#888888]">Or Enter Custom</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#888888]">KES</span>
              <input
                type="number"
                min={MIN}
                max={MAX}
                placeholder="0"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSelected(null);
                }}
                className="w-full rounded-xl border border-[#333333] bg-[#222222] py-3.5 pl-14 pr-4 text-lg font-semibold text-[#ffffff] outline-none focus:border-[#00a651]"
              />
            </div>
            <p className="mt-2 text-xs text-[#888888]">
              Min: KES {MIN.toLocaleString()} · Max: KES {MAX.toLocaleString()}
            </p>
          </div>

          {/* Deposit button */}
          <button
            type="button"
            disabled={loading || !isValid}
            onClick={handleDeposit}
            className="w-full rounded-xl bg-[#00a651] py-4 text-base font-bold text-[#ffffff] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing…" : `Deposit KES ${isValid ? amount.toLocaleString() : "—"}`}
          </button>

          {/* Paybill alternative */}
          <div className="rounded-xl border border-[#333333] bg-[#222222] p-4">
            <p className="mb-3 text-sm font-semibold text-[#ffffff]">Alternative: Pay via Paybill</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888888]">Paybill Number</span>
                <span className="font-mono font-bold text-[#f5c518]">{paybill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Account Number</span>
                <span className="font-mono font-bold text-[#ffffff]">{accountNumber}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full text-center text-sm text-[#00a651] hover:underline"
          >
            Didn&apos;t receive your payment? Verify Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
