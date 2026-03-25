import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 查詢認證狀態
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      verificationStatus: true,
      verificationNote: true,
    },
  });

  return NextResponse.json(user);
}

// POST - 提交實名認證（上傳證件 URL）
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { documentUrl } = await request.json();

  if (!documentUrl) {
    return NextResponse.json(
      { error: "請上傳證件照片" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      verificationDocUrl: documentUrl,
      verificationStatus: "pending",
      verificationNote: null,
    },
  });

  return NextResponse.json({
    verificationStatus: user.verificationStatus,
  });
}
