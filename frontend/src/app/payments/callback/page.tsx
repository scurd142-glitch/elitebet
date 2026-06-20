"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") ?? "";
    setReference(ref);

    if (!ref) {
      setStatus("No payment reference found");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: ref }),
        });
        const data = await res.json();
        if (data?.success) {
          setStatus("Payment verified. Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 1200);
        } else {
          setStatus("Payment verification failed.");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setStatus("Verification error");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          {status}
        </h2>
      </div>
    </div>
  );
}
