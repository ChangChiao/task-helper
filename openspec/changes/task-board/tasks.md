## 1. 專案初始化

- [x] 1.1 建立 Next.js 專案（App Router + TypeScript + Tailwind CSS）
- [x] 1.2 安裝並設定 Prisma，連接 Neon PostgreSQL
- [x] 1.3 安裝並設定 NextAuth.js（Email + Google Provider）
- [x] 1.4 設定 Cloudinary 帳號與 SDK
- [x] 1.5 建立基本專案結構（layouts, components, lib 資料夾）

## 2. 資料庫 Schema

- [x] 2.1 建立 User model（id, email, name, password, role, verified, avatarUrl）
- [x] 2.2 建立 Task model（id, title, description, category, location, reward, status, posterId, assigneeId）
- [x] 2.3 建立 Application model（id, taskId, userId, message, status）
- [x] 2.4 建立 Conversation 與 Message model
- [x] 2.5 建立 Review model（id, taskId, reviewerId, revieweeId, rating, comment）
- [ ] 2.6 執行 Prisma migrate，產生資料庫 tables

## 3. 使用者認證（user-auth）

- [x] 3.1 建立註冊頁面（Email + 密碼 + 姓名）
- [x] 3.2 建立登入頁面（Email/密碼 + Google OAuth）
- [x] 3.3 實作 NextAuth.js API route 與 session 管理
- [ ] 3.4 建立實名認證頁面（上傳身分證件照片至 Cloudinary）
- [ ] 3.5 實作實名認證 API（提交認證、查詢認證狀態）
- [ ] 3.6 建立管理員審核認證頁面（審核/通過/拒絕）
- [ ] 3.7 建立個人資料編輯頁面（姓名、頭像、自我介紹）

## 4. 任務管理（task-management）

- [x] 4.1 建立發布任務頁面（表單含標題、描述、分類下拉、地點、報酬）
- [ ] 4.2 實作發布任務 API（建立任務，驗證必填欄位、驗證認證狀態）
- [x] 4.3 實作固定分類資料（居家、跑腿、排隊/等候、生活、搬運、其他）
- [ ] 4.4 建立我的任務頁面（發案者查看自己發布的所有任務與狀態）
- [ ] 4.5 實作編輯任務 API（僅 open 狀態可編輯）
- [ ] 4.6 實作取消任務 API（僅 open 狀態可取消）
- [ ] 4.7 實作任務狀態流轉 API（open → in_progress → completed → reviewed）

## 5. 任務瀏覽（task-browsing）

- [x] 5.1 建立任務看板首頁（卡片列表，顯示標題、分類、地點、報酬、時間）
- [ ] 5.2 實作取得任務列表 API（分頁、排序）
- [x] 5.3 實作分類篩選功能（支援單選與多選）
- [x] 5.4 實作關鍵字搜尋功能（搜尋標題與描述）
- [x] 5.5 建立任務詳情頁面（完整資訊 + 發案者資料與評價摘要）

## 6. 申請接案（task-application）

- [x] 6.1 在任務詳情頁加入「申請接案」按鈕與推薦訊息表單
- [ ] 6.2 實作申請接案 API（驗證認證狀態、防重複申請、防自己申請自己）
- [ ] 6.3 建立申請者管理頁面（發案者查看申請者清單、評價摘要、推薦訊息）
- [ ] 6.4 實作選擇接案者 API（選定一位，自動拒絕其餘，任務轉 in_progress）
- [ ] 6.5 建立我的申請頁面（接案者查看自己的所有申請與狀態）

## 7. 站內訊息（messaging）

- [ ] 7.1 設定 Socket.io server（獨立部署於 Render 免費方案）
- [ ] 7.2 實作選定接案者後自動建立 Conversation 的邏輯
- [x] 7.3 建立對話列表頁面（訊息中心，顯示所有對話、最新訊息、未讀數）
- [x] 7.4 建立對話頁面（即時收發訊息 UI）
- [ ] 7.5 實作訊息發送與接收 API（Socket.io 即時 + 資料庫持久化）
- [ ] 7.6 實作對話存取權限驗證（僅任務相關雙方可存取）

## 8. 評價系統（review-system）

- [x] 8.1 建立評價表單元件（1-5 星 + 文字評價）
- [ ] 8.2 在任務 completed 狀態頁面顯示評價入口
- [ ] 8.3 實作提交評價 API（驗證任務狀態、防重複評價、雙方皆評後轉 reviewed）
- [x] 8.4 建立使用者個人頁面的評價區塊（平均評分、評價列表）

## 9. 共用元件與版面

- [x] 9.1 建立共用 Layout（Header 導覽列、Footer）
- [ ] 9.2 建立角色切換機制（同一帳號可切換發案者/接案者視角）
- [x] 9.3 建立 Loading、Empty State、Error 等共用 UI 元件
- [ ] 9.4 實作 RWD 響應式設計

## 10. 部署

- [ ] 10.1 設定 Vercel 專案並連接 Git repository
- [ ] 10.2 設定環境變數（DB URL、NextAuth Secret、Cloudinary、Socket.io URL）
- [ ] 10.3 部署 Socket.io server 至 Render
- [ ] 10.4 執行 production migration 並驗證功能
