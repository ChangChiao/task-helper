export const TASK_CATEGORIES = [
  { value: "home", label: "居家", emoji: "🏠" },
  { value: "errand", label: "跑腿", emoji: "🏃" },
  { value: "queue", label: "排隊/等候", emoji: "⏰" },
  { value: "life", label: "生活", emoji: "🎒" },
  { value: "moving", label: "搬運", emoji: "💪" },
  { value: "other", label: "其他", emoji: "❓" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["value"];
