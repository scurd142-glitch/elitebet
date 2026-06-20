"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const REGISTRATION_FEE = 200; // KES

  async function handlePaystackPay() {
    setError(null);
    setLoading(true);

    try {
      // Use the centralized API client to initialize payment
      const res = await api.initiateActivationPayment();

      if (!res.success || !res.data?.authorization_url) {
        setError("Payment initialization failed");
        toast.error("Payment initialization failed");
        setLoading(false);
        return;
      }

      // Redirect to Paystack hosted checkout
      window.location.href = res.data.authorization_url;
    } catch (err) {
      console.error(err);
      setError((err as any).message || "Payment initialization failed");
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  }

  if (user?.accountStatus === "ACTIVE") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h1 className="text-2xl font-bold">Account activated</h1>
        <p className="text-[#888888]">You have full access to EliteBet.</p>
        <Link href="/">
          <Button className="bg-[#00a651] text-[#ffffff]">Go to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-lg space-y-8 text-center">
      {/* Logout Button - Top Right */}
      <button
        onClick={handleLogout}
        className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Back to Login
      </button>

      <div>
        <div className="mb-3 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#ffffff]">Activate Your Account</h1>
        <p className="mt-1 text-sm text-[#888888]">
          Pay the registration fee to unlock betting, wallet, and referrals on EliteBet.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Registration Fee</span>
          <span className="font-bold text-gray-900">
            KES {REGISTRATION_FEE}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Method</span>
          <span className="font-bold text-gray-900">M-Pesa / Card</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold mb-2 text-gray-900">What you get after activation:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Access to all writing jobs</li>
            <li>Wallet to manage earnings</li>
            <li>Referral system with KES 50 commission</li>
            <li>Withdrawal to M-Pesa</li>
            <li>Writer ranking and badges</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <h2 className="font-semibold text-gray-900">Pay KES {REGISTRATION_FEE} via M-Pesa</h2>
        <p className="text-sm text-gray-600">
          Secure payment via Paystack. Supports M-Pesa STK Push, Card, and other payment methods.
          Your account activates automatically after successful payment.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
          onClick={handlePaystackPay}
        >
          {loading ? "Initializing..." : `Pay KES ${REGISTRATION_FEE} via M-Pesa`}
        </Button>
      </div>
    </div>
  );
}
