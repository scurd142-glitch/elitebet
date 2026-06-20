"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { NotificationItem } from "@/types/user";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  function load() {
    api.getNotifications().then((r) => r.success && r.data && setItems(r.data.notifications));
  }

  useEffect(() => {
    load();
  }, []);

  async function markAllRead() {
    await api.markAllNotificationsRead();
    load();
  }

  async function markOneRead(id: string) {
    await api.markNotificationRead(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold heading-gradient">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">
            Stay updated on jobs, payouts, and news.
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-[rgba(255,215,0,0.35)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.14)]" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No notifications yet.</li>
        ) : (
          items.map((n) => (
            <li
              key={n.id}
              className={`glass-premium rounded-xl p-4 ${!n.read ? "border-l-4 border-l-[#FFD700]" : ""}`}
            >
              <div className="flex justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#FFD700]">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground font-body">{n.message}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  {!n.read && <Badge variant="premium">New</Badge>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {!n.read && (
                    <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => markOneRead(n.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
