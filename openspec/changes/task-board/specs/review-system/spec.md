## ADDED Requirements

### Requirement: 任務完成後雙方可互評
系統 SHALL 在任務狀態為 completed 後，允許發案者評接案者、接案者評發案者，各評一次。

#### Scenario: 發案者評價接案者
- **WHEN** 任務狀態為 completed，發案者提交 1-5 星評分與文字評價
- **THEN** 系統儲存評價，公開顯示在接案者的個人頁面

#### Scenario: 接案者評價發案者
- **WHEN** 任務狀態為 completed，接案者提交 1-5 星評分與文字評價
- **THEN** 系統儲存評價，公開顯示在發案者的個人頁面

#### Scenario: 重複評價
- **WHEN** 使用者對同一任務嘗試再次評價
- **THEN** 系統阻擋操作並提示「您已評價過此任務」

### Requirement: 雙方評價完成後任務進入 reviewed
系統 SHALL 在雙方皆完成評價後，自動將任務狀態從 completed 轉為 reviewed。

#### Scenario: 雙方皆完成評價
- **WHEN** 發案者和接案者都已提交評價
- **THEN** 系統自動將任務狀態設為 reviewed

#### Scenario: 僅一方完成評價
- **WHEN** 只有其中一方提交了評價
- **THEN** 任務狀態維持 completed，等待另一方評價

### Requirement: 使用者可以查看評價紀錄
系統 SHALL 在使用者個人頁面顯示所有收到的評價，包含平均評分和評價列表。

#### Scenario: 查看個人評價
- **WHEN** 使用者或其他人瀏覽某使用者的個人頁面
- **THEN** 系統顯示該使用者的平均評分、評價總數、以及所有評價（評分、文字、評價者姓名、任務標題、時間）
