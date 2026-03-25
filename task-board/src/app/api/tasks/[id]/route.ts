import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TASK_CATEGORIES } from "@/lib/categories";

const validCategories: string[] = TASK_CATEGORIES.map((c) => c.value);

// GET - 取得單一任務詳情
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      poster: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          verificationStatus: true,
        },
      },
      assignee: {
        select: { id: true, name: true, avatarUrl: true },
      },
      _count: { select: { applications: true, reviews: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "任務不存在" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PUT - 編輯任務（僅 open 狀態可編輯）
export async function PUT(
  request: Request,
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
    return NextResponse.json({ error: "無權限編輯此任務" }, { status: 403 });
  }

  if (task.status !== "open") {
    return NextResponse.json(
      { error: "僅開放中的任務可以編輯" },
      { status: 400 }
    );
  }

  const { title, description, category, location, reward } = await request.json();

  const data: Record<string, unknown> = {};
  if (title) data.title = title;
  if (description) data.description = description;
  if (category) {
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "無效的任務分類" }, { status: 400 });
    }
    data.category = category;
  }
  if (location) data.location = location;
  if (reward != null) {
    if (typeof reward !== "number" || reward < 0) {
      return NextResponse.json({ error: "報酬金額無效" }, { status: 400 });
    }
    data.reward = reward;
  }

  const updated = await prisma.task.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE - 取消任務（僅 open 狀態可取消）
export async function DELETE(
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
    return NextResponse.json({ error: "無權限取消此任務" }, { status: 403 });
  }

  if (task.status !== "open") {
    return NextResponse.json(
      { error: "僅開放中的任務可以取消" },
      { status: 400 }
    );
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json(updated);
}
