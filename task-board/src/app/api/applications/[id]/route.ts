import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - 選擇接案者（接受一位，自動拒絕其餘）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await request.json();

  const application = await prisma.application.findUnique({
    where: { id },
    include: { task: true },
  });

  if (!application) {
    return NextResponse.json({ error: "申請不存在" }, { status: 404 });
  }

  if (application.task.posterId !== session.user.id) {
    return NextResponse.json({ error: "無權限操作此申請" }, { status: 403 });
  }

  if (application.status !== "pending") {
    return NextResponse.json({ error: "此申請已被處理" }, { status: 400 });
  }

  if (action === "accept") {
    // 接受此申請者，拒絕其餘，任務轉 in_progress
    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: { status: "accepted" },
      }),
      prisma.application.updateMany({
        where: { taskId: application.taskId, id: { not: id } },
        data: { status: "rejected" },
      }),
      prisma.task.update({
        where: { id: application.taskId },
        data: {
          status: "in_progress",
          assigneeId: application.userId,
        },
      }),
      // 自動建立對話
      prisma.conversation.create({
        data: {
          taskId: application.taskId,
          participant1Id: application.task.posterId,
          participant2Id: application.userId,
        },
      }),
    ]);

    return NextResponse.json({ message: "已選定接案者" });
  }

  if (action === "reject") {
    await prisma.application.update({
      where: { id },
      data: { status: "rejected" },
    });
    return NextResponse.json({ message: "已拒絕此申請" });
  }

  return NextResponse.json({ error: "無效的操作" }, { status: 400 });
}
