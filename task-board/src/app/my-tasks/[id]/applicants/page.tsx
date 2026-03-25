"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StarRating from "@/components/ui/StarRating";
import { ShieldCheck, Loader2, CheckCircle, XCircle } from "lucide-react";

type Applicant = {
  id: string;
  message: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    verificationStatus: string;
    avgRating: number | null;
    reviewCount: number;
  };
};

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tasks/${id}/applications`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApplicants(data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (appId: string, action: "accept" | "reject") => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      if (action === "accept") {
        setApplicants((prev) =>
          prev.map((a) => ({
            ...a,
            status: a.id === appId ? "accepted" : "rejected",
          }))
        );
      } else {
        setApplicants((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: "rejected" } : a))
        );
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">申請者管理</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#9C9B99]" size={32} />
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#9C9B99] shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
            目前沒有人申請此任務
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {app.user.avatarUrl ? (
                      <img src={app.user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#D89575]" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{app.user.name || "未命名"}</p>
                        {app.user.verificationStatus === "verified" && (
                          <ShieldCheck size={14} className="text-[#3D8A5A]" />
                        )}
                      </div>
                      {app.user.avgRating && (
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={app.user.avgRating} />
                          <span className="text-xs text-[#9C9B99]">({app.user.reviewCount})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#9C9B99]">
                    {new Date(app.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                </div>

                {app.message && (
                  <p className="text-sm text-[#6D6C6A] bg-[#F5F4F1] rounded-xl p-4">
                    {app.message}
                  </p>
                )}

                {app.status === "pending" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(app.id, "accept")}
                      className="flex-1 bg-[#3D8A5A] text-white py-2.5 rounded-xl font-semibold hover:bg-[#356F4A] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={16} />
                      選擇此人
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "reject")}
                      className="flex-1 bg-white border border-[#E5E4E2] text-[#6D6C6A] py-2.5 rounded-xl font-semibold hover:bg-[#F5F4F1] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={16} />
                      婉拒
                    </button>
                  </div>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "accepted"
                        ? "bg-[#C8F0D8] text-[#3D8A5A]"
                        : "bg-[#F0EFED] text-[#9C9B99]"
                    }`}
                  >
                    {app.status === "accepted" ? "已選定" : "已婉拒"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
