"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showValue = true,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.round(rating)
              ? "fill-[#D4A64A] text-[#D4A64A]"
              : "fill-[#E5E4E1] text-[#E5E4E1]"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-[#1A1918] ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
