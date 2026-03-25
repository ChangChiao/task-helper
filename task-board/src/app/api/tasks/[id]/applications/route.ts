import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 取得某任務的申請者列表（發案者用）
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "任務不存在" }, { status: 404 });
  }

  if (task.posterId !== session.user.id) {
    return NextResponse.json({ error: "無權限查看申請者" }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    where: { taskId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          verificationStatus: true,
          reviewsReceived: {
            select: { rating: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 計算每位申請者的平均評分
  const result = applications.map((app) => {
    const ratings = app.user.reviewsReceived;
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;
    const { reviewsReceived, ...userData } = app.user;
    return {
      ...app,
      user: {
        ...userData,
        avgRating,
        reviewCount: reviewsReceived.length,
      },
    };
  });

  return NextResponse.json(result);
}

// POST - 申請接案
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;

  // 驗證實名認證
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verificationStatus: true },
  });

  if (user?.verificationStatus !== "verified") {
    return NextResponse.json(
      { error: "需要完成實名認證才能申請接案" },
      { status: 403 }
    );
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "任務不存在" }, { status: 404 });
  }

  if (task.status !== "open") {
    return NextResponse.json({ error: "此任務已不開放申請" }, { status: 400 });
  }

  // 防止自己申請自己的任務
  if (task.posterId === session.user.id) {
    return NextResponse.json(
      { error: "不能申請自己發布的任務" },
      { status: 400 }
    );
  }

  // 防止重複申請
  const existing = await prisma.application.findUnique({
    where: { taskId_userId: { taskId: id, userId: session.user.id } },
  });

  if (existing) {
    return NextResponse.json({ error: "您已申請過此任務" }, { status: 400 });
  }

  const { message } = await request.json();

  const application = await prisma.application.create({
    data: {
      taskId: id,
      userId: session.user.id,
      message,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
