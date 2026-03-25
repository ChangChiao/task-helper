"use client";

import Navbar from "@/components/layout/Navbar";
import StarRating from "@/components/ui/StarRating";
import { ShieldCheck } from "lucide-react";

const MOCK_USER = {
  name: "王小明",
  bio: "熱心助人的大安區居民，擅長居家維修和各種生活任務。",
  verified: true,
  rating: 4.8,
  completedTasks: 28,
  inProgress: 5,
};

const MOCK_REVIEWS = [
  {
    id: "1",
    reviewerName: "張美玲",
    task: "代排演唱會門票",
    rating: 5,
    comment:
      "非常負責任！凌晨就到現場排隊，而且排到票之後馬上通知我，整個過程很安心。大推！",
    avatarColor: "#A8C4E0",
  },
  {
    id: "2",
    reviewerName: "陳小志",
    task: "幫忙遛狗 1 小時",
    rating: 4,
    comment:
      "很細心地照顧我的柴犬，還拍了很多照片回傳，下次還會找他幫忙！",
    avatarColor: "#E0C4A8",
  },
  {
    id: "3",
    reviewerName: "林佳穎",
    task: "幫忙打蟑螂",
    rating: 5,
    comment:
      "效率超高！10分鐘就搞定了，而且還很貼心地幫我檢查其他角落有沒有蟲。",
    avatarColor: "#C4E0A8",
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left - Profile */}
          <div className="w-full lg:w-[320px] space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(26,25,24,0.03)] text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#D89575] mx-auto" />
              <h2 className="text-[22px] font-bold tracking-tight">
                {MOCK_USER.name}
              </h2>
              {MOCK_USER.verified && (
                <div className="inline-flex items-center gap-1.5 bg-[#C8F0D8] text-[#3D8A5A] px-4 py-1.5 rounded-full text-xs font-semibold">
                  <ShieldCheck size={14} />
                  已實名認證
                </div>
              )}
              <div className="flex justify-center">
                <StarRating rating={MOCK_USER.rating} />
              </div>
              <p className="text-sm text-[#6D6C6A] leading-relaxed">
                {MOCK_USER.bio}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(26,25,24,0.03)] flex justify-around text-center">
              <div>
                <p className="text-[26px] font-bold tracking-tight">
                  {MOCK_USER.completedTasks}
                </p>
                <p className="text-xs text-[#9C9B99]">已完成</p>
              </div>
              <div>
                <p className="text-[26px] font-bold text-[#3D8A5A] tracking-tight">
                  {MOCK_USER.rating}
                </p>
                <p className="text-xs text-[#9C9B99]">平均評分</p>
              </div>
              <div>
                <p className="text-[26px] font-bold text-[#D89575] tracking-tight">
                  {MOCK_USER.inProgress}
                </p>
                <p className="text-xs text-[#9C9B99]">進行中</p>
              </div>
            </div>
          </div>

          {/* Right - Reviews */}
          <div className="flex-1 space-y-6">
            <h2 className="text-[22px] font-bold tracking-tight">
              收到的評價
            </h2>
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full"
                      style={{ backgroundColor: review.avatarColor }}
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {review.reviewerName}
                      </p>
                      <p className="text-xs text-[#9C9B99]">{review.task}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-[#6D6C6A] leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
