import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 取得對話訊息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;

  // 驗證存取權限
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: { participant1Id: true, participant2Id: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "對話不存在" }, { status: 404 });
  }

  if (
    conversation.participant1Id !== session.user.id &&
    conversation.participant2Id !== session.user.id
  ) {
    return NextResponse.json({ error: "無權限存取此對話" }, { status: 403 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = 30;

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  return NextResponse.json({
    messages: messages.reverse(),
    nextCursor: hasMore ? messages[0]?.id : null,
  });
}

// POST - 發送訊息
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;

  // 驗證存取權限
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: { participant1Id: true, participant2Id: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "對話不存在" }, { status: 404 });
  }

  if (
    conversation.participant1Id !== session.user.id &&
    conversation.participant2Id !== session.user.id
  ) {
    return NextResponse.json({ error: "無權限存取此對話" }, { status: 403 });
  }

  const { content } = await request.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "訊息不能為空" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: session.user.id,
      content: content.trim(),
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
