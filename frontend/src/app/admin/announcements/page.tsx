"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { AnnouncementItem } from "@/types/user";

export default function AdminAnnouncementsPage() {
  const [list, setList] = useState<AnnouncementItem[]>([]);
  const [editing, setEditing] = useState<AnnouncementItem | null>(null);

  function load() {
    api.getAdminAnnouncements().then((r) => r.success && r.data && setList(r.data.announcements));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.createAnnouncement({
      title: String(form.get("title")),
      body: String(form.get("body")),
    });
    e.currentTarget.reset();
    load();
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    await api.updateAnnouncement(editing.id, {
      title: String(form.get("title")),
      body: String(form.get("body")),
      isActive: form.get("isActive") === "on",
    });
    setEditing(null);
    load();
  }

  async function toggleActive(a: AnnouncementItem) {
    await api.updateAnnouncement(a.id, { isActive: !a.isActive });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await api.deleteAnnouncement(id);
    load();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold heading-gradient">Announcements</h1>

      <form onSubmit={create} className="panel-split max-w-xl overflow-hidden">
        <div className="panel-split-header">
          <h2 className="font-semibold">New announcement</h2>
        </div>
        <div className="panel-split-body space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea name="body" rows={4} required />
          </div>
          <Button type="submit" className="btn-premium">Send to all writers</Button>
        </div>
      </form>

      {editing && (
        <form onSubmit={saveEdit} className="panel-split max-w-xl overflow-hidden border-[rgba(255,215,0,0.3)]">
          <div className="panel-split-header">
            <h2 className="font-semibold text-[#FFD700]">Edit announcement</h2>
          </div>
          <div className="panel-split-body space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={editing.title} required />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="body" rows={4} defaultValue={editing.body} required />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked={editing.isActive} />
              Active (visible to writers)
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="btn-premium">Save</Button>
              <Button type="button" variant="outline" className="border-[rgba(255,215,0,0.3)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)]" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {list.map((a) => (
          <li key={a.id} className="glass-premium rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{a.title}</p>
                  <Badge variant={a.isActive ? "active" : "outline"}>
                    {a.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => toggleActive(a)} title="Toggle active">
                  {a.isActive ? (
                    <ToggleRight className="h-4 w-4 text-[#00C896]" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(a)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)} title="Delete">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
