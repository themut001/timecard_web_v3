# Timecard Web v3 - 社内勤怠管理・Notion連携アプリ

Liquid Glassデザインを採用した現代的な勤怠管理システム。Notion APIとの連携により、プロジェクトタグ管理と工数集計を実現。

## 🚀 主要機能

- **勤怠管理**: 出退勤打刻、履歴表示、申請機能
- **Notion連携**: プロジェクトタグの自動同期
- **工数管理**: タグ別工数入力・集計・分析
- **日報機能**: 作業内容と工数の記録
- **管理機能**: 社員管理、レポート出力
- **Liquid Glassデザイン**: 美しいUI/UX

## 🛠 技術スタック

### フロントエンド
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router

### バックエンド
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT認証
- Notion API

### インフラ
- Docker + Docker Compose
- Nginx

## 📋 セットアップ

### 🚀 クイックスタート（推奨）

1. **自動セットアップを実行**
   \`\`\`bash
   git clone <repository-url>
   cd timecard_web_v3
   ./setup.sh
   \`\`\`

2. **ブラウザでアクセス**
   - フロントエンド: http://localhost:3000
   - API: http://localhost:5000

### 🛠 手動セットアップ

1. **プロジェクトのクローン**
   \`\`\`bash
   git clone <repository-url>
   cd timecard_web_v3
   \`\`\`

2. **環境変数の設定**
   \`\`\`bash
   cp .env.example .env
   # .envファイルを編集して必要な値を設定
   \`\`\`

3. **Notion API設定（オプション）**
   1. [Notion Developers](https://www.notion.so/my-integrations)でIntegrationを作成
   2. データベースにIntegrationを招待
   3. API KeyとDatabase IDを.envに設定

4. **Docker環境での起動**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

5. **データベースの初期化**
   \`\`\`bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npx prisma generate
   docker-compose exec backend npm run db:seed
   \`\`\`

### 🔧 開発環境の起動

\`\`\`bash
./scripts/dev.sh
\`\`\`

### 🗄️ データベースのリセット

\`\`\`bash
./scripts/reset-db.sh
\`\`\`

## 📝 使用方法

### 社員ユーザー
1. ログイン後、ダッシュボードで勤務状況を確認
2. 出退勤ボタンで打刻
3. 日報画面でタグ別工数を入力
4. 履歴画面で過去の勤怠を確認

### 管理者
1. 社員管理画面で従業員情報を管理
2. Notionタグ同期でプロジェクトタグを更新
3. 工数集計でプロジェクト分析
4. レポート機能で詳細分析

## 🏗 プロジェクト構造

\`\`\`
timecard_web_v3/
├── frontend/          # React フロントエンド
├── backend/           # Express バックエンド  
├── docker-compose.yml # Docker設定
├── .env.example       # 環境変数テンプレート
└── README.md          # このファイル
\`\`\`

## 🔧 開発

### コマンド
- \`npm run dev\`: 開発サーバー起動
- \`npm run build\`: プロダクションビルド
- \`npm run lint\`: コード品質チェック
- \`npm test\`: テスト実行

### ブランチ戦略
- \`main\`: 本番環境
- \`develop\`: 開発環境
- \`feature/*\`: 機能開発

## 📊 API エンドポイント

詳細なAPI仕様は[CLAUDE.md](./CLAUDE.md)を参照してください。

## 🤝 コントリビューション

1. Issueを作成
2. フィーチャーブランチを作成
3. 変更をコミット
4. プルリクエストを作成

## 📄 ライセンス

MIT License