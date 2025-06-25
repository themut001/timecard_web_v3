# 社内勤怠管理・Notion連携Webアプリケーション開発プロンプト

## プロジェクト概要

パステルカラーとLiquid Glassデザインを採用した社内用勤怠管理Webアプリケーションを開発してください。Notion APIとの連携により、プロジェクトタグ管理と工数集計機能を実装します。

## デザインシステム仕様

### カラーパレット

```css
/* メインカラー */
--primary-bg: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 50%, #e8f2ff 100%);
--card-bg: rgba(255, 255, 255, 0.7);
--input-bg: rgba(248, 250, 252, 0.8);

/* アクセントカラー */
--primary-gradient: linear-gradient(135deg, #8b5cf6, #ec4899);
--secondary-gradient: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);

/* テキストカラー */
--text-primary: #2d3748;
--text-secondary: #64748b;
--text-muted: #94a3b8;

/* ボーダー・シャドウ */
--border-color: rgba(203, 213, 225, 0.6);
--shadow-light: 0 8px 16px -4px rgba(139, 92, 246, 0.15);
--shadow-heavy: 0 25px 50px -12px rgba(99, 102, 241, 0.15);
```

### Liquid Glassエフェクト

- `backdrop-filter: blur(40px) saturate(180%)`
- 半透明背景とグラデーションボーダー
- ホバー時の微細なアニメーション
- 1.5rem border-radius
- 内側光彩効果

## 技術要件

### フロントエンド

- **フレームワーク**: React 18+ または Vue 3+
- **スタイリング**: Tailwind CSS + カスタムCSS
- **ルーティング**: React Router / Vue Router
- **状態管理**: Redux Toolkit / Pinia
- **UI Components**: 自作コンポーネントライブラリ
- **アニメーション**: Framer Motion または CSS Transitions

### バックエンド

- **Framework**: Node.js + Express または Python + FastAPI
- **データベース**: PostgreSQL または MongoDB
- **認証**: JWT + Refresh Token
- **API**: RESTful API または GraphQL
- **外部API**: Notion API v1

### 外部連携

- **Notion API**: タグ・プロジェクト管理
- **環境変数**:
  - `NOTION_API_KEY`: Notion Integration Token
  - `NOTION_DATABASE_ID`: 物件データベースID

### インフラ

- **デプロイ**: Docker + Docker Compose
- **Webサーバー**: Nginx
- **環境管理**: dotenv

## Notion連携設定

### 前提条件

1. **Notionデータベース**に「物件名」という名前のタイトルフィールドが必要
2. **Notion API Integration**の作成が必要

### Notion APIの設定手順

#### 1. Notion Integrationの作成

1. [Notion Developers](https://www.notion.so/my-integrations)にアクセス
2. 「New integration」をクリック
3. 必要な情報を入力：
   - Name: タイムカードアプリ（任意）
   - Associated workspace: 使用するワークスペース
4. 「Submit」をクリックし、**Internal Integration Token**をコピー

#### 2. データベースの共有

1. Notionで物件名を管理しているデータベースを開く
2. 右上の「Share」ボタンをクリック
3. 作成したIntegrationを招待
4. データベースURLから**Database ID**をコピー
   - URL例: `https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...`
   - `?v=`より前の32文字がDatabase ID

#### 3. 環境変数の設定

```bash
# Linux/Mac
export NOTION_API_KEY='your-notion-api-key'
export NOTION_DATABASE_ID='your-database-id'

# Windows (コマンドプロンプト)
set NOTION_API_KEY=your-notion-api-key
set NOTION_DATABASE_ID=your-database-id

# Windows (PowerShell)
$env:NOTION_API_KEY="your-notion-api-key"
$env:NOTION_DATABASE_ID="your-database-id"
```

## 必要な画面・機能

### 1. 認証系

- **ログイン画面**
- **パスワードリセット画面**
- **初回ログイン設定画面**

### 2. 社員用画面

- **ダッシュボード**
  - 今日の勤務状況
  - 今月の勤務時間サマリー
  - 最近の打刻履歴
  - タグ別工数サマリー
  - お知らせ・通知
- **打刻画面**
  - 出勤/退勤ボタン
  - 現在時刻表示
  - 打刻履歴（直近5件）
  - 位置情報取得（オプション）
- **日報作成画面** 🆕
  - 本日の作業内容入力
  - **タグ別工数入力セクション**
    - タグ検索（インクリメンタルサーチ）
    - 複数タグ選択可能
    - 各タグへの工数（時間）入力
    - 合計8時間の自動計算・バリデーション
  - 特記事項・コメント欄
- **勤怠履歴画面**
  - カレンダービュー
  - リストビュー
  - 月次サマリー
  - 日報履歴表示
  - CSV/PDFエクスポート
- **申請画面**
  - 有給申請
  - 残業申請
  - 遅刻/早退申請
  - 申請履歴

### 3. 管理者用画面

- **社員管理**
  - 社員一覧・検索
  - 社員情報編集
  - 権限管理
- **勤怠管理**
  - 全社員勤怠状況
  - 異常勤怠アラート
  - 申請承認/却下
  - 勤怠データ修正
- **タグ工数管理** 🆕
  - **Notionタグ同期機能**
    - 手動同期ボタン
    - 同期結果表示（新規・更新件数）
    - 最大1000件まで同期
    - 同期後自動ソート（アルファベット順）
  - **工数集計機能**
    - 期間指定での集計
    - タグごとの合計工数表示
    - 社員別・タグ別クロス集計
    - グラフ・チャート表示
- **レポート**
  - 部署別勤怠集計
  - プロジェクト別工数分析 🆕
  - 残業時間分析
  - 有給取得率
  - 工数配分レポート 🆕
- **システム設定**
  - 勤務時間設定
  - 祝日カレンダー
  - 通知設定
  - Notion連携設定 🆕

## データベース設計

### 主要テーブル

```sql
-- ユーザー
users (id, employee_id, name, email, password_hash, role, department_id, created_at)

-- 勤怠記録
attendance_records (id, user_id, date, clock_in, clock_out, break_time, total_hours, status)

-- 申請
requests (id, user_id, type, start_date, end_date, reason, status, created_at, approved_at)

-- 部署
departments (id, name, manager_id, created_at)

-- タグマスタ（Notion同期）🆕
tags (id, name, notion_id, is_active, created_at, updated_at)

-- 日報 🆕
daily_reports (id, user_id, date, work_content, notes, created_at, updated_at)

-- タグ別工数 🆕
tag_efforts (id, daily_report_id, tag_id, hours, created_at)

-- 設定
settings (id, key, value, updated_at)
```

## API設計

### 認証エンドポイント

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
```

### 勤怠エンドポイント

```
GET  /api/attendance/today
POST /api/attendance/clock-in
POST /api/attendance/clock-out
GET  /api/attendance/history?month=2025-01
GET  /api/attendance/summary?year=2025

POST /api/requests/leave
GET  /api/requests/my-requests
```

### 日報・工数エンドポイント 🆕

```
GET  /api/reports/daily?date=2025-01-15
POST /api/reports/daily
PUT  /api/reports/daily/:id

GET  /api/tags/search?q=keyword
GET  /api/tags/active
POST /api/tags/sync                    # Notion同期（管理者のみ）

POST /api/efforts/daily                # タグ別工数登録
GET  /api/efforts/summary?start_date=2025-01-01&end_date=2025-01-31
```

### 管理者エンドポイント

```
GET  /api/admin/employees
GET  /api/admin/attendance/all?date=2025-01-15
PUT  /api/admin/attendance/:id
GET  /api/admin/reports/monthly

GET  /api/admin/tags/efforts?start_date=2025-01-01&end_date=2025-01-31
GET  /api/admin/tags/sync-status
POST /api/admin/tags/sync              # Notion同期実行
```

## Notionタグ同期機能

### 同期方法

1. **管理画面から同期**
   - 管理画面の「タグ工数」タブを開く
   - 「Notionタグ同期」ボタンをクリック
   - 同期結果（新規・更新件数）が表示される
2. **API経由で同期**（管理者権限必要）
   
   ```bash
   curl -X POST http://localhost:5000/api/tags/sync \
        -H "Cookie: session=your-session-cookie"
   ```

### 同期の仕組み

- Notionデータベースの「物件名」フィールドからタグを取得
- 空の物件名はスキップ
- 重複する物件名は1つのタグとして管理
- 最大1000件まで同期可能
- 同期後は自動的にアルファベット順にソート

### タグ別工数管理

#### 日報でのタグ工数入力

1. マイページ → 日報作成タブ
2. 「タグ別工数」セクションで：
   - タグ名で検索（インクリメンタルサーチ対応）
   - 複数タグに対して工数（時間）を入力
   - 合計8時間になるように調整

#### 工数集計の確認（管理者のみ）

1. 管理画面 → タグ工数タブ
2. 期間を指定して「集計」ボタンをクリック
3. タグごとの合計工数が表示される

## コンポーネント設計

### 共通コンポーネント

```javascript
// Liquid Glass Button
<LiquidButton variant="primary|secondary|outline" size="sm|md|lg">
  テキスト
</LiquidButton>

// Liquid Glass Card
<LiquidCard className="additional-classes">
  <CardHeader>タイトル</CardHeader>
  <CardContent>コンテンツ</CardContent>
</LiquidCard>

// Liquid Glass Input
<LiquidInput 
  type="text|email|password|time|date|search"
  placeholder="プレースホルダー"
  label="ラベル"
  error="エラーメッセージ"
/>

// Tag Input Component 🆕
<TagSelector
  selectedTags={selectedTags}
  onTagSelect={handleTagSelect}
  searchable={true}
  maxTags={10}
/>

// Effort Input Component 🆕
<EffortInput
  tags={selectedTags}
  efforts={efforts}
  onChange={handleEffortChange}
  maxTotal={8}
  showTotal={true}
/>

// Navigation
<Sidebar userRole="employee|admin" />
<Header userName="ユーザー名" />

// Data Display
<AttendanceTable data={attendanceData} />
<AttendanceChart type="line|bar|pie" data={chartData} />
<EffortChart data={effortData} type="doughnut|bar" /> 🆕
<Calendar view="month|week" onDateSelect={handleDateSelect} />
```

### 新規コンポーネント（Notion連携）

```javascript
// Notion同期ステータス
<NotionSyncStatus lastSync={lastSyncTime} isLoading={isLoading} />

// Notion同期ボタン
<NotionSyncButton onSync={handleSync} disabled={isLoading} />

// タグ別工数集計テーブル
<EffortSummaryTable 
  data={effortData} 
  period={selectedPeriod}
  exportable={true}
/>

// 日報入力フォーム
<DailyReportForm
  onSubmit={handleSubmit}
  initialData={reportData}
  tags={availableTags}
/>
```

## 実装優先順位

### Phase 1: 基盤構築

1. プロジェクト初期化・環境構築
2. デザインシステム実装
3. 認証機能
4. 基本レイアウト・ナビゲーション

### Phase 2: 基本勤怠機能

1. 打刻機能（出勤/退勤）
2. ダッシュボード画面
3. 勤怠履歴表示

### Phase 3: Notion連携・タグ管理 🆕

1. Notion API連携基盤
2. タグマスタ管理
3. Notion同期機能実装
4. タグ検索・選択UI

### Phase 4: 日報・工数管理 🆕

1. 日報作成機能
2. タグ別工数入力
3. 工数集計機能
4. 管理画面での工数分析

### Phase 5: 応用機能

1. 申請機能（有給・残業等）
2. カレンダービュー
3. 詳細レポート機能
4. データエクスポート

### Phase 6: 最適化

1. パフォーマンス最適化
2. PWA対応
3. モバイル最適化
4. エラーハンドリング強化

## セキュリティ要件

- JWT認証実装
- CSRF対策
- XSS対策
- 入力値バリデーション
- アクセス権限制御
- Notion API認証情報の安全な管理
- ログ記録

## パフォーマンス要件

- 初期ページロード: 3秒以内
- 打刻処理: 1秒以内
- データ取得: 2秒以内
- Notion同期: 10秒以内（1000件）
- レスポンシブ対応（320px〜）

## エラーハンドリング

- Notion API接続エラー対応
- 同期失敗時のリトライ機能
- ネットワークエラーの適切な表示
- データ整合性チェック

## 追加要望

- パステルカラー+Liquid Glassデザインを全画面に統一
- Liquid Glassエフェクトを全コンポーネントに適用
- パステルカラーのアクセシビリティ確保
- ダークモード対応（将来的）
- 多言語対応準備
- タグ工数のリアルタイム更新

## 成果物

1. 完全に動作するWebアプリケーション
2. Notion連携機能を含むシステム
3. デザインシステムドキュメント
4. API仕様書（Notion連携含む）
5. デプロイメント手順書
6. ユーザーマニュアル
7. Notion連携設定ガイド

---

この仕様に基づいて、Notion連携機能を備えたモダンで使いやすい勤怠管理システムを構築してください。特にデザインの一貫性とユーザビリティを重視し、Liquid Glassの美しいエフェクトを活用した魅力的なUI、そして効率的なプロジェクト工数管理を実現してください。