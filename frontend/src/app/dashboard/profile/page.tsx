"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">Your public writer identity.</p>
      </div>

      <div className="glass-premium rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,215,0,0.2)] text-xl font-bold text-[#FFD700]">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <p className="text-xl font-semibold text-[#FFD700]">{user.fullName}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm">
          <li>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{user.email}</p>
          </li>
          <li>
            <span className="text-muted-foreground">Phone</span>
            <p className="font-medium">{user.phone}</p>
          </li>
          <li>
            <span className="text-muted-foreground">Country</span>
            <p className="font-medium">{user.country}</p>
          </li>
          <li>
            <span className="text-muted-foreground">Referral code</span>
            <p className="font-medium">{user.referralCode}</p>
          </li>
          <li>
            <span className="text-muted-foreground">Member since</span>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </li>
          <li>
            <span className="text-muted-foreground">Role</span>
            <Badge className="mt-1">{user.role}</Badge>
          </li>
        </ul>
      </div>
    </div>
  );
}
