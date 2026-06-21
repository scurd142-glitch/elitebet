"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, ShieldCheck, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useDeposit } from "@/components/providers/deposit-provider";

function getInitials(name?: string) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatPhone(phone?: string) {
  if (!phone) return "254XXXXXXXXX";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const { openDeposit } = useDeposit();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<{
    wallet: { balance: number; casinoBalance: number; bonusBalance: number };
    sessions: { id: string; loginAt: string; device: string; browser: string }[];
    isVerified: boolean;
  } | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    api.getAccount().then((res) => {
      if (res.success && res.data) {
        setAccount({
          wallet: res.data.wallet,
          sessions: res.data.sessions,
          isVerified: Boolean(res.data.user.phone),
        });
      }
      setLoading(false);
    });
  }, [user, router]);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const res = await api.changePassword({
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
    });
    if (res.success) {
      toast.success("Password updated");
      setPasswordForm({ current: "", next: "", confirm: "" });
    } else {
      toast.error(res.message ?? "Failed to update password");
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-[#888888]">Loading account…</div>;
  }

  const wallet = account?.wallet;

  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-lg space-y-5 p-4">
        <h1 className="text-2xl font-bold text-[#ffffff]">Account</h1>

        <div className="card-surface flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00a651] text-xl font-bold text-[#ffffff]">
            {getInitials(user?.fullName)}
          </div>
          <div>
            <p className="font-mono text-sm text-[#888888]">{formatPhone(user?.phone)}</p>
            <p className="text-lg font-semibold text-[#ffffff]">{user?.fullName}</p>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                account?.isVerified
                  ? "bg-[#00a651]/20 text-[#00a651]"
                  : "bg-[#333333] text-[#888888]"
              }`}
            >
              {account?.isVerified ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
              {account?.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        <div className="card-surface space-y-3 p-5">
          <h2 className="text-sm font-semibold text-[#888888]">Balances</h2>
          <div className="flex justify-between">
            <span className="text-[#888888]">Main Balance</span>
            <span className="font-bold text-[#f5c518]">KES {(wallet?.balance ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888]">Casino Balance</span>
            <span className="font-bold text-[#f5c518]">KES {(wallet?.casinoBalance ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888]">Bonus Balance</span>
            <span className="font-bold text-[#f5c518]">KES {(wallet?.bonusBalance ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={openDeposit} className="rounded-xl bg-[#00a651] py-3 text-sm font-semibold text-[#ffffff]">
            Deposit
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="rounded-xl bg-[#333333] py-3 text-sm font-semibold text-[#888888]"
          >
            Withdraw
          </button>
          <button
            onClick={() => router.push("/wallet")}
            className="rounded-xl bg-[#333333] py-3 text-sm font-semibold text-[#ffffff]"
          >
            Transfer
          </button>
        </div>

        <form onSubmit={handlePasswordChange} className="card-surface space-y-3 p-5">
          <h2 className="text-sm font-semibold text-[#ffffff]">Change Password</h2>
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordForm.next}
            onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
            className="input-field"
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
            className="input-field"
            required
            minLength={6}
          />
          <button type="submit" className="w-full rounded-lg bg-[#222222] py-2.5 text-sm font-semibold text-[#ffffff]">
            Update Password
          </button>
        </form>

        <div className="card-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-[#ffffff]">Session History</h2>
          <ul className="space-y-2">
            {(account?.sessions ?? []).length === 0 ? (
              <li className="text-sm text-[#888888]">No session history yet.</li>
            ) : (
              account?.sessions.map((s) => (
                <li key={s.id} className="border-b border-[#333333] pb-2 text-sm last:border-0">
                  <p className="text-[#ffffff]">{new Date(s.loginAt).toLocaleString()}</p>
                  <p className="text-xs text-[#888888]">{s.device} · {s.browser.slice(0, 60)}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="card-surface flex items-center justify-between p-5">
          <span className="text-sm text-[#ffffff]">Theme</span>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg bg-[#222222] px-4 py-2 text-sm text-[#ffffff]"
          >
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>

        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e63946]/20 py-3 text-sm font-semibold text-[#e63946]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#ffffff]">Withdraw</h3>
            <p className="mb-6 text-sm text-[#888888]">
              Withdrawals are currently unavailable. Please contact support.
            </p>
            <button onClick={() => setShowWithdrawModal(false)} className="w-full rounded-lg bg-[#333333] py-3 text-[#ffffff]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
