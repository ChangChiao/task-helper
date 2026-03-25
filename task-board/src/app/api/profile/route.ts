import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 取得個人資料
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

// PUT - 更新個人資料
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { name, bio, avatarUrl } = await request.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "姓名不能為空" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      bio: bio?.trim() || null,
      avatarUrl: avatarUrl || undefined,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
    },
  });

  return NextResponse.json(updated);
}
