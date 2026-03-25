"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { TASK_CATEGORIES } from "@/lib/categories";

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reward, setReward] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call create task API
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl p-10 shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
          <h1 className="text-[26px] font-bold tracking-tight mb-2">
            發布新任務
          </h1>
          <p className="text-[15px] text-[#6D6C6A] mb-8">
            填寫以下資訊，讓接案者了解你的需求
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">任務標題</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：幫忙打蟑螂"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">任務分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors text-[#9C9B99] data-[selected]:text-[#1A1918]"
              >
                <option value="">請選擇分類</option>
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">任務描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細描述你的任務需求..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors resize-none placeholder:text-[#9C9B99]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">執行地點</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例如：台北市大安區"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">報酬金額</label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="例如：500"
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D8A5A] text-white py-3 rounded-xl text-base font-semibold hover:bg-[#357A4E] transition-colors"
            >
              發布任務
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
