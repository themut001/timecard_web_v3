# 🏢 Timecard Web v3 - 社内勤怠管理・Notion連携アプリ

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

</div>

Liquid Glassデザインを採用した現代的な勤怠管理システム。Notion APIとの連携により、プロジェクトタグ管理と工数集計を実現します。

## ✨ 主要機能

- 🕐 **勤怠管理**: 出退勤打刻、履歴表示、申請機能
- 🔗 **Notion連携**: プロジェクトタグの自動同期（最大1000件）
- 📊 **工数管理**: タグ別工数入力・集計・分析
- 📝 **日報機能**: 作業内容と工数の記録
- 👥 **管理機能**: 社員管理、レポート出力
- 🎨 **Liquid Glassデザイン**: 美しいガラスモーフィズムUI

## 🛠 技術スタック

### フロントエンド
- **React 18+** with TypeScript
- **Tailwind CSS** + カスタムLiquid Glassデザイン
- **Framer Motion** アニメーション
- **React Router v7** ルーティング
- **Redux Toolkit** 状態管理

### バックエンド
- **Node.js + Express** with TypeScript
- **Prisma ORM** + PostgreSQL
- **JWT認証** + Refresh Token
- **Notion API v1** 連携

### インフラ・開発環境
- **Docker + Docker Compose** コンテナ化
- **Nginx** リバースプロキシ
- **WSL2対応** Windows開発環境
- **Hot Reload** 開発効率化

## 📋 セットアップ

### 📝 事前準備

以下のソフトウェアが必要です：

#### 🪟 Windows環境
- **WSL2** (Windows Subsystem for Linux 2)
- **Docker Desktop for Windows** (WSL2バックエンド)
- **Git for Windows**
- **Visual Studio Code** (推奨)
  - Remote - WSL 拡張機能

#### 🐧 Linux/Mac環境
- **Docker** & **Docker Compose**
- **Node.js 18+** (開発時のみ)
- **Git**

### 🪟 Windows用セットアップ手順

#### 1. WSL2のインストール

\`\`\`powershell
# PowerShellを管理者として実行
wsl --install
# 再起動後
wsl --set-default-version 2
\`\`\`

#### 2. Ubuntu (WSL2) のセットアップ

\`\`\`bash
# WSL2 Ubuntuターミナルで実行
sudo apt update && sudo apt upgrade -y

# 必要なパッケージをインストール
sudo apt install -y curl wget git unzip

# Node.js 18のインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

#### 3. Docker Desktop for Windowsのインストール

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)をダウンロード
2. インストール時に「Enable WSL2 integration」をチェック
3. Settings → Resources → WSL Integration でUbuntuを有効化

#### 4. プロジェクトのクローンと起動 (Windows)

\`\`\`bash
# WSL2 Ubuntuターミナルで実行
cd ~
git clone <repository-url>
cd timecard_web_v3

# 自動セットアップスクリプト実行
chmod +x setup.sh
./setup.sh
\`\`\`

### 🚀 クイックスタート（Linux/Mac）

\`\`\`bash
git clone <repository-url>
cd timecard_web_v3
chmod +x setup.sh
./setup.sh
\`\`\`

### 🌐 アクセスURL

セットアップ完了後、以下のURLでアクセスできます：

- **フロントエンド**: http://localhost:3000
- **API**: http://localhost:5000/api
- **データベース**: localhost:5432 (PostgreSQL)

### 🛠 手動セットアップ

自動セットアップが失敗した場合の手動手順：

#### 1. 環境変数の設定

\`\`\`bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
\`\`\`

#### 2. Notion API設定（オプション）

1. [Notion Developers](https://www.notion.so/my-integrations)でIntegrationを作成
2. データベースにIntegrationを招待
3. API KeyとDatabase IDを.envに設定

#### 3. Docker環境での起動

\`\`\`bash
docker-compose up -d
\`\`\`

#### 4. データベースの初期化

\`\`\`bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
docker-compose exec backend npm run db:seed
\`\`\`

### 🔧 開発環境の起動

#### Windows (WSL2)
\`\`\`bash
# WSL2 Ubuntuターミナルで実行
./scripts/dev.sh
\`\`\`

#### Linux/Mac
\`\`\`bash
./scripts/dev.sh
\`\`\`

### 🗄️ データベースのリセット

\`\`\`bash
./scripts/reset-db.sh
\`\`\`

## 🚨 トラブルシューティング

### Windows固有の問題

#### WSL2でDockerが起動しない
\`\`\`bash
# WSL2のメモリ制限を確認
cat /proc/meminfo | grep MemTotal

# Docker Desktopの再起動
# WindowsでDocker Desktopを右クリック → Restart
\`\`\`

#### ファイルパーミッションエラー
\`\`\`bash
# WSL2でスクリプトに実行権限を付与
chmod +x setup.sh
chmod +x scripts/*.sh
\`\`\`

#### ポート競合エラー
\`\`\`bash
# 使用中のポートを確認
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# プロセスを終了（TaskManager使用推奨）
\`\`\`

### 共通の問題

#### Node.jsバージョンエラー
\`\`\`bash
# Node.jsバージョン確認
node --version

# 18以上が必要。古い場合は再インストール
\`\`\`

#### Docker Composeエラー
\`\`\`bash
# Dockerサービス確認
docker --version
docker-compose --version

# コンテナの状態確認
docker-compose ps

# ログ確認
docker-compose logs
\`\`\`

#### データベース接続エラー
\`\`\`bash
# PostgreSQLコンテナの確認
docker-compose exec postgres psql -U postgres -d timecard_dev

# データベースの再構築
./scripts/reset-db.sh
\`\`\`

### Notion API関連

#### 同期エラー
1. Notion API Keyが正しく設定されているか確認
2. データベースIDが正しいか確認
3. Integrationがデータベースに招待されているか確認

### VS Code設定 (Windows)

推奨設定ファイル `.vscode/settings.json`:

\`\`\`json
{
  "remote.WSL.fileWatcher.polling": true,
  "files.eol": "\\n",
  "terminal.integrated.defaultProfile.windows": "WSL"
}
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
├── frontend/                    # React フロントエンド
│   ├── src/
│   │   ├── components/         # UIコンポーネント
│   │   │   ├── common/        # 共通コンポーネント
│   │   │   ├── forms/         # フォームコンポーネント
│   │   │   ├── ui/            # 再利用可能UIコンポーネント
│   │   │   ├── admin/         # 管理者専用コンポーネント
│   │   │   └── performance/   # パフォーマンス最適化コンポーネント
│   │   ├── pages/             # ページコンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── store/             # Redux状態管理
│   │   ├── services/          # API呼び出しサービス
│   │   ├── types/             # TypeScript型定義
│   │   ├── utils/             # ユーティリティ関数
│   │   └── styles/            # スタイル設定
│   ├── public/                # 静的ファイル
│   ├── package.json           # フロントエンド依存関係
│   └── tailwind.config.js     # Tailwind CSS設定
├── backend/                    # Express バックエンド
│   ├── src/
│   │   ├── controllers/       # APIコントローラー
│   │   ├── middleware/        # ミドルウェア
│   │   ├── routes/           # ルート定義
│   │   ├── services/         # ビジネスロジック
│   │   ├── utils/            # ユーティリティ
│   │   └── types/            # TypeScript型定義
│   ├── prisma/               # データベーススキーマ
│   └── package.json          # バックエンド依存関係
├── scripts/                   # 開発用スクリプト
│   ├── setup.sh              # 自動セットアップ
│   ├── dev.sh                # 開発環境起動
│   └── reset-db.sh           # データベースリセット
├── docker-compose.yml         # Docker設定
├── .env.example              # 環境変数テンプレート
├── CLAUDE.md                 # プロジェクト仕様書
├── REFACTORING.md            # リファクタリングレポート
└── README.md                 # このファイル
\`\`\`

## 🔧 開発

### 🎯 主要コマンド

#### プロジェクト管理
\`\`\`bash
./setup.sh              # 初期セットアップ
./scripts/dev.sh         # 開発環境起動
./scripts/reset-db.sh    # データベースリセット
\`\`\`

#### フロントエンド (frontend/)
\`\`\`bash
npm run dev              # 開発サーバー起動 (http://localhost:3000)
npm run build            # プロダクションビルド
npm run lint             # ESLintコード品質チェック
npm run type-check       # TypeScript型チェック
npm test                 # テスト実行
npm run preview          # ビルド版プレビュー
\`\`\`

#### バックエンド (backend/)
\`\`\`bash
npm run dev              # 開発サーバー起動 (http://localhost:5000)
npm run build            # TypeScriptビルド
npm run start            # プロダクション起動
npm run lint             # ESLintコード品質チェック
npm run db:migrate       # データベースマイグレーション
npm run db:generate      # Prismaクライアント生成
npm run db:seed          # 初期データ投入
npm run db:reset         # データベースリセット
\`\`\`

#### Docker操作
\`\`\`bash
docker-compose up -d     # バックグラウンド起動
docker-compose down      # 停止・削除
docker-compose logs      # ログ表示
docker-compose ps        # 実行状況確認
\`\`\`

### 🎨 開発用アカウント

初期データ投入後、以下のアカウントが使用可能：

\`\`\`
管理者アカウント:
Email: admin@company.com
Password: Admin123!

一般ユーザー:
Email: user@company.com  
Password: User123!
\`\`\`

### 🌿 ブランチ戦略
- \`main\`: 本番環境用安定版
- \`develop\`: 開発環境統合ブランチ
- \`feature/*\`: 機能開発ブランチ
- \`hotfix/*\`: 緊急修正ブランチ

## ⚙️ 環境変数

### 必須設定

\`.env\`ファイルで以下の変数を設定：

\`\`\`env
# データベース設定
DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"

# JWT認証
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# アプリケーション設定
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Notion API (オプション)
NOTION_API_KEY="your-notion-integration-token"
NOTION_DATABASE_ID="your-notion-database-id"

# メール設定 (将来の機能拡張用)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
\`\`\`

### Windows環境での注意点

- WSL2使用時は、\`.env\`ファイルをLinux形式（LF）で保存
- Windowsパスではなく、WSL2内パス（\`/home/user/...\`）を使用

## 📊 API エンドポイント

### 認証
- \`POST /api/auth/login\` - ログイン
- \`POST /api/auth/logout\` - ログアウト
- \`POST /api/auth/refresh\` - トークン更新
- \`GET /api/auth/me\` - 現在のユーザー情報

### 勤怠管理
- \`GET /api/attendance/today\` - 今日の勤怠記録
- \`POST /api/attendance/clock-in\` - 出勤打刻
- \`POST /api/attendance/clock-out\` - 退勤打刻
- \`GET /api/attendance/records\` - 勤怠履歴
- \`GET /api/attendance/summary\` - 勤怠サマリー

### タグ管理
- \`GET /api/tags\` - タグ一覧
- \`GET /api/tags/search\` - タグ検索
- \`POST /api/tags/sync\` - Notion同期
- \`GET /api/tags/sync-status\` - 同期ステータス

### 日報・工数
- \`GET /api/reports/daily\` - 日報一覧
- \`POST /api/reports/daily\` - 日報作成
- \`GET /api/reports/effort-summary\` - 工数集計

### 管理者機能
- \`GET /api/admin/employees\` - 社員管理
- \`GET /api/admin/attendance/all\` - 全社員勤怠
- \`GET /api/admin/reports/monthly\` - 月次レポート

詳細なAPI仕様は[CLAUDE.md](./CLAUDE.md)を参照してください。

## 🤝 コントリビューション

### 開発フロー

1. **Issue作成**: 機能要求やバグ報告
2. **ブランチ作成**: \`feature/[issue-number]-[brief-description]\`
3. **開発・テスト**: コード作成とテスト実行
4. **プルリクエスト**: develop branchへのPR作成
5. **コードレビュー**: チームメンバーによるレビュー
6. **マージ**: レビュー完了後にマージ

### コーディング規約

- **TypeScript**: 厳密な型定義を使用
- **ESLint/Prettier**: コードフォーマットの統一
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/)形式
- **テスト**: 新機能には必ずテストを追加

### プルリクエストガイドライン

- 明確なタイトルと説明を記載
- 関連するIssueをリンク
- スクリーンショット（UI変更の場合）
- 破壊的変更がある場合は明記

## 📚 関連ドキュメント

- [プロジェクト仕様書](./CLAUDE.md) - 詳細な技術仕様
- [リファクタリングレポート](./REFACTORING.md) - コード改善履歴
- [Notion API設定ガイド](./docs/notion-setup.md) - Notion連携設定
- [デプロイガイド](./docs/deployment.md) - 本番環境デプロイ手順

## 📞 サポート

### 質問・相談
- GitHub Issues: バグ報告・機能要求
- Discord: リアルタイム質問（開発チーム）
- Wiki: FAQ・Tips集

### 貢献者
- フロントエンド: React + TypeScript スペシャリスト
- バックエンド: Node.js + Express スペシャリスト  
- デザイン: UI/UXデザイナー
- DevOps: インフラエンジニア

## 📄 ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照

---

<div align="center">

**⭐ このプロジェクトが役立ったら、ぜひスターをお願いします！**

[🐛 バグ報告](https://github.com/your-org/timecard_web_v3/issues/new?template=bug_report.md) • [💡 機能要求](https://github.com/your-org/timecard_web_v3/issues/new?template=feature_request.md) • [📖 ドキュメント](./docs/)

</div>