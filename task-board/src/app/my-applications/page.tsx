"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { MapPin, Loader2 } from "lucide-react";

type Application = {
  id: string;
  message: string | null;
  status: string;
  createdAt: string;
  task: {
    id: string;
    title: string;
    category: string;
    location: string;
    reward: number;
    status: string;
    poster: { id: string; name: string | null };
  };
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "審核中", color: "text-[#B8860B]", bg: "bg-[#FFF8E1]" },
  accepted: { label: "已錄取", color: "text-[#3D8A5A]", bg: "bg-[#C8F0D8]" },
  rejected: { label: "未錄取", color: "text-[#9C9B99]", bg: "bg-[#F0EFED]" },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-applications")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApplications(data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">我的申請</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#9C9B99]" size={32} />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#9C9B99] shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
            您還沒有申請任何任務
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const status = STATUS_LABELS[app.status];
              return (
                <Link key={app.id} href={`/tasks/${app.task.id}`}>
                  <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(26,25,24,0.03)] hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={app.task.category} />
                        <h3 className="font-semibold">{app.task.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#9C9B99]">
                        <span className="flex items-center gap-1"><MapPin size={12} />{app.task.location}</span>
                        <span>發案者：{app.task.poster.name || "未命名"}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1.5">
                      <p className="font-bold text-[#D89575]">NT$ {app.task.reward.toLocaleString()}</p>
                      {status && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
