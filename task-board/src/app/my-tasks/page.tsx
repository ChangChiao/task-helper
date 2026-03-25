"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { MapPin, Users, Loader2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  category: string;
  location: string;
  reward: number;
  status: string;
  createdAt: string;
  assignee: { id: string; name: string | null; avatarUrl: string | null } | null;
  _count: { applications: number };
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "開放中", color: "text-[#3D8A5A]", bg: "bg-[#C8F0D8]" },
  in_progress: { label: "進行中", color: "text-[#B8860B]", bg: "bg-[#FFF8E1]" },
  completed: { label: "已完成", color: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
  reviewed: { label: "已評價", color: "text-[#6D6C6A]", bg: "bg-[#F0EFED]" },
  cancelled: { label: "已取消", color: "text-[#D32F2F]", bg: "bg-[#FFE0E0]" },
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/my-tasks")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTasks(data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">我的任務</h1>
          <Link
            href="/tasks/new"
            className="bg-[#3D8A5A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#356F4A] transition-colors"
          >
            發布新任務
          </Link>
        </div>

        {/* 篩選 */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { value: "all", label: "全部" },
            { value: "open", label: "開放中" },
            { value: "in_progress", label: "進行中" },
            { value: "completed", label: "已完成" },
            { value: "reviewed", label: "已評價" },
            { value: "cancelled", label: "已取消" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? "bg-[#1A1918] text-white"
                  : "bg-white border border-[#E5E4E2] text-[#6D6C6A] hover:bg-[#F5F4F1]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#9C9B99]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#9C9B99] shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
            {filter === "all" ? "您還沒有發布任何任務" : "沒有符合篩選條件的任務"}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => {
              const status = STATUS_LABELS[task.status];
              return (
                <Link key={task.id} href={task.status === "open" ? `/my-tasks/${task.id}/applicants` : `/tasks/${task.id}`}>
                  <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(26,25,24,0.03)] hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={task.category} />
                        <h3 className="font-semibold">{task.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#9C9B99]">
                        <span className="flex items-center gap-1"><MapPin size={12} />{task.location}</span>
                        <span className="flex items-center gap-1"><Users size={12} />{task._count.applications} 人申請</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1.5">
                      <p className="font-bold text-[#D89575]">NT$ {task.reward.toLocaleString()}</p>
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
