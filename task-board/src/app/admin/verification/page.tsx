"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

type PendingUser = {
  id: string;
  name: string | null;
  email: string;
  verificationStatus: string;
  verificationDocUrl: string | null;
  verificationNote: string | null;
  createdAt: string;
};

export default function AdminVerificationPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/verification?status=pending")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/verification", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, note: notes[userId] }),
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">實名認證審核</h1>

        {loading ? (
          <p className="text-[#9C9B99]">載入中...</p>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#9C9B99] shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
            目前沒有待審核的認證申請
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{user.name || "未命名"}</p>
                    <p className="text-sm text-[#9C9B99]">{user.email}</p>
                  </div>
                  <p className="text-xs text-[#9C9B99]">
                    {new Date(user.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                </div>

                {user.verificationDocUrl && (
                  <a
                    href={user.verificationDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#3D8A5A] hover:underline"
                  >
                    <ExternalLink size={14} />
                    查看證件照片
                  </a>
                )}

                <input
                  type="text"
                  placeholder="備註（選填）"
                  value={notes[user.id] || ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [user.id]: e.target.value }))}
                  className="w-full border border-[#E5E4E2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D8A5A]"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(user.id, "approve")}
                    className="flex-1 bg-[#3D8A5A] text-white py-2.5 rounded-xl font-semibold hover:bg-[#356F4A] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={16} />
                    通過
                  </button>
                  <button
                    onClick={() => handleAction(user.id, "reject")}
                    className="flex-1 bg-white border border-[#E5E4E2] text-[#D32F2F] py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={16} />
                    拒絕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
