import { TASK_CATEGORIES } from "@/lib/categories";

const categoryColors: Record<string, { bg: string; text: string }> = {
  home: { bg: "bg-[#C8F0D8]", text: "text-[#3D8A5A]" },
  errand: { bg: "bg-[#C8F0D8]", text: "text-[#3D8A5A]" },
  queue: { bg: "bg-[#FFF0E0]", text: "text-[#D89575]" },
  life: { bg: "bg-[#E8E0F8]", text: "text-[#7C5CBF]" },
  moving: { bg: "bg-[#FFECD2]", text: "text-[#C07830]" },
  other: { bg: "bg-[#EDECEA]", text: "text-[#6D6C6A]" },
};

export default function CategoryBadge({ category }: { category: string }) {
  const cat = TASK_CATEGORIES.find((c) => c.value === category);
  const colors = categoryColors[category] || categoryColors.other;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {cat ? `${cat.emoji} ${cat.label}` : category}
    </span>
  );
}
