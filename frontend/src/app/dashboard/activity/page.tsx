"use client";

import { useEffect, useState } from "react";
import { Activity, LogIn, User, Key, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import type { ActivityItem } from "@/types/user";
import { cn } from "@/lib/utils";

const ACTION_META: Record<string, { label: string; icon: typeof Activity; color: string }> = {
  profile_updated: { label: "Profile updated", icon: User, color: "text-[#FFD700]" },
  password_changed: { label: "Password changed", icon: Key, color: "text-[#FFD700]" },
  job_accepted: { label: "Job accepted", icon: Briefcase, color: "text-[#00C896]" },
  job_submitted: { label: "Work submitted", icon: Briefcase, color: "text-[#7B68EE]" },
  login: { label: "Signed in", icon: LogIn, color: "text-[#FFD700]" },
};

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    api.getActivity().then((r) => r.success && r.data && setItems(r.data.activities));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Activity log</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          Your recent actions on the platform.
        </p>
      </div>

      <section className="panel-split overflow-hidden">
        <div className="panel-split-header flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#FFD700]" />
          <h2 className="font-semibold">Recent activity</h2>
        </div>
        <div className="panel-split-body">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((a) => {
                const meta = ACTION_META[a.action] ?? {
                  label: a.action.replace(/_/g, " "),
                  icon: Activity,
                  color: "text-muted-foreground",
                };
                const Icon = meta.icon;
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                  >
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-white/5", meta.color)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium capitalize">{meta.label}</p>
                      {a.metadata && (
                        <p className="text-xs text-muted-foreground truncate">{a.metadata}</p>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString()}
                    </time>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
