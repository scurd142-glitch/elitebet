"use client";

import { useEffect, useState } from "react";
import { Calendar, DollarSign } from "lucide-react";
import { api } from "@/lib/api";

interface AdminJob {
  id: string;
  title: string;
  description: string;
  category: string | { id: string; name: string; slug: string };
  budget?: number;
  payout?: number;
  currency?: string;
  status: string;
  deadline?: string | null;
  createdAt: string;
  assignments?: any[];
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.getOpenJobs();
      if (res.success && res.data) {
        setJobs(res.data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to complete this job and pay the writer?")) return;
    try {
      const res = await api.completeJob(jobId);
      if (res.success) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Failed to complete job:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: {
        background: "rgba(16, 185, 129, 0.1)",
        color: "#10B981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
      },
      ASSIGNED: {
        background: "rgba(59, 130, 246, 0.1)",
        color: "#3B82F6",
        border: "1px solid rgba(59, 130, 246, 0.3)",
      },
      IN_PROGRESS: {
        background: "rgba(245, 158, 11, 0.1)",
        color: "#F59E0B",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      },
      COMPLETED: {
        background: "rgba(139, 92, 246, 0.1)",
        color: "#8B5CF6",
        border: "1px solid rgba(139, 92, 246, 0.3)",
      },
      CANCELLED: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
    };

    const style = styles[status as keyof typeof styles] || styles.OPEN;

    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={style}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ color: "#A8BFAE" }}>
          Loading jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#F0EAD6" }}>
          Jobs Management
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#A8BFAE" }}>
          View and manage job submissions
        </p>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#234A37", borderColor: "#3A5F4A" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(35, 74, 55, 0.8)" }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Deadline
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFAE" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b"
                  style={{ borderColor: "rgba(58, 95, 74, 0.3)" }}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium" style={{ color: "#F0EAD6" }}>
                      {job.title}
                    </div>
                    <div className="text-sm truncate max-w-xs" style={{ color: "#A8BFAE" }}>
                      {job.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "#F0EAD6" }}>
                      {typeof job.category === "string" ? job.category : (job.category as any)?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" style={{ color: "#C9A227" }} />
                      <span className="text-sm font-medium" style={{ color: "#F0EAD6" }}>
                        ${(job.budget || job.payout || 0).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4">
                    {job.deadline ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: "#A8BFAE" }} />
                        <span className="text-sm" style={{ color: "#F0EAD6" }}>
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm" style={{ color: "#A8BFAE" }}>
                        No deadline
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.status === "SUBMITTED" && (
                      <button
                        onClick={() => handleCompleteJob(job.id)}
                        className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        style={{ background: "#C9A227", color: "#1B3A2B" }}
                      >
                        Complete & Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
