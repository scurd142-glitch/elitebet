"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, DollarSign, Calendar } from "lucide-react";
import { api } from "@/lib/api";

interface AdminWithdrawal {
  id: string;
  amount: number;
  currency?: string;
  status: string;
  destination?: string | null;
  adminNotes?: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.getAdminWithdrawals();
      if (res.success && res.data) {
        setWithdrawals(res.data.withdrawals);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async (
    withdrawalId: string,
    status: "APPROVED" | "REJECTED",
    adminNote?: string
  ) => {
    try {
      const res = await api.processWithdrawal(withdrawalId, { status, adminNote });
      if (res.success) {
        fetchWithdrawals();
      }
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: {
        background: "rgba(245, 158, 11, 0.1)",
        color: "#F59E0B",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      },
      APPROVED: {
        background: "rgba(16, 185, 129, 0.1)",
        color: "#10B981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
      },
      REJECTED: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
      PAID: {
        background: "rgba(59, 130, 246, 0.1)",
        color: "#3B82F6",
        border: "1px solid rgba(59, 130, 246, 0.3)",
      },
      FAILED: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
    };

    const style = styles[status as keyof typeof styles] || styles.PENDING;

    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={style}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ color: "#A8BFAE" }}>
          Loading withdrawals...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#F0EAD6" }}>
          Withdrawals Management
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#A8BFAE" }}>
          Review and process withdrawal requests
        </p>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#234A37", borderColor: "#3A5F4A" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(35, 74, 55, 0.8)" }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Requested
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className="border-b"
                  style={{ borderColor: "rgba(58, 95, 74, 0.3)" }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium" style={{ color: "#F0EAD6" }}>
                        {withdrawal.user.fullName}
                      </div>
                      <div className="text-sm" style={{ color: "#A8BFAE" }}>
                        {withdrawal.user.email}
                      </div>
                      <div className="text-xs" style={{ color: "#A8BFAE" }}>
                        @{withdrawal.user.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" style={{ color: "#C9A227" }} />
                      <span className="text-sm font-medium" style={{ color: "#F0EAD6" }}>
                        {withdrawal.amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "#F0EAD6" }}>
                      {withdrawal.destination || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(withdrawal.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: "#A8BFAE" }} />
                      <span className="text-sm" style={{ color: "#F0EAD6" }}>
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {withdrawal.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleProcessWithdrawal(withdrawal.id, "APPROVED")}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(16, 185, 129, 0.1)]"
                          style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)" }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const note = prompt("Enter rejection reason (optional):");
                            if (note !== null) {
                              handleProcessWithdrawal(withdrawal.id, "REJECTED", note);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(239, 68, 68, 0.1)]"
                          style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status === "APPROVED" && (
                      <button
                        onClick={() => api.markWithdrawalPaid(withdrawal.id).then(fetchWithdrawals)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(59, 130, 246, 0.1)]"
                        style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.3)" }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
