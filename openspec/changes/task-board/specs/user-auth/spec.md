## ADDED Requirements

### Requirement: 使用者可以註冊帳號
系統 SHALL 允許使用者透過 Email 註冊帳號，提供姓名、Email、密碼。

#### Scenario: 成功註冊
- **WHEN** 使用者填寫有效的姓名、Email、密碼並送出
- **THEN** 系統建立帳號並寄送驗證信至該 Email

#### Scenario: Email 已被註冊
- **WHEN** 使用者填寫的 Email 已存在於系統中
- **THEN** 系統顯示「此 Email 已被註冊」錯誤訊息

### Requirement: 使用者可以登入
系統 SHALL 允許使用者透過 Email + 密碼登入，也 SHALL 支援 Google OAuth 登入。

#### Scenario: Email 密碼登入成功
- **WHEN** 使用者輸入正確的 Email 和密碼
- **THEN** 系統驗證通過，建立 session 並導向首頁

#### Scenario: Google OAuth 登入
- **WHEN** 使用者點擊「Google 登入」按鈕並授權
- **THEN** 系統建立或關聯帳號，建立 session 並導向首頁

#### Scenario: 登入失敗
- **WHEN** 使用者輸入錯誤的 Email 或密碼
- **THEN** 系統顯示「Email 或密碼錯誤」訊息

### Requirement: 使用者必須完成實名認證才能發布或接案
系統 SHALL 要求使用者上傳身分證件照片完成實名認證，認證狀態為 pending/verified/rejected。

#### Scenario: 提交實名認證
- **WHEN** 使用者上傳身分證件照片並送出
- **THEN** 系統將認證狀態設為 pending，等待管理員審核

#### Scenario: 認證通過
- **WHEN** 管理員審核通過使用者的身分證件
- **THEN** 系統將認證狀態設為 verified，使用者可以發布任務或申請接案

#### Scenario: 認證被拒
- **WHEN** 管理員拒絕使用者的身分證件（照片模糊或不符）
- **THEN** 系統將認證狀態設為 rejected，並顯示拒絕原因，允許重新上傳

#### Scenario: 未認證使用者嘗試發布任務
- **WHEN** 認證狀態非 verified 的使用者嘗試發布任務
- **THEN** 系統阻擋操作並引導使用者前往實名認證頁面

### Requirement: 使用者可以管理個人資料
系統 SHALL 允許使用者編輯姓名、頭像、自我介紹。

#### Scenario: 更新個人資料
- **WHEN** 使用者修改姓名或頭像並儲存
- **THEN** 系統更新資料並顯示成功訊息
