"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Users, Calendar, Mail, Phone, MapPin, Ban, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  country?: string;
  accountStatus: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  createdAt: string;
  walletBalance?: number;
  referralCount?: number;
  isBanned?: boolean;
  walletTransactions?: Array<{
    id: string;
    type: string;
    amount: number;
    reason: string;
    createdAt: string;
  }>;
  activity?: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
  }>;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [params.id]);

  const fetchUserDetail = async () => {
    try {
      const res = await api.getAdminUsers();
      if (res.success && res.data) {
        const foundUser = res.data.users.find((u) => u.id === params.id);
        if (foundUser) {
          setUser(foundUser as any);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async () => {
    if (!user) return;
    try {
      const res = await api.toggleBanUser(user.id);
      if (res.success) {
        fetchUserDetail();
      }
    } catch (error) {
      console.error("Failed to toggle ban:", error);
    }
  };

  const handleActivateUser = async () => {
    if (!user) return;
    try {
      const res = await api.activateUserManually(user.id);
      if (res.success) {
        fetchUserDetail();
      }
    } catch (error) {
      console.error("Failed to activate user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ color: "#A8BFAE" }}>
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ color: "#A8BFAE" }}>
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg transition-colors hover:bg-[rgba(201, 162, 39, 0.1)]"
          style={{ color: "#C9A227" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#F0EAD6" }}>
            {user.fullName}
          </h1>
          <p className="text-sm" style={{ color: "#A8BFAE" }}>
            @{user.username} • {user.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-xl p-4 border"
          style={{ background: "#234A37", borderColor: "#3A5F4A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(201, 162, 39, 0.1)" }}
            >
              <Wallet className="w-5 h-5" style={{ color: "#C9A227" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Wallet Balance
              </p>
              <p className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>
                ${user.walletBalance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 border"
          style={{ background: "#234A37", borderColor: "#3A5F4A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(16, 185, 129, 0.1)" }}
            >
              <Users className="w-5 h-5" style={{ color: "#10B981" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Referrals
              </p>
              <p className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>
                {user.referralCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 border"
          style={{ background: "#234A37", borderColor: "#3A5F4A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(59, 130, 246, 0.1)" }}
            >
              <Calendar className="w-5 h-5" style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Registered
              </p>
              <p className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 border"
          style={{ background: "#234A37", borderColor: "#3A5F4A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: user.accountStatus === "ACTIVE"
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(245, 158, 11, 0.1)",
              }}
            >
              {user.accountStatus === "ACTIVE" ? (
                <CheckCircle className="w-5 h-5" style={{ color: "#10B981" }} />
              ) : (
                <Ban className="w-5 h-5" style={{ color: "#F59E0B" }} />
              )}
            </div>
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Status
              </p>
              <p className="text-lg font-semibold" style={{ color: "#F0EAD6" }}>
                {user.accountStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{ background: "#234A37", borderColor: "#3A5F4A" }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#F0EAD6" }}>
          Profile Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4" style={{ color: "#A8BFAE" }} />
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Email
              </p>
              <p className="text-sm" style={{ color: "#F0EAD6" }}>
                {user.email}
              </p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4" style={{ color: "#A8BFAE" }} />
              <div>
                <p className="text-xs" style={{ color: "#A8BFAE" }}>
                  Phone
                </p>
                <p className="text-sm" style={{ color: "#F0EAD6" }}>
                  {user.phone}
                </p>
              </div>
            </div>
          )}
          {user.country && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" style={{ color: "#A8BFAE" }} />
              <div>
                <p className="text-xs" style={{ color: "#A8BFAE" }}>
                  Country
                </p>
                <p className="text-sm" style={{ color: "#F0EAD6" }}>
                  {user.country}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4" style={{ color: "#A8BFAE" }} />
            <div>
              <p className="text-xs" style={{ color: "#A8BFAE" }}>
                Email Verified
              </p>
              <p className="text-sm" style={{ color: "#F0EAD6" }}>
                {user.emailVerifiedAt ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {user.accountStatus === "INACTIVE" && (
          <button
            onClick={handleActivateUser}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: "#10B981",
              color: "#1B3A2B",
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Activate User
          </button>
        )}
        <button
          onClick={handleToggleBan}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: user.isBanned ? "#10B981" : "#EF4444",
            color: "#1B3A2B",
          }}
        >
          {user.isBanned ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Unban User
            </>
          ) : (
            <>
              <Ban className="w-4 h-4" />
              Ban User
            </>
          )}
        </button>
      </div>
    </div>
  );
}
