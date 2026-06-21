import { getAuthToken } from "@/lib/auth-storage";
import type {
  PublicUser,
  DashboardData,
  WalletData,
  ReferralData,
  WithdrawalItem,
  NotificationItem,
  ActivityItem,
  ContactMessageItem,
  SupportTicketItem,
  ActivationConfig,
  ActivationPaymentItem,
  MyBetItem,
} from "@/types/user";

import { apiUrl } from "@/lib/api-config";

type ApiResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...(options.headers ?? {}),
  };

  // Only set Content-Type if not FormData (for file uploads)
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(apiUrl(path), {
      ...options,
      headers,
    });

    const body = (await res.json()) as ApiResult<T>;

    if (!res.ok) {
      return {
        success: false,
        message: body.message ?? "Request failed",
        errors: body.errors,
      };
    }

    return body;
  } catch {
    return { success: false, message: "Network error — is the API running?" };
  }
}

export const api = {
  register: (payload: {
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
    password: string;
    referralCode?: string;
  }) =>
    request<{ user: PublicUser; token: string; expiresIn: string }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  login: (payload: {
    identifier: string;
    password: string;
    remember?: boolean;
  }) =>
    request<{ user: PublicUser; token: string; expiresIn: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  logout: () => request<null>("/api/auth/logout", { method: "POST" }),

  me: () => request<{ user: PublicUser }>("/api/auth/me"),

  getActivationConfig: () =>
    request<ActivationConfig>("/api/activation/config"),

  getActivationStatus: () =>
    request<{
      isActivated: boolean;
      activatedAt: string | null;
      latestPayment: {
        id: string;
        amount: number;
        status: string;
        createdAt: string;
      } | null;
    }>("/api/activation/status"),

  initiateActivationPayment: () =>
    request<{ authorization_url: string; reference: string; amount: number }>(
      "/api/activation/pay",
      { method: "POST" }
    ),

  refreshActivationUser: () =>
    request<{ user: PublicUser }>("/api/activation/me"),

  getDashboard: () => request<DashboardData>("/api/user/dashboard"),

  updateProfile: (payload: {
    fullName?: string;
    phone?: string;
    country?: string;
  }) =>
    request<{ user: PublicUser }>("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) =>
    request<null>("/api/user/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getNotifications: () =>
    request<{ notifications: NotificationItem[] }>("/api/user/notifications"),

  markNotificationRead: (id: string) =>
    request<null>(`/api/user/notifications/${id}/read`, { method: "PATCH" }),

  markAllNotificationsRead: () =>
    request<null>("/api/user/notifications/read-all", { method: "POST" }),

  getActivity: () =>
    request<{ activities: ActivityItem[] }>("/api/user/activity"),

  submitContact: (payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    request<{ id: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyTickets: () =>
    request<{ tickets: SupportTicketItem[] }>("/api/tickets"),

  getMyTicket: (id: string) =>
    request<{ ticket: SupportTicketItem }>(`/api/tickets/${id}`),

  createTicket: (payload: { subject: string; message: string }) =>
    request<{ ticket: SupportTicketItem }>("/api/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  replyToTicket: (id: string, body: string) =>
    request<{ ticket: SupportTicketItem }>(`/api/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  getWallet: () => request<WalletData>("/api/wallet"),

  initiateDeposit: (payload: { amount: number }) =>
    request<{ authorization_url: string; reference: string; paymentId: string }>(
      "/api/payments/initialize",
      { method: "POST", body: JSON.stringify({ ...payload, type: "DEPOSIT" }) }
    ),

  verifyDeposit: (reference: string) =>
    request<{ reference: string; amount: number; type: string; balance: number }>(
      `/api/payments/verify/${encodeURIComponent(reference)}`
    ),

  transferBalance: (payload: { amount: number; direction: "main_to_casino" | "casino_to_main" }) =>
    request<{ balance: number; casinoBalance: number; bonusBalance: number }>(
      "/api/wallet/transfer",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  getAccount: () =>
    request<{
      user: PublicUser & { isVerified?: boolean };
      wallet: { balance: number; casinoBalance: number; bonusBalance: number };
      sessions: { id: string; loginAt: string; device: string; browser: string; ipAddress: string | null }[];
    }>("/api/user/account"),

  getMyBets: () =>
    request<{ bets: MyBetItem[] }>("/api/bets/mine"),

  // Aviator
  placeAviatorBet: (payload: { amount: number }) =>
    request<{ id: string; stake: number; roundId: string }>("/api/aviator/bet", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cashoutAviator: (payload: { betId: string; multiplier: number }) =>
    request<{ winAmount: number }>("/api/aviator/cashout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAviatorHistory: () =>
    request<{ history: { id: string; crashPoint: number; createdAt: string }[] }>("/api/aviator/history"),

  getFakePlayers: () =>
    request<{ players: { name: string; phone: string; amount: number; cashoutMultiplier: number | null; winAmount: number }[] }>(
      "/api/aviator/fake-players"
    ),

  getReferrals: () => request<ReferralData>("/api/wallet/referrals"),

  getMyWithdrawals: () =>
    request<{ withdrawals: WithdrawalItem[] }>("/api/withdrawals/mine"),

  createWithdrawal: (payload: { amount: number; phone?: string; destination?: string }) =>
    request<{ withdrawal: { id: string; amount: number; status: string } }>(
      "/api/withdrawals",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  getPublicContent: () =>
    request<{ content: Record<string, string> }>("/api/admin/content/public"),

  // Admin
  getAdminAnalytics: () =>
    request<{
      stats: Record<string, number>;
      recentUsers: {
        id: string;
        fullName: string;
        username: string;
        email: string;
        isBanned: boolean;
        createdAt: string;
      }[];
    }>("/api/admin/analytics"),

  getAdminUsers: (search?: string) =>
    request<{ users: (PublicUser & { isBanned: boolean })[] }>(
      `/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),

  toggleBanUser: (id: string) =>
    request<{ isBanned: boolean }>(`/api/admin/users/${id}/ban`, {
      method: "PATCH",
    }),

  activateUserManually: (id: string) =>
    request<null>(`/api/admin/users/${id}/activate`, { method: "POST" }),

  getAdminActivations: (status?: string) =>
    request<{ payments: ActivationPaymentItem[] }>(
      `/api/admin/activations${status ? `?status=${status}` : ""}`
    ),

  processActivation: (
    id: string,
    payload: { status: "APPROVED" | "REJECTED"; adminNote?: string }
  ) =>
    request<null>(`/api/admin/activations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getContactMessages: () =>
    request<{ messages: ContactMessageItem[] }>("/api/contact"),

  markContactRead: (id: string) =>
    request<null>(`/api/contact/${id}/read`, { method: "PATCH" }),

  getAdminTickets: () =>
    request<{ tickets: SupportTicketItem[] }>("/api/tickets/admin"),

  getAdminTicket: (id: string) =>
    request<{ ticket: SupportTicketItem }>(`/api/tickets/admin/${id}`),

  replyAdminTicket: (id: string, body: string) =>
    request<{ ticket: SupportTicketItem }>(`/api/tickets/admin/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  updateTicketStatus: (
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) =>
    request<{ ticket: SupportTicketItem }>(`/api/tickets/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getAdminWithdrawals: () =>
    request<{
      withdrawals: (WithdrawalItem & {
        user: { id: string; fullName: string; username: string; email: string };
      })[];
    }>("/api/withdrawals/admin"),

  processWithdrawal: (
    id: string,
    payload: { status: "APPROVED" | "REJECTED"; adminNote?: string }
  ) =>
    request<null>(`/api/withdrawals/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  markWithdrawalPaid: (id: string) =>
    request<null>(`/api/withdrawals/admin/${id}/paid`, { method: "POST" }),

  retryWithdrawalPayout: (id: string) =>
    request<null>(`/api/withdrawals/admin/${id}/retry-payout`, { method: "POST" }),
};
