"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const form = new FormData(e.currentTarget);
    const r = await api.updateProfile({
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      country: String(form.get("country") ?? ""),
    });
    if (r.success) {
      setMsg("Profile updated");
      await refreshUser();
    } else {
      setErr(r.message ?? "Update failed");
    }
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const form = new FormData(e.currentTarget);
    const r = await api.changePassword({
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword: String(form.get("newPassword") ?? ""),
    });
    if (r.success) {
      setMsg("Password changed");
      e.currentTarget.reset();
    } else {
      setErr(r.message ?? "Password change failed");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Account settings</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">Update your profile and password.</p>
      </div>

      {msg && <p className="text-sm text-[#00C896]">{msg}</p>}
      {err && <p className="text-sm text-[#FF4444]">{err}</p>}

      <form onSubmit={updateProfile} className="glass-premium rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold">Profile</h2>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" defaultValue={user?.fullName} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={user?.phone} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue={user?.country} required />
        </div>
        <Button type="submit" className="btn-premium">Save profile</Button>
      </form>

      <form onSubmit={changePassword} className="glass-premium rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold">Change password</h2>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input id="currentPassword" name="currentPassword" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
        </div>
        <Button type="submit" variant="outline" className="border-[rgba(255,215,0,0.35)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.14)]">
          Update password
        </Button>
      </form>
    </div>
  );
}
