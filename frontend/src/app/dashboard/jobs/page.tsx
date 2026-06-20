"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { JobItem, JobAssignmentItem } from "@/types/user";

export default function JobsPage() {
  const [tab, setTab] = useState<"browse" | "mine">("browse");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [mine, setMine] = useState<JobAssignmentItem[]>([]);
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [submission, setSubmission] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function load() {
    api.getOpenJobs().then((r) => r.success && r.data && setJobs(r.data.jobs));
    api.getMyJobs().then((r) => r.success && r.data && setMine(r.data.assignments));
  }

  useEffect(() => {
    load();
  }, []);

  async function accept(id: string) {
    setMsg(null);
    const r = await api.acceptJob(id);
    setMsg(r.success ? "Job accepted!" : r.message ?? "Failed");
    load();
    setTab("mine");
  }

  async function submit(jobId: string) {
    setMsg(null);
    const r = await api.submitJob(jobId, submission);
    setMsg(r.success ? "Submitted for review!" : r.message ?? "Failed");
    setSubmitId(null);
    setSubmission("");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold heading-gradient">Writing jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          Browse open jobs or manage your active work.
        </p>
      </div>

      {msg && <p className="text-sm text-[#FFD700]">{msg}</p>}

      <div className="flex gap-2">
        <Button
          variant={tab === "browse" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("browse")}
        >
          Open jobs
        </Button>
        <Button
          variant={tab === "mine" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("mine")}
        >
          My jobs
        </Button>
      </div>

      {tab === "browse" && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No open jobs right now. Check back soon.
            </p>
          ) : (
            jobs.map((job) => (
              <article key={job.id} className="glass-premium rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="mb-2 border-[rgba(255,215,0,0.3)] text-[#FFD700]">
                      {job.category.name}
                    </Badge>
                    <h2 className="font-semibold">{job.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#FFD700] font-mono">
                    KES {job.payout.toFixed(2)}
                  </p>
                </div>
                <Button className="mt-4 btn-premium" size="sm" onClick={() => accept(job.id)}>
                  Accept job
                </Button>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-4">
          {mine.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not accepted any jobs yet.
            </p>
          ) : (
            mine.map((a) => (
              <article key={a.id} className="glass-premium rounded-2xl p-5">
                <div className="flex justify-between gap-2">
                  <h2 className="font-semibold">{a.job.title}</h2>
                  <Badge variant={a.status === "COMPLETED" ? "active" : a.status === "SUBMITTED" ? "pending" : "outline"} className={a.status === "IN_PROGRESS" ? "border-[rgba(255,215,0,0.3)] text-[#FFD700]" : ""}>{a.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground font-mono">
                  KES {a.job.payout.toFixed(2)}
                </p>
                {a.status === "IN_PROGRESS" && (
                  <div className="mt-4 space-y-3">
                    {submitId === a.job.id ? (
                      <>
                        <Label>Your submission</Label>
                        <Textarea
                          value={submission}
                          onChange={(e) => setSubmission(e.target.value)}
                          rows={6}
                          placeholder="Paste your completed work here (min 20 characters)…"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="btn-premium" onClick={() => submit(a.job.id)}>
                            Submit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSubmitId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button size="sm" className="btn-premium" onClick={() => setSubmitId(a.job.id)}>
                        Submit work
                      </Button>
                    )}
                  </div>
                )}
                {a.status === "SUBMITTED" && (
                  <p className="mt-2 text-sm text-[#7B68EE]">
                    Awaiting admin approval
                  </p>
                )}
                {a.status === "COMPLETED" && (
                  <p className="mt-2 text-sm text-[#00C896]">
                    Completed — payment added to wallet
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
