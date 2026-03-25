import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - 提交評價
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { taskId, rating, comment } = await request.json();

  if (!taskId || !rating) {
    return NextResponse.json(
      { error: "請填寫必填欄位" },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: "評分需為 1-5 的整數" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    return NextResponse.json({ error: "任務不存在" }, { status: 404 });
  }

  if (task.status !== "completed" && task.status !== "reviewed") {
    return NextResponse.json(
      { error: "僅已完成的任務可以評價" },
      { status: 400 }
    );
  }

  // 確認是任務的參與者
  const isParticipant =
    task.posterId === session.user.id || task.assigneeId === session.user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "您不是此任務的參與者" }, { status: 403 });
  }

  // 決定被評價者
  const revieweeId =
    task.posterId === session.user.id ? task.assigneeId! : task.posterId;

  // 防止重複評價
  const existing = await prisma.review.findUnique({
    where: { taskId_reviewerId: { taskId, reviewerId: session.user.id } },
  });

  if (existing) {
    return NextResponse.json({ error: "您已對此任務評價過" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      taskId,
      reviewerId: session.user.id,
      revieweeId,
      rating,
      comment,
    },
  });

  // 檢查雙方是否都已評價，若是則將任務狀態轉為 reviewed
  const reviewCount = await prisma.review.count({ where: { taskId } });
  if (reviewCount >= 2) {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "reviewed" },
    });
  }

  return NextResponse.json(review, { status: 201 });
}
