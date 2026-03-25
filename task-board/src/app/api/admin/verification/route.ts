import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 取得待審核列表
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  // 簡易管理員驗證：透過 email 判斷（可日後改為 role 欄位）
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  if (!user || !adminEmails.includes(user.email)) {
    return NextResponse.json({ error: "無管理員權限" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") || "pending";

  const users = await prisma.user.findMany({
    where: { verificationStatus: status as "pending" | "verified" | "rejected" },
    select: {
      id: true,
      name: true,
      email: true,
      verificationStatus: true,
      verificationDocUrl: true,
      verificationNote: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

// PATCH - 審核認證（通過/拒絕）
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  if (!admin || !adminEmails.includes(admin.email)) {
    return NextResponse.json({ error: "無管理員權限" }, { status: 403 });
  }

  const { userId, action, note } = await request.json();

  if (!userId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "參數錯誤" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: action === "approve" ? "verified" : "rejected",
      verificationNote: note || null,
    },
  });

  return NextResponse.json({
    id: updated.id,
    verificationStatus: updated.verificationStatus,
  });
}
