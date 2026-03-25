import Link from "next/link";
import { MapPin } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  reward: number;
  createdAt: string;
}

export default function TaskCard({
  id,
  title,
  description,
  category,
  location,
  reward,
  createdAt,
}: TaskCardProps) {
  return (
    <Link href={`/tasks/${id}`}>
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(26,25,24,0.03)] hover:shadow-[0_4px_20px_rgba(26,25,24,0.08)] transition-shadow flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CategoryBadge category={category} />
          <span className="text-lg font-bold text-[#3D8A5A] tracking-tight">
            ${reward}
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-[#6D6C6A] line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between text-xs text-[#9C9B99]">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </span>
          <span>{createdAt}</span>
        </div>
      </div>
    </Link>
  );
}
