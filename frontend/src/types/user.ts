export type PublicUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  role: "USER" | "ADMIN";
  accountStatus: "INACTIVE" | "ACTIVE" | "SUSPENDED" | "BANNED";
  referralCode: string;
  createdAt: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    user: PublicUser;
    token: string;
    expiresIn: string;
  };
  errors?: { field: string; message: string }[];
};

export type DashboardData = {
  user: PublicUser;
  stats: {
    balance: number;
    totalEarned: number;
    referralCount: number;
    activeJobs: number;
    openJobs: number;
    unreadNotifications: number;
  };
  recentNotifications: NotificationItem[];
  recentAssignments: JobAssignmentItem[];
  announcements: AnnouncementItem[];
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: string;
};

export type JobItem = {
  id: string;
  title: string;
  description: string;
  payout: number;
  status: string;
  deadline: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string };
};

export type JobAssignmentItem = {
  id: string;
  status: string;
  submissionText?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  job: JobItem;
};

export type WalletData = {
  balance: number;
  totalEarned: number;
  transactions: {
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }[];
};

export type ReferralData = {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  totalCommission: number;
  referrals: { id: string; fullName: string; username: string; createdAt: string }[];
  commissions: { id: string; amount: number; jobId: string; createdAt: string }[];
};

export type WithdrawalItem = {
  id: string;
  amount: number;
  status: string;
  adminNote?: string | null;
  payoutMethod?: string | null;
  destination?: string | null;
  createdAt: string;
  processedAt?: string | null;
  user?: { fullName: string; email: string; username?: string };
};

export type ActivityItem = {
  id: string;
  action: string;
  metadata: string | null;
  createdAt: string;
};

export type ActivationPaymentItem = {
  id: string;
  amount: number;
  payerPhone: string;
  transactionCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string | null;
  processedAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
  };
};

export type ActivationConfig = {
  amount: number;
  currency: string;
  paymentMethod: string;
  instructions: string[];
};

export type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type TicketMessageItem = {
  id: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  user: { id: string; fullName: string; username: string; role: string };
};

export type SupportTicketItem = {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; fullName: string; username: string; email: string };
  messages?: TicketMessageItem[];
};
