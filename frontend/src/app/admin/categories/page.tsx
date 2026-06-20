"use client";

import { useEffect, useState } from "react";
import { FolderPlus } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string; description: string | null }[]
  >([]);

  function load() {
    api.getAdminCategories().then((r) => r.success && r.data && setCategories(r.data.categories));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.createCategory({
      name: String(form.get("name")),
      description: String(form.get("description") || "") || undefined,
    });
    e.currentTarget.reset();
    load();
  }

  async function seed() {
    await api.seedCategories();
    load();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold heading-gradient">Job categories</h1>
          <p className="text-sm text-muted-foreground font-body">Organize jobs by writing type.</p>
        </div>
        <Button size="sm" variant="outline" className="border-[rgba(255,215,0,0.3)] text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)]" onClick={seed}>
          Seed defaults
        </Button>
      </div>

      <form onSubmit={create} className="panel-split max-w-xl overflow-hidden">
        <div className="panel-split-header flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-[#FFD700]" />
          <h2 className="font-semibold">Add category</h2>
        </div>
        <div className="panel-split-body space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" placeholder="e.g. Academic Writing" required />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea name="description" rows={2} />
          </div>
          <Button type="submit" className="btn-premium">Create category</Button>
        </div>
      </form>

      <section className="panel-split overflow-hidden">
        <div className="panel-split-header">
          <h2 className="font-semibold">All categories ({categories.length})</h2>
        </div>
        <div className="panel-split-body">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories — seed defaults or create one.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.id} className="rounded-xl border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.05)] p-4">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">/{c.slug}</p>
                  {c.description && (
                    <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
