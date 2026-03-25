"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CategoryBadge from "@/components/ui/CategoryBadge";
import StarRating from "@/components/ui/StarRating";
import { MapPin, Clock3, Loader2, Star } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  reward: number;
  status: string;
  createdAt: string;
  poster: { id: string; name: string | null; avatarUrl: string | null; verificationStatus: string };
  assignee: { id: string; name: string | null; avatarUrl: string | null } | null;
  _count: { applications: number; reviews: number };
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "招募中", color: "text-[#3D8A5A]", bg: "bg-[#E8F5E9]" },
  in_progress: { label: "進行中", color: "text-[#B8860B]", bg: "bg-[#FFF8E1]" },
  completed: { label: "已完成", color: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
  reviewed: { label: "已評價", color: "text-[#6D6C6A]", bg: "bg-[#F0EFED]" },
  cancelled: { label: "已取消", color: "text-[#D32F2F]", bg: "bg-[#FFE0E0]" },
};

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    fetch(`/api/tasks/${id}`)
      .then((r) => r.json())
      .then(setTask)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!task) return;
    setApplying(true);
    const res = await fetch(`/api/tasks/${task.id}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: applyMessage }),
    });
    if (res.ok) {
      setApplied(true);
      setShowApplyForm(false);
    }
    setApplying(false);
  };

  const handleReview = async () => {
    if (!task || reviewRating === 0) return;
    setSubmittingReview(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, rating: reviewRating, comment: reviewComment }),
    });
    if (res.ok) {
      setReviewed(true);
      setShowReviewForm(false);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#9C9B99]" size={32} />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-16 py-20 text-center text-[#9C9B99]">
          任務不存在
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[task.status];
  const timeAgo = new Date(task.createdAt).toLocaleDateString("zh-TW");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left - Task Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <CategoryBadge category={task.category} />
              {statusInfo && (
                <span className={`px-4 py-1.5 rounded-full ${statusInfo.bg} ${statusInfo.color} text-[13px] font-semibold`}>
                  {statusInfo.label}
                </span>
              )}
            </div>

            <h1 className="text-[32px] font-bold tracking-tight">{task.title}</h1>

            <p className="text-[26px] font-bold text-[#3D8A5A] tracking-tight">
              NT$ {task.reward.toLocaleString()}
            </p>

            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold">任務描述</h3>
              <p className="text-[15px] text-[#6D6C6A] leading-relaxed">{task.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div className="space-y-1">
                <span className="text-[13px] text-[#9C9B99] font-medium">地點</span>
                <div className="flex items-center gap-1 text-[15px] font-medium">
                  <MapPin size={16} />{task.location}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#9C9B99] font-medium">發布時間</span>
                <div className="flex items-center gap-1 text-[15px] font-medium">
                  <Clock3 size={16} />{timeAgo}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#9C9B99] font-medium">申請人數</span>
                <p className="text-[15px] font-medium">{task._count.applications} 人已申請</p>
              </div>
            </div>

            {/* 申請接案 */}
            {task.status === "open" && !applied && (
              <>
                {!showApplyForm ? (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="bg-[#3D8A5A] text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-[#357A4E] transition-colors"
                  >
                    申請接案
                  </button>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E4E1] space-y-4">
                    <h3 className="text-[15px] font-semibold">寫一段自我推薦訊息</h3>
                    <textarea
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      placeholder="告訴發案者你為什麼適合這個任務..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] text-[15px] outline-none focus:border-[#3D8A5A] transition-colors resize-none placeholder:text-[#9C9B99]"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="bg-[#3D8A5A] text-white px-6 py-2.5 rounded-xl text-[15px] font-semibold hover:bg-[#357A4E] transition-colors disabled:opacity-50"
                      >
                        {applying ? "送出中..." : "送出申請"}
                      </button>
                      <button
                        onClick={() => setShowApplyForm(false)}
                        className="border border-[#D1D0CD] px-6 py-2.5 rounded-xl text-[15px] font-semibold hover:bg-[#FAFAF8] transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {applied && (
              <div className="bg-[#C8F0D8] text-[#3D8A5A] px-6 py-3 rounded-xl text-[15px] font-semibold">
                已成功送出申請！
              </div>
            )}

            {/* 評價入口 - 僅在 completed 狀態顯示 */}
            {task.status === "completed" && !reviewed && (
              <>
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-[#D89575] text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-[#C4845E] transition-colors flex items-center gap-2"
                  >
                    <Star size={18} />
                    為此任務評價
                  </button>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E4E1] space-y-4">
                    <h3 className="text-[15px] font-semibold">評價</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1 ${star <= reviewRating ? "text-yellow-400" : "text-[#D5D4D2]"}`}
                        >
                          <Star size={28} fill={star <= reviewRating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="分享您的合作體驗..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] text-[15px] outline-none focus:border-[#D89575] transition-colors resize-none placeholder:text-[#9C9B99]"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleReview}
                        disabled={submittingReview || reviewRating === 0}
                        className="bg-[#D89575] text-white px-6 py-2.5 rounded-xl text-[15px] font-semibold hover:bg-[#C4845E] transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? "送出中..." : "送出評價"}
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="border border-[#D1D0CD] px-6 py-2.5 rounded-xl text-[15px] font-semibold hover:bg-[#FAFAF8] transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {reviewed && (
              <div className="bg-[#FFF8E1] text-[#B8860B] px-6 py-3 rounded-xl text-[15px] font-semibold">
                感謝您的評價！
              </div>
            )}
          </div>

          {/* Right - Poster Info */}
          <div className="w-full lg:w-[360px] space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-4">
              <h3 className="text-[15px] font-semibold">發案者</h3>
              <div className="flex items-center gap-3">
                {task.poster.avatarUrl ? (
                  <img src={task.poster.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D89575]" />
                )}
                <div>
                  <p className="text-[15px] font-semibold">{task.poster.name || "未命名"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
