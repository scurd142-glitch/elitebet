"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Ban, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  accountStatus: string;
  createdAt: string;
  walletBalance?: number;
  referralCount?: number;
  isBanned?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterStatus]);

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers(searchTerm);
      if (res.success && res.data) {
        let filteredUsers = res.data.users;
        if (filterStatus !== "ALL") {
          filteredUsers = filteredUsers.filter(
            (user) => user.accountStatus === filterStatus
          );
        }
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const res = await api.toggleBanUser(userId);
      if (res.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to toggle ban:", error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const res = await api.activateUserManually(userId);
      if (res.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to activate user:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: {
        background: "rgba(16, 185, 129, 0.1)",
        color: "#10B981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
      },
      INACTIVE: {
        background: "rgba(245, 158, 11, 0.1)",
        color: "#F59E0B",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      },
      SUSPENDED: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
      BANNED: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
    };

    const style = styles[status as keyof typeof styles] || styles.INACTIVE;

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
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#F0EAD6" }}>
          Users Management
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#A8BFAE" }}>
          View and manage all registered users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#A8BFAE" }} />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            style={{
              background: "#234A37",
              border: "1px solid #3A5F4A",
              color: "#F0EAD6",
            }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#A8BFAE" }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="pl-10 pr-4 py-2 rounded-lg text-sm appearance-none"
            style={{
              background: "#234A37",
              border: "1px solid #3A5F4A",
              color: "#F0EAD6",
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                  style={{ borderColor: "rgba(58, 95, 74, 0.3)" }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium" style={{ color: "#F0EAD6" }}>
                        {user.fullName}
                      </div>
                      <div className="text-sm" style={{ color: "#A8BFAE" }}>
                        {user.email}
                      </div>
                      <div className="text-xs" style={{ color: "#A8BFAE" }}>
                        @{user.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.accountStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "#F0EAD6" }}>
                      ${user.walletBalance?.toFixed(2) || "0.00"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "#F0EAD6" }}>
                      {user.referralCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "#A8BFAE" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/users/${user.id}`}
                        className="p-2 rounded-lg transition-colors hover:bg-[rgba(201, 162, 39, 0.1)]"
                        style={{ color: "#C9A227" }}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {user.accountStatus === "INACTIVE" && (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-[rgba(16, 185, 129, 0.1)]"
                          style={{ color: "#10B981" }}
                          title="Activate User"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBan(user.id)}
                        className="p-2 rounded-lg transition-colors hover:bg-[rgba(239, 68, 68, 0.1)]"
                        style={{ color: user.isBanned ? "#10B981" : "#EF4444" }}
                        title={user.isBanned ? "Unban User" : "Ban User"}
                      >
                        {user.isBanned ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                      </button>
                    </div>
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
