import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 取得我的對話列表
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: session.user.id },
        { participant2Id: session.user.id },
      ],
    },
    include: {
      task: { select: { id: true, title: true } },
      participant1: { select: { id: true, name: true, avatarUrl: true } },
      participant2: { select: { id: true, name: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, senderId: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 整理回傳格式
  const result = conversations.map((conv) => {
    const otherUser =
      conv.participant1Id === session.user!.id ? conv.participant2 : conv.participant1;
    const lastMessage = conv.messages[0] || null;

    return {
      id: conv.id,
      taskTitle: conv.task.title,
      taskId: conv.task.id,
      otherUser,
      lastMessage: lastMessage
        ? { content: lastMessage.content, createdAt: lastMessage.createdAt, senderId: lastMessage.senderId }
        : null,
    };
  });

  return NextResponse.json(result);
}
