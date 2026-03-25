import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 允許的狀態轉換
const VALID_TRANSITIONS: Record<string, string[]> = {
  open: ["cancelled"],
  in_progress: ["completed"],
  completed: ["reviewed"],
};

// PATCH - 更新任務狀態
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;
  const { status: newStatus } = await request.json();

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    return NextResponse.json({ error: "任務不存在" }, { status: 404 });
  }

  if (task.posterId !== session.user.id) {
    return NextResponse.json({ error: "無權限更新此任務狀態" }, { status: 403 });
  }

  const allowed = VALID_TRANSITIONS[task.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `無法從 ${task.status} 轉換為 ${newStatus}` },
      { status: 400 }
    );
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json(updated);
}
