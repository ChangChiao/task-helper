import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TASK_CATEGORIES } from "@/lib/categories";

const validCategories: string[] = TASK_CATEGORIES.map((c) => c.value);

// GET - 取得任務列表（分頁、排序、篩選）
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort") || "newest";

  const where: Record<string, unknown> = { status: "open" };

  if (category) {
    const categories = category.split(",").filter((c) => validCategories.includes(c));
    if (categories.length > 0) {
      where.category = { in: categories };
    }
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "reward_high"
      ? { reward: "desc" as const }
      : sort === "reward_low"
        ? { reward: "asc" as const }
        : { createdAt: "desc" as const };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        poster: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return NextResponse.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST - 發布新任務
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  // 驗證實名認證狀態
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verificationStatus: true },
  });

  if (user?.verificationStatus !== "verified") {
    return NextResponse.json(
      { error: "需要完成實名認證才能發布任務" },
      { status: 403 }
    );
  }

  const { title, description, category, location, reward } = await request.json();

  if (!title || !description || !category || !location || reward == null) {
    return NextResponse.json(
      { error: "請填寫所有必填欄位" },
      { status: 400 }
    );
  }

  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { error: "無效的任務分類" },
      { status: 400 }
    );
  }

  if (typeof reward !== "number" || reward < 0) {
    return NextResponse.json(
      { error: "報酬金額無效" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      category,
      location,
      reward,
      posterId: session.user.id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
