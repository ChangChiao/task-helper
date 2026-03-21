## Context

建立一個全新的短期任務媒合看板 Web 應用。平台有兩種角色——發案者與接案者。發案者發布生活類短期任務（打蟑螂、跑腿、夜排等），接案者瀏覽並申請，發案者從申請者中選人，雙方透過站內訊息溝通，完成後雙向互評。

目前無既有系統，從零開始建構。

## Goals / Non-Goals

**Goals:**
- 建立完整的任務發布、申請、媒合、溝通、評價流程
- 實名認證確保平台安全與信任
- 站內即時訊息讓雙方不需交換私人聯絡方式
- MVP 快速上線驗證市場需求

**Non-Goals:**
- 不處理金流（報酬由雙方私下處理）
- 不做地理位置篩選（第二版）
- 不做急件標記功能（第二版）
- 不做推播通知（第二版）
- 不做 Mobile App（先做 Web）

## Decisions

### 1. 全棧框架：Next.js App Router

**選擇**：Next.js 14+ with App Router
**替代方案**：
- Remix — 社群較小，生態系不如 Next.js 完整
- SPA (React + Express) — 需維護兩個專案，SEO 較差

**理由**：前後端統一語言（TypeScript），App Router 支援 Server Components 提升效能，API Routes 可直接處理後端邏輯，Vercel 部署零配置。

### 2. ORM：Prisma

**選擇**：Prisma
**替代方案**：
- Drizzle — 更輕量但生態系較新
- TypeORM — TypeScript 支援不如 Prisma 完善

**理由**：型別安全、自動產生 migration、schema 即文件，適合快速開發。

### 3. 資料庫：PostgreSQL (Neon)

**選擇**：Neon 免費方案
**替代方案**：
- Supabase PostgreSQL — 免費方案也不錯，但我們不需要 Supabase 的其他功能
- PlanetScale (MySQL) — 已不提供免費方案

**理由**：免費 500MB 儲存，支援 branching，serverless 架構與 Vercel 搭配佳。

### 4. 認證：NextAuth.js

**選擇**：NextAuth.js (Auth.js v5)
**替代方案**：
- Clerk — 功能強大但有使用量限制
- 自建 JWT — 開發成本高，容易有安全漏洞

**理由**：與 Next.js 深度整合，支援多種 Provider（Email/Google），免費開源。實名認證部分為自建流程（上傳證件 + 管理員審核）。

### 5. 即時訊息：Socket.io

**選擇**：Socket.io
**替代方案**：
- Server-Sent Events — 單向通訊，不適合聊天
- Pusher — 免費方案有連線數限制

**理由**：雙向即時通訊，自動重連，房間(room)機制適合一對一對話。需額外部署 Socket.io server（可用 Render 免費方案）。

### 6. 檔案上傳：Cloudinary

**選擇**：Cloudinary
**替代方案**：
- AWS S3 — 設定複雜，小量使用仍可能產生費用
- Uploadthing — 較新，社群較小

**理由**：免費 25GB 儲存 + 25GB 頻寬/月，內建圖片轉換與優化，SDK 簡潔。

### 7. 資料模型設計

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│   User   │────▶│     Task     │◀────│Application│
│          │     │              │     │          │
│ id       │     │ id           │     │ id       │
│ email    │     │ title        │     │ taskId   │
│ name     │     │ description  │     │ userId   │
│ role     │     │ category     │     │ message  │
│ verified │     │ location     │     │ status   │
│ avatarUrl│     │ reward       │     │ createdAt│
│ createdAt│     │ status       │     └──────────┘
└──────┬───┘     │ posterId     │
       │         │ assigneeId   │     ┌──────────┐
       │         │ createdAt    │     │  Review  │
       │         └──────────────┘     │          │
       │                              │ id       │
       │         ┌──────────────┐     │ taskId   │
       └────────▶│   Message    │     │ reviewerId│
                 │              │     │ revieweeId│
                 │ id           │     │ rating   │
                 │ conversationId│    │ comment  │
                 │ senderId     │     │ createdAt│
                 │ content      │     └──────────┘
                 │ createdAt    │
                 └──────────────┘
                        ▲
                 ┌──────────────┐
                 │ Conversation │
                 │              │
                 │ id           │
                 │ taskId       │
                 │ participant1 │
                 │ participant2 │
                 │ createdAt    │
                 └──────────────┘
```

### 8. 任務狀態流程

```
  open ──▶ in_progress ──▶ completed
   │                          │
   ▼                          ▼
 cancelled                 reviewed
```

- **open**：已發布，接受申請中
- **in_progress**：已選定接案者，任務進行中
- **completed**：任務完成，等待評價
- **reviewed**：雙方已互評
- **cancelled**：發案者取消任務

## Risks / Trade-offs

| 風險 | 緩解方式 |
|------|---------|
| Socket.io 需獨立部署，Vercel 不支援長連線 | 使用 Render 免費方案部署 Socket.io server |
| Neon 免費方案冷啟動延遲 | 可接受，MVP 階段優先降低成本 |
| 實名認證為人工審核，不具即時性 | MVP 先用人工審核，後續可接第三方 KYC 服務 |
| 無金流保障，可能有糾紛 | 透過評價系統建立信任，嚴重糾紛由管理員介入 |
| 單一使用者不能同時是發案者和接案者 | 設計為同一帳號可切換角色，避免重複註冊 |
