"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<
    {
      id: string;
      title: string;
      status: string;
      payout: number;
      assignments: {
        id: string;
        status: string;
        submissionText?: string | null;
        user: { fullName: string; username: string };
      }[];
    }[]
  >([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  function load() {
    api.getAdminJobs().then((r) => r.success && r.data && setJobs(r.data.jobs));
    api.getJobCategories().then((r) => r.success && r.data && setCategories(r.data.categories));
  }

  useEffect(() => {
    load();
  }, []);

  async function createJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.createJob({
      title: String(form.get("title")),
      description: String(form.get("description")),
      categoryId: String(form.get("categoryId")),
      payout: Number(form.get("payout")),
    });
    setShowForm(false);
    load();
  }

  async function complete(id: string) {
    const r = await api.completeJob(id);
    alert(r.success ? "Job completed and writer paid" : r.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold heading-gradient">Jobs</h1>
        <Button size="sm" className="btn-premium" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create job"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={createJob} className="glass-premium max-w-xl space-y-4 rounded-2xl p-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              name="categoryId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Payout (KES)</Label>
            <Input name="payout" type="number" min={1} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" rows={4} required />
          </div>
          <Button type="submit" className="btn-premium">Publish job</Button>
        </form>
      )}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="glass-premium rounded-2xl p-5">
            <div className="flex justify-between gap-2">
              <h2 className="font-semibold">{job.title}</h2>
              <Badge>{job.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-[#FFD700] font-mono">KES {job.payout.toFixed(2)}</p>
            {job.assignments.map((a) => (
              <div key={a.id} className="mt-4 border-t border-border pt-4 text-sm">
                <p>
                  Writer: {a.user.fullName} —{" "}
                  <Badge variant={a.status === "COMPLETED" ? "active" : a.status === "SUBMITTED" ? "pending" : "outline"}>{a.status}</Badge>
                </p>
                {a.submissionText && (
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                    {a.submissionText}
                  </p>
                )}
                {a.status === "SUBMITTED" && (
                  <Button size="sm" className="mt-2 btn-premium" onClick={() => complete(job.id)}>
                    Approve & pay writer
                  </Button>
                )}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
