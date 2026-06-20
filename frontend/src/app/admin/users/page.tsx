"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { PublicUser } from "@/types/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<(PublicUser & { isBanned: boolean })[]>([]);
  const [search, setSearch] = useState("");

  function load(q?: string) {
    api.getAdminUsers(q).then((r) => r.success && r.data && setUsers(r.data.users));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleBan(id: string) {
    await api.toggleBanUser(id);
    load(search || undefined);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold heading-gradient">User management</h1>
      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search name, email, username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="btn-premium" onClick={() => load(search || undefined)}>Search</Button>
      </div>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="glass-premium rounded-xl p-4 flex flex-wrap items-center justify-between gap-2"
          >
            <div>
              <p className="font-medium">
                {u.fullName} @{u.username}
              </p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {u.isBanned && (
                  <Badge variant="banned">
                    Banned
                  </Badge>
                )}
                {u.role !== "ADMIN" && u.accountStatus !== "ACTIVE" && (
                  <Badge variant="pending">
                    Not activated
                  </Badge>
                )}
              </div>
            </div>
            {u.role !== "ADMIN" && (
              <div className="flex gap-2">
                {u.accountStatus !== "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[rgba(0,200,150,0.3)] text-[#00C896] hover:bg-[rgba(0,200,150,0.1)]"
                    onClick={async () => {
                      await api.activateUserManually(u.id);
                      load(search || undefined);
                    }}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={u.isBanned ? "outline" : "default"}
                  className={
                    u.isBanned
                      ? "border-[rgba(255,215,0,0.3)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)]"
                      : "bg-[#FF4444] text-white hover:bg-[#FF4444]/90"
                  }
                  onClick={() => toggleBan(u.id)}
                >
                  {u.isBanned ? "Unban" : "Ban"}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
