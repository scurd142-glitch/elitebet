"use client";
import React from "react";
import { apiUrl } from "@/lib/api-config";

type Props = {
  email: string;
  amount: number; // in decimal (e.g., 500.00)
  currency?: string;
  onSuccess?: (reference: string) => void;
  className?: string;
};

export default function PaystackButton({ email, amount, currency = "KES", onSuccess, className = "" }: Props) {
  const handleClick = async () => {
    try {
      const res = await fetch(apiUrl("/api/payments/initialize"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, currency }),
      });
      const data = await res.json();
      if (!data || !data.success || !data.authorization_url) {
        alert("Payment initialization failed");
        return;
      }
      // Redirect user to Paystack checkout page (hosted)
      window.location.href = data.authorization_url;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Failed to start payment");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
    >
      Pay Registration Fee ({amount} {currency})
    </button>
  );
}
