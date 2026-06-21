"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-config";
import { useAuth } from "@/components/providers/auth-provider";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshBalance, refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    (async () => {
      const res = await api.verifyDeposit(reference);
      if (res.success) {
        setStatus("success");
        setMessage("Deposit successful! Your balance has been updated.");
        await refreshBalance();
        await refreshUser();
        setTimeout(() => router.push("/wallet"), 2500);
        return;
      }

      const fallback = await fetch(apiUrl("/api/payments/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      }).then((r) => r.json());

      if (fallback?.success) {
        setStatus("success");
        setMessage("Deposit successful! Your balance has been updated.");
        await refreshBalance();
        setTimeout(() => router.push("/wallet"), 2500);
      } else {
        setStatus("error");
        setMessage(res.message ?? "Payment verification failed.");
      }
    })();
  }, [searchParams, refreshBalance, refreshUser, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      {status === "loading" && <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#00a651]" />}
      {status === "success" && <CheckCircle2 className="mb-4 h-12 w-12 text-[#00a651]" />}
      {status === "error" && <XCircle className="mb-4 h-12 w-12 text-[#e63946]" />}
      <h1 className="mb-2 text-xl font-bold text-[#ffffff]">
        {status === "loading" ? "Verifying Payment" : status === "success" ? "Payment Successful" : "Verification Failed"}
      </h1>
      <p className="mb-6 max-w-sm text-sm text-[#888888]">{message}</p>
      <Link href="/wallet" className="text-sm text-[#00a651] hover:underline">
        Go to Wallet
      </Link>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#888888]">Loading…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
