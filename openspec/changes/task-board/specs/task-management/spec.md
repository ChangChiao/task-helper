## ADDED Requirements

### Requirement: 發案者可以發布任務
系統 SHALL 允許已認證的發案者建立任務，MUST 包含標題、描述、固定分類、地點、報酬金額。

#### Scenario: 成功發布任務
- **WHEN** 發案者填寫完整的任務資訊（標題、描述、分類、地點、報酬）並送出
- **THEN** 系統建立任務，狀態設為 open，顯示在任務看板上

#### Scenario: 必填欄位缺漏
- **WHEN** 發案者未填寫必填欄位就送出
- **THEN** 系統顯示對應欄位的錯誤提示

### Requirement: 任務必須使用固定分類
系統 SHALL 提供以下固定分類供發案者選擇：居家、跑腿、排隊/等候、生活、搬運、其他。

#### Scenario: 選擇任務分類
- **WHEN** 發案者建立任務時
- **THEN** 系統顯示固定分類下拉選單，發案者 MUST 選擇一個分類

### Requirement: 任務必須綁定地點
系統 SHALL 要求每個任務填寫執行地點（文字輸入，如「台北市大安區」）。

#### Scenario: 填寫任務地點
- **WHEN** 發案者建立任務時
- **THEN** 發案者 MUST 輸入任務執行的地點

### Requirement: 發案者可以編輯任務
系統 SHALL 允許發案者在任務狀態為 open 時編輯任務內容。

#### Scenario: 編輯 open 狀態的任務
- **WHEN** 發案者修改 open 狀態任務的標題或描述並儲存
- **THEN** 系統更新任務內容

#### Scenario: 嘗試編輯非 open 狀態的任務
- **WHEN** 發案者嘗試編輯 in_progress 或 completed 的任務
- **THEN** 系統阻擋操作並提示「進行中或已完成的任務無法編輯」

### Requirement: 發案者可以取消任務
系統 SHALL 允許發案者在任務狀態為 open 時取消任務。

#### Scenario: 取消 open 狀態的任務
- **WHEN** 發案者取消 open 狀態的任務
- **THEN** 系統將任務狀態設為 cancelled，任務從看板上移除

### Requirement: 任務狀態生命週期管理
系統 SHALL 管理任務狀態流轉：open → in_progress → completed → reviewed，以及 open → cancelled。

#### Scenario: 任務從 open 進入 in_progress
- **WHEN** 發案者從申請者中選定一位接案者
- **THEN** 系統將任務狀態設為 in_progress，拒絕其他申請者

#### Scenario: 任務從 in_progress 進入 completed
- **WHEN** 發案者確認任務已完成
- **THEN** 系統將任務狀態設為 completed，開放雙方互評

#### Scenario: 任務從 completed 進入 reviewed
- **WHEN** 雙方皆完成評價
- **THEN** 系統將任務狀態設為 reviewed
