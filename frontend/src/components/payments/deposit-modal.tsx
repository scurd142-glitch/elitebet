"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useDeposit } from "@/components/providers/deposit-provider";
import { api } from "@/lib/api";

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

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0a0e1a]/90 p-0 sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#1e2530] bg-[#1a1f2e] sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#1e2530] bg-[#1a1f2e] px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#ffffff]">Quick Deposit</h2>
          </div>
          <button
            onClick={closeDeposit}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#2d3448] hover:text-[#ffffff]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-4">
          {/* Balance card */}
          <div className="flex items-center justify-between rounded-xl border border-[#1e2530] bg-[#2d3448] p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Your Balance</p>
              <p className="mt-1 text-2xl font-bold text-[#00C853]">KES {balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Preset amounts */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Select Amount</p>
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
                      ? "border-[#00C853] bg-[#00C853]/15 text-[#00C853]"
                      : "border-[#1e2530] bg-[#2d3448] text-[#ffffff] hover:border-[#00C853]/50"
                  }`}
                >
                  {formatPreset(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Or Enter Custom</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6b7280]">KES</span>
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
                className="w-full rounded-xl border border-[#1e2530] bg-[#2d3448] py-3.5 pl-14 pr-4 text-lg font-semibold text-[#ffffff] outline-none focus:border-[#00C853]"
              />
            </div>
            <p className="mt-2 text-xs text-[#6b7280]">
              Min: KES {MIN.toLocaleString()} · Max: KES {MAX.toLocaleString()}
            </p>
          </div>

          {/* Deposit button */}
          <button
            type="button"
            disabled={loading || !isValid}
            onClick={handleDeposit}
            className="w-full rounded-xl bg-[#00C853] py-4 text-base font-bold text-[#ffffff] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing…" : `Deposit KES ${isValid ? amount.toLocaleString() : "—"}`}
          </button>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full text-center text-sm text-[#00C853] hover:underline"
          >
            Didn&apos;t receive your payment? Verify Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
