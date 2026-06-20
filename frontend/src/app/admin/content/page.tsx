"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const KEYS = [
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle" },
  { key: "hero_cta", label: "Hero button text" },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [key, setKey] = useState("custom_key");
  const [value, setValue] = useState("");

  useEffect(() => {
    api.getSiteContent().then((r) => r.success && r.data && setContent(r.data.content));
  }, []);

  async function save(k: string, v: string) {
    await api.upsertSiteContent({ key: k, value: v });
    const r = await api.getSiteContent();
    if (r.success && r.data) setContent(r.data.content);
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold heading-gradient">Homepage content</h1>
      <p className="text-sm text-muted-foreground font-body">
        Overrides appear on the public site when keys match.
      </p>

      <div className="space-y-4 max-w-xl">
        {KEYS.map((item) => (
          <div key={item.key} className="glass-premium rounded-xl p-4 space-y-2">
            <Label>{item.label}</Label>
            <Input
              defaultValue={content[item.key] ?? ""}
              onBlur={(e) => {
                if (e.target.value) save(item.key, e.target.value);
              }}
            />
          </div>
        ))}
      </div>

      <form
        className="glass-premium max-w-xl space-y-4 rounded-2xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save(key, value);
          setValue("");
        }}
      >
        <h2 className="font-semibold">Custom key</h2>
        <div className="space-y-2">
          <Label>Key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Value</Label>
          <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} />
        </div>
        <Button type="submit" className="btn-premium">Save</Button>
      </form>
    </div>
  );
}
