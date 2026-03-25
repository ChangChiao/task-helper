"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TaskCard from "@/components/ui/TaskCard";
import { TASK_CATEGORIES } from "@/lib/categories";

const MOCK_TASKS = [
  {
    id: "1",
    title: "幫忙打蟑螂",
    description: "家裡出現蟑螂，需要有人來幫忙處理，大約需要30分鐘。",
    category: "home",
    location: "台北市大安區",
    reward: 500,
    createdAt: "2 小時前",
  },
  {
    id: "2",
    title: "幫忙買晚餐",
    description:
      "在信義區上班，需要有人幫忙到附近買便當送到辦公室，大約15分鐘路程。",
    category: "errand",
    location: "台北市信義區",
    reward: 300,
    createdAt: "30 分鐘前",
  },
  {
    id: "3",
    title: "代排演唱會門票",
    description:
      "下週六早上6點開始排隊，預計排到10點開賣，需要有經驗的排隊高手。",
    category: "queue",
    location: "台北市中山區",
    reward: 1200,
    createdAt: "1 小時前",
  },
  {
    id: "4",
    title: "幫忙遛狗 1 小時",
    description:
      "柴犬一隻，個性溫和，需要在公園散步一小時，會提供牽繩和水。",
    category: "life",
    location: "台北市松山區",
    reward: 200,
    createdAt: "3 小時前",
  },
  {
    id: "5",
    title: "搬家搬重物",
    description:
      "從四樓公寓搬到一樓，大約10箱物品加一張書桌，需要兩個人力。",
    category: "moving",
    location: "新北市板橋區",
    reward: 800,
    createdAt: "5 小時前",
  },
  {
    id: "6",
    title: "浴室水管疏通",
    description:
      "浴室排水孔堵塞，水流很慢，需要有經驗的人來處理疏通。",
    category: "home",
    location: "台北市中正區",
    reward: 400,
    createdAt: "昨天",
  },
];

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  const filteredTasks = MOCK_TASKS.filter((task) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(task.category);
    const matchesSearch =
      !searchQuery ||
      task.title.includes(searchQuery) ||
      task.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="text-center py-8 sm:py-12 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight mb-4">
          找人幫忙？還是想接案賺外快？
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6D6C6A] mb-6">
          快幫手是你的生活任務媒合平台，輕鬆發案、快速接案
        </p>
        <div className="max-w-xl mx-auto relative">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-[#E5E4E1] shadow-[0_2px_12px_rgba(26,25,24,0.03)]">
            <Search size={20} className="text-[#9C9B99]" />
            <input
              type="text"
              placeholder="搜尋任務... 例如：打蟑螂、跑腿、夜排"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[15px] bg-transparent placeholder:text-[#9C9B99]"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              selectedCategories.length === 0
                ? "bg-[#3D8A5A] text-white"
                : "bg-white text-[#6D6C6A] border border-[#E5E4E1] hover:border-[#D1D0CD]"
            }`}
          >
            全部
          </button>
          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                selectedCategories.includes(cat.value)
                  ? "bg-[#3D8A5A] text-white"
                  : "bg-white text-[#6D6C6A] border border-[#E5E4E1] hover:border-[#D1D0CD]"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#9C9B99]">
            <p className="text-lg">沒有找到相關任務</p>
            <p className="text-sm mt-2">試試其他關鍵字或分類</p>
          </div>
        )}
      </section>
    </div>
  );
}
